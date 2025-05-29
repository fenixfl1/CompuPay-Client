import React, { useCallback, useEffect, useState } from "react"
import type { TableColumnsType } from "antd"
import {
  PaymentDetail,
  PayrollEntry,
  PayrollHistory,
} from "@/interfaces/payroll"
import {
  CustomAvatar,
  CustomButton,
  CustomParagraph,
  CustomRow,
  CustomSpace,
  CustomSpin,
  CustomTable,
  CustomTag,
  CustomText,
  CustomTooltip,
} from "@/components/custom"
import formatter from "@/helpers/formatter"
import randomHexColorCode from "@/helpers/random-hex-color-code"
import useGetPayrollHistory from "@/services/hooks/payroll/useGetPayrollHistory"
import capitalize from "@/helpers/capitalize"
import usePayrollStore from "@/stores/payrollStore"
import { PrinterOutlined } from "@ant-design/icons"

const currencyFormatter = (value: string, record: PayrollEntry) =>
  formatter({
    value,
    format: "currency",
    prefix: record.CURRENCY,
    fix: 2,
  })

const PayrollHistoryTable: React.FC = () => {
  const [showExportOptions, setShowExportOptions] = useState(false)
  const {
    mutateAsync: getPayrollHistory,
    isPending: isGetPending,
    data: { data },
  } = useGetPayrollHistory()

  const { payrollInfo } = usePayrollStore()

  const expandedRowRender = (record: PayrollHistory) => {
    const showWithholding = record.CALC_DEDUCTIONS
    const columns: TableColumnsType<PayrollEntry> = [
      {
        key: "AVATAR",
        dataIndex: "AVATAR",
        align: "center",
        width: "5%",
        render: (value) => (
          <CustomAvatar
            style={{
              backgroundColor:
                value?.length === 2 ? randomHexColorCode() : undefined,
            }}
            src={value}
            size={"large"}
            shape={"circle"}
          >
            {value}
          </CustomAvatar>
        ),
      },
      {
        key: "FULL_NAME",
        dataIndex: "FULL_NAME",
        title: "Empleado",
      },
      {
        key: "SALARY",
        dataIndex: "SALARY",
        title: "Salario",
        render: currencyFormatter,
      },
      {
        key: "BONUS",
        dataIndex: "BONUS",
        title: "Bonos",
        render: currencyFormatter,
      },
      {
        key: "DISCOUNT",
        dataIndex: "DISCOUNT",
        title: "Descuentos",
        render: currencyFormatter,
      },
      {
        hidden: !showWithholding,
        key: "AFP",
        dataIndex: "AFP",
        title: "AFP",
        render: currencyFormatter,
      },
      {
        hidden: !showWithholding,
        key: "SFS",
        dataIndex: "SFS",
        title: "SFS",
        render: currencyFormatter,
      },
      {
        hidden: !showWithholding,
        key: "ISR",
        dataIndex: "ISR",
        title: "ISR",
        render: currencyFormatter,
      },
      {
        key: "NET_SALARY",
        dataIndex: "NET_SALARY",
        title: "Total entregado",
        render: (_, values) => {
          if (record.STATUS === "P") return <CustomRow>....</CustomRow>
          const withholdingValue = showWithholding
            ? values.AFP + values.SFS + values.ISR
            : 0

          const salary =
            values.SALARY / payrollInfo.PAYROLL_CONFIG.PERIODS +
            values.BONUS -
            values.DISCOUNT -
            withholdingValue
          return (
            <span>
              {formatter({
                value: salary,
                format: "currency",
                prefix: values.CURRENCY,
                fix: 2,
              })}
            </span>
          )
        },
      },
      {
        key: "DESC_STATUS",
        dataIndex: "DESC_STATUS",
        title: "Estado",
        width: "10%",
        align: "center",
      },
    ]

    const paymentDetails = (
      record: PayrollEntry & { PAYMENT_DETAILS: PaymentDetail[] }
    ) => {
      return (
        <CustomParagraph>
          {record.PAYMENT_DETAILS.map((item) => (
            <blockquote style={{ marginLeft: "50px" }}>
              <CustomText type={item.OPERATOR === "+" ? "success" : "danger"}>
                <CustomSpace direction={"horizontal"} size={"large"}>
                  <CustomText underline>{item.DESC_CONCEPT}</CustomText>
                  <span>{item.COMMENT}</span>
                  <span>
                    {formatter({
                      value: item.CONCEPT_AMOUNT,
                      format: "currency",
                      prefix: record.CURRENCY,
                    })}
                  </span>
                </CustomSpace>
              </CustomText>
            </blockquote>
          ))}
        </CustomParagraph>
      )
    }

    return (
      <CustomTable
        columns={columns}
        dataSource={record.ENTRIES}
        expandable={{
          expandedRowRender: paymentDetails,
          rowExpandable: (record) => !!record.PAYMENT_DETAILS.length,
        }}
        pagination={false}
        rowKey={(record) => record.PAYROLL_ENTRY_ID}
        exportable={{
          open: showExportOptions,
          onClose: () => setShowExportOptions(false),
          columnsMap,
        }}
      />
    )
  }

  const handleSearch = useCallback(() => {
    getPayrollHistory({
      page: 1,
      size: 10,
      condition: [
        {
          condition: false,
          dataType: "bool",
          field: "STATE",
          operator: "IS NULL",
        },
      ],
    })
  }, [])

  useEffect(handleSearch, [handleSearch])

  const columns: TableColumnsType<PayrollHistory> = [
    {
      title: "Descripción",
      dataIndex: "LABEL",
      key: "LABEL",
      render: (value) => <CustomText strong>{value}</CustomText>,
    },
    {
      title: "Fecha Inicio",
      dataIndex: "PERIOD_START",
      key: "PERIOD_START",
      render: (value) => capitalize(formatter({ value, format: "long_date" })),
    },
    {
      title: "Fecha Pago",
      dataIndex: "PERIOD_END",
      key: "PERIOD_END",
      render: (value) => capitalize(formatter({ value, format: "long_date" })),
    },
    {
      title: "Estado",
      dataIndex: "DESC_STATE",
      key: "DESC_STATE",
      width: "8%",
      render: (value, record) => (
        <CustomTag
          color={
            record["STATUS" as keyof PayrollHistory] === "F"
              ? "green"
              : "default"
          }
        >
          {value}
        </CustomTag>
      ),
    },
    {
      title: "Acciones",
      key: " ACTIONS",
      width: "5%",
      render: () => (
        <CustomTooltip title={"Generar Reporte"}>
          <CustomButton
            size={"large"}
            icon={<PrinterOutlined />}
            type={"text"}
            onClick={() => setShowExportOptions(true)}
          />
        </CustomTooltip>
      ),
    },
  ]

  const columnsMap: Record<string, string> = {
    FULL_NAME: "Nombre",
    SALARY: "Salario",
    OVERTIMES: "Horas Extras",
    BONUS: "Bonos",
    VACATIONS: "Vacaciones",
    DISCOUNT: "Descuentos",
    OTHER_DISCOUNT: "Otros Descuentos",
    AFP: "AFP",
    SFS: "SFS",
    ISR: "ISR",
    NET_SALARY: "Salario Neto",
    DESC_STATUS: "Estado",
  }

  return (
    <CustomSpin spinning={isGetPending}>
      <CustomTable
        size={"large"}
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.PAYROLL_ID}
        expandable={{ expandedRowRender }}
      />
    </CustomSpin>
  )
}

export default PayrollHistoryTable

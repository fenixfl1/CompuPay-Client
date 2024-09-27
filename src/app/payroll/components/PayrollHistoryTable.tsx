import React, { useCallback, useEffect } from "react"
import type { TableColumnsType } from "antd"
import {
  PaymentDetail,
  PayrollEntry,
  PayrollHistory,
} from "@/interfaces/payroll"
import {
  CustomAvatar,
  CustomParagraph,
  CustomSpace,
  CustomTable,
  CustomTag,
  CustomText,
} from "@/components/custom"
import formatter from "@/helpers/formatter"
import randomHexColorCode from "@/helpers/random-hex-color-code"
import useGetPayrollHistory from "@/services/hooks/payroll/useGetPayrollHistory"
import capitalize from "@/helpers/capitalize"

const currencyFormatter = (value: string, record: PayrollEntry) =>
  formatter({
    value,
    format: "currency",
    prefix: record.CURRENCY,
    fix: 2,
  })

const PayrollHistoryTable: React.FC = () => {
  const {
    mutateAsync: getPayrollHistory,
    data: { data },
  } = useGetPayrollHistory()
  const expandedRowRender = (record: PayrollHistory) => {
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
        key: "AFP",
        dataIndex: "AFP",
        title: "AFP",
        render: currencyFormatter,
      },
      {
        key: "SFS",
        dataIndex: "SFS",
        title: "SFS",
        render: currencyFormatter,
      },
      {
        key: "ISR",
        dataIndex: "ISR",
        title: "ISR",
        render: currencyFormatter,
      },
      {
        key: "NET_SALARY",
        dataIndex: "NET_SALARY",
        title: "Salario Neto",
        render: (_, record) => {
          const salary = record.SALARY - (record.AFP + record.SFS + record.ISR)
          return (
            <span>
              {formatter({
                value: salary,
                format: "currency",
                prefix: record.CURRENCY,
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
  ]

  return (
    <CustomTable
      size={"large"}
      columns={columns}
      dataSource={data}
      expandable={{ expandedRowRender }}
      rowKey={(record) => record.PAYROLL_ID}
    />
  )
}

export default PayrollHistoryTable

import {
  CustomButton,
  CustomCard,
  CustomCheckboxGroup,
  CustomCol,
  CustomDivider,
  CustomForm,
  CustomFormItem,
  CustomInputNumber,
  CustomPopConfirm,
  CustomPopover,
  CustomRow,
  CustomSearch,
  CustomSelect,
  CustomSpace,
  CustomSpin,
  CustomTable,
  CustomText,
  CustomTooltip,
} from "@/components/custom"
import formatter from "@/helpers/formatter"
import useDebounce from "@/hooks/useDebounce"
import { Payroll, PayrollEntry } from "@/interfaces/payroll"
import useGetPayrollEntries from "@/services/hooks/payroll/useGetPayrollEntries"
import { AdvancedCondition } from "@/services/interfaces"
import usePayrollStore from "@/stores/payrollStore"
import { ColumnType } from "antd/lib/table"
import React, { useCallback, useEffect, useState } from "react"
import CustomAvatar from "../../../components/custom/CustomAvatar"
import randomHexColorCode from "@/helpers/random-hex-color-code"
import {
  DollarOutlined,
  FilterOutlined,
  DeleteOutlined,
} from "@ant-design/icons"
import errorHandler from "@/helpers/errorHandler"
import useUpdatePayrollEntry from "@/services/hooks/payroll/useUpdatePayrollEntry"
import { customNotification } from "@/components/custom/customNotification"
import { TableRowSelection } from "antd/es/table/interface"
import makePagination from "@/helpers/pagination"
import { PopoverContainer } from "@/components/custom/CustomPopover"
import { Form } from "antd"
import { defaultBreakpoints, formItemLayout } from "@/styles/breakpoints"
import FilterTemplate from "@/components/FilterTemplate"
import useProcessPartialPayroll from "@/services/hooks/payroll/useProcessPartialPayroll"
import CustomInputGroup from "@/components/custom/CustomInputGroup"
import { CustomModalConfirmation } from "@/components/custom/CustomModalMethods"

const optionStyles: React.CSSProperties = {
  width: "100%",
}

const defaultSearchKey = ["USER__USERNAME", "USER__IDENTITY_DOCUMENT"]

const searchOptions = [
  {
    label: "Nombre",
    value: "USER__NAME",
    style: optionStyles,
  },
  {
    label: "Apellido",
    value: "USER__LAST_NAME",
    style: optionStyles,
  },
  {
    label: "Cédula",
    value: "USER__IDENTITY_DOCUMENT",
    style: optionStyles,
  },
  {
    label: "Usuario",
    value: "USER__USERNAME",
    style: optionStyles,
  },
  {
    label: "Correo",
    value: "USER__EMAIL",
    style: optionStyles,
  },
  {
    label: "Rol",
    value: "USER__ROLES__NAME",
    style: optionStyles,
  },
]

const actions = [
  {
    label: "Excluir Seleccionados",
    value: "E",
  },
  {
    label: "Procesar Seleccionados",
    value: "P",
  },
]

interface PayrollTableProps {
  payrollId?: number
}

const PayrollTable: React.FC<PayrollTableProps> = ({ payrollId }) => {
  const [form] = Form.useForm()
  const action = Form.useWatch("ACTION", form)
  const [searchValue, setSearchValue] = useState("")
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [shouldUpdate, setShouldUpdate] = useState(false)
  const debounce = useDebounce(searchValue)

  const { entries, metadata } = usePayrollStore()
  const { mutateAsync: updatePayrollEntry, isPending: isUpdatePending } =
    useUpdatePayrollEntry()
  const { mutateAsync: getPayrollEntries, isPending: isGetEntriesPending } =
    useGetPayrollEntries()
  const {
    mutateAsync: processPartialPayroll,
    isPending: isProcessPartialPending,
  } = useProcessPartialPayroll()

  const handleOnSearch = useCallback(
    (page = metadata?.page, size = metadata?.page_size) => {
      const data = form.getFieldsValue()
      if (!payrollId) return

      const condition: AdvancedCondition[] = [
        {
          condition: payrollId,
          dataType: "int",
          field: "PAYROLL_ID",
          operator: "=",
        },
      ]

      if (data.STATUS?.length) {
        condition.push({
          condition: data.STATUS,
          dataType: "list",
          field: "STATUS",
          operator: "IN",
        })
      }

      if (data.STATE?.length) {
        condition.push({
          condition: data.STATE,
          dataType: "list",
          field: "STATE",
          operator: "IN",
        })
      }

      if (data.MAX_SALARY) {
        condition.push({
          dataType: "list",
          field: "SALARY",
          operator: "BETWEEN",
          condition: [data.MIN_SALARY, data.MAX_SALARY],
        })
      }

      if (data.SEARCH_OPTIONS || debounce) {
        condition.push({
          dataType: "str",
          field: data.SEARCH_OPTIONS ?? defaultSearchKey,
          operator: "ILIKE",
          condition: debounce,
        })
      }

      getPayrollEntries({ condition, page, size })
    },
    [debounce, shouldUpdate, payrollId]
  )

  useEffect(handleOnSearch, [handleOnSearch])

  const handleUpdateEntry = async (record: PayrollEntry) => {
    try {
      const message = await updatePayrollEntry({
        PAYROLL_ENTRY_ID: record.PAYROLL_ENTRY_ID,
        STATE: record.STATE === "A" ? "I" : "A",
      })

      setShouldUpdate(!shouldUpdate)

      customNotification({
        message,
        description: "Operación exitosa",
      })
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleProcessPartialPayroll = async (record: PayrollEntry) => {
    try {
      const message = await processPartialPayroll({
        condition: {
          USERS: [record.USER],
          PAYROLL_ID: record.PAYROLL,
        },
      })

      customNotification({
        message,
        description: "Operación exitosa.",
        type: "success",
      })

      setShouldUpdate(!shouldUpdate)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleActions = async () => {
    const data = await form.validateFields()
    const actionLabel = actions.find(
      (item) => item.value === data.ACTION
    )?.label

    CustomModalConfirmation({
      title: "Confirmar acción",
      content: `¿Seguro que desea ${actionLabel}?`,
      onOk: async () => {
        try {
          switch (data.ACTION) {
            case "E": {
              for (const id of selectedRowKeys) {
                await handleUpdateEntry({
                  STATE: "A",
                  PAYROLL_ENTRY_ID: entries.find(
                    (item) => item.PAYROLL_ENTRY_ID === id
                  )?.PAYROLL_ENTRY_ID,
                } as any)
              }
              break
            }
            case "P": {
              const response = await processPartialPayroll({
                condition: {
                  PAYROLL_ID: payrollId,
                  USERS: entries
                    .filter((entry) =>
                      selectedRowKeys.includes(entry.PAYROLL_ENTRY_ID)
                    )
                    .map((item) => item.USER),
                },
              })

              customNotification({
                message: "Operación exitosa",
                description: response,
                type: "success",
              })

              setSelectedRowKeys([])
              setShouldUpdate(!shouldUpdate)
              break
            }
            default:
              break
          }
          form.resetFields(["ACTION"])
        } catch (error) {
          errorHandler(error)
        }
      },
    })
  }

  const currencyFormatter = (value: string, record: PayrollEntry) =>
    formatter({
      value,
      format: "currency",
      prefix: record.CURRENCY,
      fix: 2,
    })

  const column: ColumnType<PayrollEntry>[] = [
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
    {
      key: "ACTIONS",
      title: "Acciones",
      align: "center",
      width: "5%",
      render: (_, record) => (
        <CustomSpace
          direction={"horizontal"}
          split={<CustomDivider type={"vertical"} />}
        >
          <CustomTooltip placement={"leftBottom"} title="Procesar Pago">
            <CustomPopConfirm
              title={"¿Seguro que desea pagar la nómina a este empleado?"}
              onConfirm={() => handleProcessPartialPayroll(record)}
            >
              <CustomButton
                disabled={record.STATUS}
                size="middle"
                type="link"
                icon={<DollarOutlined />}
              />
            </CustomPopConfirm>
          </CustomTooltip>
          <CustomTooltip
            placement={"rightBottom"}
            title="Remover de la nómina de este periodo"
          >
            <CustomButton
              size="middle"
              danger
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => handleUpdateEntry(record)}
            />
          </CustomTooltip>
        </CustomSpace>
      ),
    },
  ]

  const popoverContent = (
    <FilterTemplate
      form={form}
      onSearch={handleOnSearch}
      onFilter={() => setShouldUpdate(!shouldUpdate)}
    >
      <CustomSpace>
        <CustomCol xs={24}>
          <CustomFormItem
            layout="vertical"
            name={"STATE"}
            labelCol={{ span: 24 }}
            label={<CustomText strong>Estado empleado</CustomText>}
          >
            <CustomCheckboxGroup
              options={[
                { label: "Activos", value: "A" },
                { label: "Inactivos", value: "I" },
              ]}
            />
          </CustomFormItem>
        </CustomCol>
        <CustomCol xs={24}>
          <CustomFormItem
            layout="vertical"
            name={"STATUS"}
            labelCol={{ span: 24 }}
            label={<CustomText strong>Estado en nómina</CustomText>}
          >
            <CustomCheckboxGroup
              options={[
                { label: "Pagado", value: true },
                { label: "Pendiente", value: false },
              ]}
            />
          </CustomFormItem>
        </CustomCol>
        <CustomCol xs={24}>
          <CustomFormItem
            layout="vertical"
            labelCol={{ span: 24 }}
            label={<CustomText strong>Rango salarial</CustomText>}
          >
            <CustomSpace direction="horizontal">
              <CustomFormItem name={"MIN_SALARY"} noStyle initialValue={0}>
                <CustomInputNumber
                  format={{ format: "currency", currency: "RD" }}
                  placeholder={"Mínimo"}
                  width={100}
                />
              </CustomFormItem>
              <CustomFormItem name={"MAX_SALARY"} noStyle>
                <CustomInputNumber
                  format={{ format: "currency", currency: "RD" }}
                  placeholder={"Máximo"}
                  width={100}
                />
              </CustomFormItem>
            </CustomSpace>
          </CustomFormItem>
        </CustomCol>
        <CustomCol xs={24}>
          <CustomFormItem
            layout="vertical"
            name={"SEARCH_OPTIONS"}
            label={<CustomText strong>Buscar por</CustomText>}
            labelCol={{ span: 24 }}
            initialValue={defaultSearchKey}
          >
            <CustomSelect
              placeholder={"Seleccionar opciones"}
              options={searchOptions}
              mode={"multiple"}
            />
          </CustomFormItem>
        </CustomCol>
      </CustomSpace>
    </FilterTemplate>
  )

  const tableTitle = () => (
    <CustomCol xs={24}>
      <CustomRow justify={"space-between"}>
        <CustomTooltip title={"Filtros"}>
          <CustomPopover title={"Filtros"} content={popoverContent}>
            <CustomButton
              size={"large"}
              type={"text"}
              icon={<FilterOutlined />}
            />
          </CustomPopover>
        </CustomTooltip>

        <CustomCol xs={24} md={18} lg={10}>
          <CustomSearch
            placeholder={"Buscar empleado en nómina..."}
            onChange={({ target }) => setSearchValue(target.value)}
          />
        </CustomCol>
      </CustomRow>
    </CustomCol>
  )

  const footer = () => (
    <CustomForm form={form}>
      <CustomRow justify={"start"}>
        <CustomCol xs={24} md={18} lg={12}>
          <CustomFormItem label={"Acción"}>
            <CustomInputGroup compact>
              <CustomCol xs={24}>
                <CustomFormItem label={"Acción"} noStyle name={"ACTION"}>
                  <CustomSelect
                    disabled={!selectedRowKeys.length}
                    width={"100%"}
                    placeholder={"Seleccionar acción"}
                    options={actions}
                    allowClear
                  />
                </CustomFormItem>
              </CustomCol>
              <CustomFormItem noStyle>
                <CustomButton
                  disabled={!action}
                  onClick={handleActions}
                  type={"primary"}
                >
                  Ejecutar
                </CustomButton>
              </CustomFormItem>
            </CustomInputGroup>
          </CustomFormItem>
        </CustomCol>
      </CustomRow>
    </CustomForm>
  )

  const rowSelection: TableRowSelection<PayrollEntry> = {
    type: "checkbox",
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    getCheckboxProps: (record) => ({
      disabled: record.STATUS,
    }),
  }

  return (
    <CustomSpin
      spinning={
        isGetEntriesPending || isProcessPartialPending || isUpdatePending
      }
    >
      <CustomCol xs={24}>
        <CustomCard style={{ marginTop: "10px" }}>
          <CustomTable
            rowSelection={rowSelection}
            footer={footer}
            title={tableTitle}
            dataSource={entries}
            columns={column}
            rowKey={(record) => record.PAYROLL_ENTRY_ID}
            rowClassName={(record) =>
              record.STATUS ? "payroll-processed" : ""
            }
            pagination={makePagination(metadata)}
            onChange={({ pageSize, current }) =>
              handleOnSearch(current, pageSize)
            }
          />
        </CustomCard>
      </CustomCol>
    </CustomSpin>
  )
}

export default PayrollTable

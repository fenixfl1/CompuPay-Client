import {
  CustomButton,
  CustomCard,
  CustomCheckboxGroup,
  CustomCol,
  CustomDivider,
  CustomForm,
  CustomFormItem,
  CustomInputNumber,
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
import { PayrollEntry, PayrollParameters } from "@/interfaces/payroll"
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
  StopOutlined,
  PrinterOutlined,
} from "@ant-design/icons"
import errorHandler from "@/helpers/errorHandler"
import useUpdatePayrollEntry from "@/services/hooks/payroll/useUpdatePayrollEntry"
import { customNotification } from "@/components/custom/customNotification"
import { TableRowSelection } from "antd/es/table/interface"
import makePagination from "@/helpers/pagination"
import { Form } from "antd"
import FilterTemplate from "@/components/FilterTemplate"
import useProcessPartialPayroll from "@/services/hooks/payroll/useProcessPartialPayroll"
import CustomInputGroup from "@/components/custom/CustomInputGroup"
import { CustomModalConfirmation } from "@/components/custom/CustomModalMethods"
import useMenuOptionStore from "@/stores/useMenuOptionStore"
import useIsAuthorized from "@/hooks/useIsAuthorized"
import ConditionalComponent from "@/components/ConditionalComponent"
import { useWebSocket } from "@/context/web-socket"
import moment from "moment"
import useGenerateReport from "@/services/hooks/reports/useGenerateReport"
import { openReport } from "@/helpers/open-report"

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

  const socket = useWebSocket()

  const [condition, setCondition] = useState<AdvancedCondition[]>([])
  const [searchValue, setSearchValue] = useState("")
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [shouldUpdate, setShouldUpdate] = useState(false)
  const debounce = useDebounce(searchValue)

  const { parameters } = useMenuOptionStore<PayrollParameters>()
  const { entries, metadata, payrollInfo } = usePayrollStore()

  const { mutateAsync: updatePayrollEntry, isPending: isUpdatePending } =
    useUpdatePayrollEntry()
  const { mutateAsync: getPayrollEntries, isPending: isGetEntriesPending } =
    useGetPayrollEntries()
  const {
    mutateAsync: processPartialPayroll,
    isPending: isProcessPartialPending,
  } = useProcessPartialPayroll()
  const { mutateAsync: generateReport, isPending: isGenerateReportPending } =
    useGenerateReport("payroll")

  const { OPERATION_ID_PROCESS_PAYROLL, OPERATION_ID_REMOVE_PAYROLL_ENTRY } =
    parameters

  const allowProcess = useIsAuthorized(Number(OPERATION_ID_PROCESS_PAYROLL))
  const allowRemove = useIsAuthorized(Number(OPERATION_ID_REMOVE_PAYROLL_ENTRY))

  const showWithholding =
    payrollInfo.CURRENT_PERIOD === payrollInfo?.PAYROLL_CONFIG?.PERIODS

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

      setCondition(condition)

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
          INCLUDES_OVERTIME: true,
        },
      })

      customNotification({
        message,
        description: "Operación exitosa.",
        type: "success",
      })

      if (socket) {
        socket.send(
          JSON.stringify({
            receivers: [record.USER],
            message: `
              Estimado/a @${record.FULL_NAME}@,
              Nos complace informarte que tu nómina correspondiente al período del #${moment(payrollInfo.PERIOD_START)}# al #${moment(payrollInfo.PERIOD_END)}# 
              ha sido procesada exitosamente.
              Si tienes alguna duda sobre los detalles del pago, por favor no dudes en contactar al departamento de Recursos Humanos.
            `,
          })
        )
      }

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
              const users = entries
                .filter((entry) =>
                  selectedRowKeys.includes(entry.PAYROLL_ENTRY_ID)
                )
                .map((item) => item.USER)
              const response = await processPartialPayroll({
                condition: {
                  PAYROLL_ID: payrollId,
                  USERS: users,
                },
              })

              if (socket) {
                socket.send(
                  JSON.stringify({
                    receivers: users,
                    message: `
                      Estimado/a,
                      Nos complace informarte que tu nómina correspondiente al período del #${moment(payrollInfo.PERIOD_START)}# al #${moment(payrollInfo.PERIOD_END)}# 
                      ha sido procesada exitosamente.
                      Si tienes alguna duda sobre los detalles del pago, por favor no dudes en contactar al departamento de Recursos Humanos.
                    `,
                  })
                )
              }

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

  const handleOnGenerateReporte = async () => {
    try {
      const response = await generateReport({
        condition,
        rp_name: "current_payroll",
      })

      openReport(response, "Reporte de nómina")
    } catch (error) {
      errorHandler(error)
    }
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
      hidden: !payrollInfo?.INCLUDES_OVERTIME,
      key: "OVERTIMES",
      dataIndex: "OVERTIMES",
      title: "Horas extras",
      render: currencyFormatter,
    },
    {
      key: "BONUS",
      dataIndex: "BONUS",
      title: "Bonos",
      render: currencyFormatter,
    },
    {
      hidden: !payrollInfo?.INCLUDES_LEAVES,
      key: "VACATIONS",
      dataIndex: "VACATIONS",
      title: "Vacaciones",
      render: currencyFormatter,
    },
    {
      key: "DISCOUNT",
      dataIndex: "DISCOUNT",
      title: "Descuentos",
      render: currencyFormatter,
    },
    {
      hidden: !payrollInfo?.INCLUDES_LEAVES,
      key: "OTHER_DISCOUNT",
      dataIndex: "OTHER_DISCOUNT",
      title: "Otros descuentos",
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
      title: (
        <CustomTooltip
          title={
            "Es el salario neto a entregar en este periodo de nomina aplicado los descuentos, deducciones y bonos"
          }
        >
          <span>Neto del periodo</span>
        </CustomTooltip>
      ),
      render: (_, record) => {
        const withholdingValue = showWithholding
          ? record.AFP + record.SFS + record.ISR
          : 0

        const overtime = payrollInfo.INCLUDES_OVERTIME ? record.OVERTIMES : 0
        const other_discount = payrollInfo.INCLUDES_LEAVES
          ? record.OTHER_DISCOUNT
          : 0
        const vacations = payrollInfo.INCLUDES_LEAVES ? record.VACATIONS : 0

        const salary =
          record.SALARY / payrollInfo.PAYROLL_CONFIG.PERIODS +
          overtime +
          vacations +
          record.BONUS -
          record.DISCOUNT -
          other_discount -
          withholdingValue
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
      fixed: "right",
      key: "ACTIONS",
      title: "Acciones",
      align: "center",
      width: "5%",
      render: (_, record) => (
        <CustomSpace
          direction={"horizontal"}
          split={<CustomDivider type={"vertical"} />}
        >
          <ConditionalComponent
            condition={allowProcess}
            visible
            message={"No tienes autorización para realizar esta acción."}
            onClick={() => {
              CustomModalConfirmation({
                onOk: () => handleProcessPartialPayroll(record),
                title: "Confirmación",
                content:
                  "¿Esta seta seguro que desea procesar el pago de nómina de este empleado?",
              })
            }}
          >
            <CustomTooltip placement={"leftBottom"} title="Procesar Pago">
              <CustomButton
                disabled={!!record.STATUS}
                size="middle"
                type="link"
                icon={<DollarOutlined />}
              />
            </CustomTooltip>
          </ConditionalComponent>
          <ConditionalComponent
            condition={allowRemove}
            visible
            message={"No tienes autorización para realizar esta acción."}
            onClick={() => {
              CustomModalConfirmation({
                onOk: () => handleUpdateEntry(record),
                title: "Confirmación",
                content:
                  "¿Esta seta seguro que desea remover a este empleado de la nómina?",
              })
            }}
          >
            <CustomTooltip
              placement={"rightBottom"}
              title="Remover de la nómina de este periodo"
            >
              <CustomButton
                size="middle"
                danger
                type="link"
                icon={<StopOutlined />}
              />
            </CustomTooltip>
          </ConditionalComponent>
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
        <CustomCol xs={4} md={6} lg={10}>
          <CustomRow gap={15} justify={"start"}>
            <CustomTooltip title={"Filtros"}>
              <CustomPopover title={"Filtros"} content={popoverContent}>
                <CustomButton
                  size={"large"}
                  type={"text"}
                  icon={<FilterOutlined />}
                />
              </CustomPopover>
            </CustomTooltip>

            <CustomTooltip title={"Generar Reporte"}>
              <CustomButton
                size={"large"}
                icon={<PrinterOutlined />}
                type={"text"}
                onClick={handleOnGenerateReporte}
              />
            </CustomTooltip>
          </CustomRow>
        </CustomCol>

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
        <CustomCol xs={24} md={18}>
          <CustomFormItem label={"Acción"}>
            <CustomRow justify={"start"}>
              <CustomCol xs={8}>
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
            </CustomRow>
          </CustomFormItem>
        </CustomCol>
      </CustomRow>
    </CustomForm>
  )

  const rowSelection: TableRowSelection<PayrollEntry> = {
    type: "checkbox",
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    getCheckboxProps: (record: any) => ({
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
            rowSelection={allowProcess ? rowSelection : undefined}
            footer={allowProcess ? footer : undefined}
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

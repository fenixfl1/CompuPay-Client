import {
  CustomAvatar,
  CustomButton,
  CustomCard,
  CustomCheckboxGroup,
  CustomCol,
  CustomDivider,
  CustomFormItem,
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
import randomHexColorCode from "@/helpers/random-hex-color-code"
import useDebounce from "@/hooks/useDebounce"
import { Adjustment, PayrollParameters } from "@/interfaces/payroll"
import useGetAdjustments from "@/services/hooks/payroll/useGetAdjustments"
import { AdvancedCondition } from "@/services/interfaces"
import { defaultBreakpoints } from "@/styles/breakpoints"
import {
  DashOutlined,
  StopOutlined,
  EditOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons"
import { ColumnType } from "antd/lib/table"
import React, { useCallback, useEffect, useState } from "react"
import AdjustmentForm from "./AdjustmentForm"
import { Form } from "antd"
import formatter from "@/helpers/formatter"
import useCreateAdjustment from "@/services/hooks/payroll/useCreateAdjustment"
import errorHandler from "@/helpers/errorHandler"
import { customNotification } from "@/components/custom/customNotification"
import FilterTemplate from "@/components/FilterTemplate"
import usePayrollStore from "@/stores/payrollStore"
import useUpdateAdjustment from "@/services/hooks/payroll/useUpdateAdjustment"
import { CustomModalConfirmation } from "@/components/custom/CustomModalMethods"
import useIsAuthorized from "@/hooks/useIsAuthorized"
import useMenuOptionStore from "@/stores/useMenuOptionStore"
import ConditionalComponent from "@/components/ConditionalComponent"
import { useWebSocket } from "@/context/web-socket"
import moment from "moment"
import { date } from "@/helpers/date-helpers"
import useUserStore from "@/stores/userStore"
import makePagination from "@/helpers/pagination"

const optionStyles: React.CSSProperties = {
  width: "100%",
}

const defaultSearchKey = [
  "payroll_entry__user__username",
  "payroll_entry__user__identity_document",
]

const searchOptions = [
  {
    label: "Nombre",
    value: "payroll_entry__user__name",
    style: optionStyles,
  },
  {
    label: "Apellido",
    value: "payroll_entry__user__name",
    style: optionStyles,
  },
  {
    label: "Cédula",
    value: "payroll_entry__user__identity_document",
    style: optionStyles,
  },
  {
    label: "Usuario",
    value: "payroll_entry__user__username",
    style: optionStyles,
  },
]

const AdjustmentTab: React.FC = () => {
  const [form] = Form.useForm()

  const socket = useWebSocket()

  const [recordSelected, setRecordSelected] = useState<Adjustment>()
  const [modalVisibilityState, setModalVisibilityState] = useState(false)
  const [shouldUpdate, setShouldUpdate] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const debounce = useDebounce(searchValue)
  const {
    mutateAsync: getAdjustments,
    isPending,
    data: { data: dataSource, metadata },
  } = useGetAdjustments()
  const { mutateAsync: createAdjustment, isPending: isCreatePending } =
    useCreateAdjustment()
  const { mutateAsync: updateAdjustment, isPending: isUpdatePending } =
    useUpdateAdjustment()

  const { users } = useUserStore()
  const { payrollInfo } = usePayrollStore()
  const { parameters } = useMenuOptionStore<PayrollParameters>()

  const { OPERATION_ID_CREATE_ADJUSTMENTS } = parameters

  const allowCreate = useIsAuthorized(Number(OPERATION_ID_CREATE_ADJUSTMENTS))

  const handleOnSearch = useCallback(
    (page = metadata?.page, size = metadata?.page_size) => {
      const data = form.getFieldsValue()
      const condition: AdvancedCondition[] = [
        {
          condition: payrollInfo.PAYROLL_ID,
          dataType: "int",
          field: "payroll_entry__payroll__payroll_id",
          operator: "=",
        },
        {
          condition: data.STATE || ["A"],
          dataType: "list",
          field: "STATE",
          operator: "IN",
        },
      ]

      if (data.SEARCH_OPTIONS || debounce) {
        condition.push({
          dataType: "str",
          field: data.SEARCH_OPTIONS ?? defaultSearchKey,
          operator: "ILIKE",
          condition: debounce,
        })
      }

      if (Array.isArray(data.TYPE)) {
        condition.push({
          condition: data.TYPE,
          dataType: "list",
          field: "TYPE",
          operator: "IN",
        })
      }

      getAdjustments({ condition, page, size })
    },
    [debounce, shouldUpdate, payrollInfo]
  )

  useEffect(handleOnSearch, [handleOnSearch])

  const handleModalState = () => setModalVisibilityState(!modalVisibilityState)

  const handleOnFinish = async () => {
    try {
      const data = await form.validateFields()

      data.PAYROLL_ID = payrollInfo.PAYROLL_ID
      data.STATE = "A"

      let message = ""
      if (recordSelected) {
        message = await updateAdjustment({
          ADJUSTMENT_ID: recordSelected.ADJUSTMENT_ID,
          PAYROLL: recordSelected.PAYROLL_ID,
          USERNAME: recordSelected.USERNAME,
          ...data,
        })

        setRecordSelected(undefined)
      } else {
        if (socket) {
          const [user] = users.filter((user) => user.USERNAME === data.USERNAME)
          socket.send(
            JSON.stringify({
              receivers: [data.USERNAME],
              message: `
                Estimado/a @${user.NAME} ${user.LAST_NAME},
                Te informamos que en tu nómina correspondiente al período del #${date(payrollInfo.PERIOD_START)}# al #${date(payrollInfo.PERIOD_END)}# 
                se ha aplicado un ${data.TYPE === "B" ? "bono" : "descuento"} por concepto de #${data.DESCRIPTION}# por un monto de #${data.AMOUNT}#.
                Si tienes alguna inquietud o deseas obtener más información, puedes comunicarte con el departamento de Recursos Humanos.
              `,
            })
          )
        }
        await createAdjustment(data)
      }

      handleModalState()
      handleOnSearch()
      customNotification({
        type: "success",
        description: message || "Registro completado con éxito.",
        message: "Operación exitosa",
      })
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdate = async (record: Adjustment) => {
    CustomModalConfirmation({
      title: "Confirmación",
      content: `¿Seguro que desea ${record.STATE === "I" ? "Activar" : "Anular"} el registro?`,
      onOk: async () => {
        try {
          const message = await updateAdjustment({
            ADJUSTMENT_ID: record.ADJUSTMENT_ID,
            STATE: record.STATE === "A" ? "I" : "A",
            USERNAME: record.USERNAME,
            PAYROLL: record.PAYROLL_ID,
          })

          customNotification({
            message: "Operación exitosa",
            description: message,
          })
          setShouldUpdate(!shouldUpdate)
        } catch (error) {
          errorHandler(error)
        }
      },
    })
  }

  const columns: ColumnType<Adjustment>[] = [
    {
      key: "AVATAR",
      dataIndex: "AVATAR",
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
      key: "USER",
      dataIndex: "USER",
      title: "Empleado",
    },
    {
      key: "DESC_CONCEPT",
      dataIndex: "DESC_CONCEPT",
      title: "Concepto",
    },
    {
      key: "AMOUNT",
      dataIndex: "AMOUNT",
      title: "Monto",
      render: (value) => formatter({ value, format: "currency" }),
    },
    {
      key: "DESCRIPTION",
      dataIndex: "DESCRIPTION",
      title: "Descripción",
    },
    {
      key: "DESC_STATE",
      dataIndex: "DESC_STATE",
      title: "Estado",
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
          <CustomTooltip title={"Editar"}>
            <CustomButton
              size={"middle"}
              type={"link"}
              icon={<EditOutlined />}
              onClick={() => {
                setRecordSelected(record)
                setModalVisibilityState(true)
              }}
            />
          </CustomTooltip>
          <CustomTooltip title={"Inactiva"}>
            <CustomButton
              size={"middle"}
              danger={record.STATE === "A"}
              type={record.STATE === "A" ? "link" : "text"}
              icon={<StopOutlined />}
              onClick={() => handleUpdate(record)}
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
                { label: "Saldada ", value: "S" },
              ]}
            />
          </CustomFormItem>
        </CustomCol>
        <CustomCol xs={24}>
          <CustomFormItem
            layout="vertical"
            name={"TYPE"}
            labelCol={{ span: 24 }}
            label={<CustomText strong>Estado empleado</CustomText>}
          >
            <CustomCheckboxGroup
              options={[
                { label: "Bono", value: "B" },
                { label: "Descuento", value: "D" },
              ]}
            />
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

        <CustomCol {...defaultBreakpoints}>
          <CustomRow justify={"space-between"} gap={1} width={"100%"}>
            <CustomSearch
              width={"77%"}
              onChange={({ target }) => setSearchValue(target.value)}
              placeholder={"Buscar empleado..."}
            />

            <ConditionalComponent
              visible
              message={"No tienes autorización para realizar esta acción."}
              condition={allowCreate}
              onClick={handleModalState}
            >
              <CustomButton type={"primary"} icon={<PlusOutlined />}>
                Agregar Nuevo
              </CustomButton>
            </ConditionalComponent>
          </CustomRow>
        </CustomCol>
      </CustomRow>
    </CustomCol>
  )

  return (
    <>
      <CustomCol xs={24}>
        <CustomCard>
          <CustomCol xs={24}>
            <CustomTable
              loading={isPending}
              dataSource={dataSource}
              title={tableTitle}
              columns={columns}
              pagination={makePagination(metadata)}
              onChange={({ pageSize, current }) =>
                handleOnSearch(current, pageSize)
              }
            />
          </CustomCol>
        </CustomCard>
      </CustomCol>

      <AdjustmentForm
        form={form}
        loading={isCreatePending || isUpdatePending}
        onCancel={handleModalState}
        onFinish={handleOnFinish}
        open={modalVisibilityState}
        record={recordSelected}
      />
    </>
  )
}

export default AdjustmentTab

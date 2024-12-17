import {
  CustomButton,
  CustomCheckboxGroup,
  CustomCol,
  CustomDivider,
  CustomFormItem,
  CustomPopConfirm,
  CustomPopover,
  CustomRangePicker,
  CustomRow,
  CustomSearch,
  CustomSelect,
  CustomSpace,
  CustomTable,
  CustomText,
  CustomTooltip,
} from "@/components/custom"
import FilterTemplate from "@/components/FilterTemplate"
import errorHandler from "@/helpers/errorHandler"
import makePagination from "@/helpers/pagination"
import useGetLeave from "@/services/hooks/leaves/useGetLeave"
import useLeaveStore from "@/stores/leaveStore"
import useModalStore from "@/stores/modalStore"
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  FilterOutlined,
  StopOutlined,
} from "@ant-design/icons"
import { Form, theme } from "antd"
import { ColumnType } from "antd/lib/table"
import React from "react"

interface LeavesTableProps {
  searchKey: (value: string) => void
  onUpdate: (record: Leave) => Promise<void>
  onSearch: (
    current?: number,
    pageSize?: number,
    data?: Record<string, any>
  ) => void
}

const LeavesTable: React.FC<LeavesTableProps> = ({
  onSearch,
  searchKey,
  onUpdate,
}) => {
  const [form] = Form.useForm()
  const { leaves, metadata } = useLeaveStore()
  const { setVisible } = useModalStore()

  const {
    token: { colorError, colorTextQuaternary },
  } = theme.useToken()

  const { mutateAsync: getLeave } = useGetLeave()

  const handleOnEdit = async (record: Leave) => {
    try {
      await getLeave(record.LEAVE_ID)
      setVisible(true)
    } catch (error) {
      errorHandler(error)
    }
  }

  const columns: ColumnType<Leave>[] = [
    {
      title: "ID",
      dataIndex: "LEAVE_ID",
      key: "LEAVE_ID",
    },
    {
      title: "Empleado",
      dataIndex: "EMPLOYEE",
      key: "EMPLOYEE",
      render: (value) => `@${value}`,
    },
    {
      title: "Razón",
      dataIndex: "DESC_CONCEPT",
      key: "DESC_CONCEPT",
    },
    {
      title: "Días",
      dataIndex: "DAYS",
      key: "DAYS",
    },
    {
      title: "Fecha",
      dataIndex: "DATE_RANGE",
      key: "DATE_RANGE",
    },
    {
      title: "Comentario",
      dataIndex: "COMMENT",
      key: "COMMENT",
    },
    {
      title: "¿Pagado?",
      dataIndex: "IS_PAID",
      key: "IS_PAID",
      align: "center",
      render: (value) =>
        value ? (
          <CheckOutlined />
        ) : (
          <CloseOutlined style={{ color: colorError }} />
        ),
    },
    {
      width: "5%",
      title: "Acciones",
      render: (_, record) => {
        const isActive = record.STATE === "A"
        return (
          <CustomSpace
            direction={"horizontal"}
            split={<CustomDivider type={"vertical"} />}
          >
            <CustomTooltip title={"Editar"}>
              <CustomButton
                disabled={record.IS_PAID}
                onClick={() => handleOnEdit(record)}
                type={"link"}
                icon={<EditOutlined />}
              />
            </CustomTooltip>
            <CustomTooltip title={isActive ? "Inhabilitar" : "Activar"}>
              <CustomPopConfirm
                onConfirm={() => onUpdate(record)}
                title={
                  isActive
                    ? "¿Seguro que desea inhabilitar el registro?"
                    : "¿Seguro que desea rehabilitar el registro?"
                }
              >
                <CustomButton
                  danger={isActive}
                  type={"link"}
                  icon={
                    isActive ? (
                      <StopOutlined />
                    ) : (
                      <StopOutlined style={{ color: colorTextQuaternary }} />
                    )
                  }
                />
              </CustomPopConfirm>
            </CustomTooltip>
          </CustomSpace>
        )
      },
    },
  ]

  const content = (
    <FilterTemplate
      form={form}
      onFilter={() => {
        const data = form.getFieldsValue()
        onSearch(metadata.page, metadata.page_size, data)
      }}
    >
      <CustomSpace>
        <CustomCol xs={24}>
          <CustomFormItem
            layout="vertical"
            name={"STATE"}
            label={<CustomText strong>Estado</CustomText>}
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
          <CustomFormItem label={"Rango de Fecha"} name={"RANGE_DATE"}>
            <CustomRangePicker />
          </CustomFormItem>
        </CustomCol>
        <CustomCol xs={24}>
          <CustomFormItem
            label={<CustomText strong>Tipo</CustomText>}
            layout={"vertical"}
            name={"CONCEPT"}
            labelCol={{ span: 24 }}
          >
            <CustomSelect
              mode={"multiple"}
              options={[
                {
                  label: "Vacaciones",
                  value: 7,
                },
                { label: "Salud", value: 8 },
                { label: "Ausencia", value: 9 },
                { label: "Otro", value: 10 },
              ]}
              placeholder={"Seleccionar la razón"}
            />
          </CustomFormItem>
        </CustomCol>
      </CustomSpace>
    </FilterTemplate>
  )

  const title = () => (
    <CustomCol xs={24}>
      <CustomRow justify={"space-between"}>
        <CustomTooltip title={"Filtros"}>
          <CustomPopover title={"Filtros"} content={content}>
            <CustomButton
              size={"large"}
              type={"text"}
              icon={<FilterOutlined />}
            />
          </CustomPopover>
        </CustomTooltip>

        <CustomCol xs={24} md={18} lg={10}>
          <CustomSearch
            placeholder={"Buscar..."}
            onChange={({ target }) => searchKey(target.value)}
          />
        </CustomCol>
      </CustomRow>
    </CustomCol>
  )

  return (
    <CustomRow>
      <CustomCol xs={24}>
        <CustomTable
          title={title}
          columns={columns}
          dataSource={leaves}
          pagination={makePagination(metadata)}
          onChange={({ pageSize, current }) => onSearch(current, pageSize)}
        />
      </CustomCol>
    </CustomRow>
  )
}

export default LeavesTable

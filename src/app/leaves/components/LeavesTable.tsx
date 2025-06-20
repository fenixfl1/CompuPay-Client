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
  DownloadOutlined,
  EditOutlined,
  FilterOutlined,
  StopOutlined,
} from "@ant-design/icons"
import { Form, theme } from "antd"
import { ColumnType } from "antd/lib/table"
import React, { useState } from "react"

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

  const [showExportOptions, setShowExportOptions] = useState(false)

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
      dataIndex: "ESTADO",
      key: "ESTADO",
      align: "center",
      render: (state: string) =>
        state === "D" ? (
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
                disabled={record.STATE !== "A"}
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

  const toggleExportOptions = () => setShowExportOptions(!showExportOptions)

  const columnsMap = {
    LEAVE_ID: "ID",
    EMPLOYEE: "Empleado",
    DESC_CONCEPT: "Concepto",
    DAYS: "Cant. Dias",
    DATE_RANGE: "Fecha",
    COMMENT: "Comentario",
    STATE: "Pagado",
  }

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
          <CustomTooltip title={"Generar Reporte"}>
            <CustomButton
              size={"large"}
              icon={<DownloadOutlined />}
              type={"text"}
              onClick={toggleExportOptions}
            >
              Exportar Tabla
            </CustomButton>
          </CustomTooltip>
        </CustomRow>

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
          exportable={{
            open: showExportOptions,
            onClose: toggleExportOptions,
            columnsMap,
            getData: leaves.map((item) => {
              return {
                ...item,
                STATE: item.STATE === "D" ? "Sí" : "No",
              }
            }),
          }}
        />
      </CustomCol>
    </CustomRow>
  )
}

export default LeavesTable

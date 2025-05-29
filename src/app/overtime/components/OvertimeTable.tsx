import {
  CustomSpace,
  CustomCol,
  CustomFormItem,
  CustomText,
  CustomCheckboxGroup,
  CustomRangePicker,
  CustomSelect,
  CustomButton,
  CustomPopover,
  CustomRow,
  CustomSearch,
  CustomTable,
  CustomTooltip,
  CustomDivider,
  CustomPopConfirm,
} from "@/components/custom"
import FilterTemplate from "@/components/FilterTemplate"
import errorHandler from "@/helpers/errorHandler"
import formatter from "@/helpers/formatter"
import makePagination from "@/helpers/pagination"
import useGetOvertime from "@/services/hooks/overtime/useGetOvertime"
import useModalStore from "@/stores/modalStore"
import useOvertimeStore from "@/stores/overtimes"
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

interface OvertimeTableProps {
  searchKey: (value: string) => void
  onUpdate: (record: Overtime) => Promise<void>
  onSearch: (
    current?: number,
    pageSize?: number,
    data?: Record<string, any>
  ) => void
}

const OvertimeTable: React.FC<OvertimeTableProps> = ({
  searchKey,
  onUpdate,
  onSearch,
}) => {
  const [form] = Form.useForm()
  const {
    token: { colorError, colorTextQuaternary },
  } = theme.useToken()

  const { mutateAsync: getOvertime } = useGetOvertime()
  const { overtimeList, metadata } = useOvertimeStore()
  const { setVisible } = useModalStore()

  const [showExportOptions, setShowExportOptions] = useState(false)

  const handleOnEdit = async (record: Overtime) => {
    try {
      await getOvertime(record.OVERTIME_ID)
      setVisible(true)
    } catch (error) {
      errorHandler(error)
    }
  }

  const columns: ColumnType<Overtime>[] = [
    {
      title: "ID",
      dataIndex: "OVERTIME_ID",
      key: "OVERTIME_ID",
    },
    {
      title: "Empleado",
      dataIndex: "EMPLOYEE",
      key: "EMPLOYEE",
      render: (value) => `@${value}`,
    },
    {
      title: "Fecha",
      dataIndex: "DATE",
      key: "DATE",
      render: (value) => formatter({ value, format: "long_date" }),
    },
    {
      title: "Horas",
      dataIndex: "TIME",
      key: "TIME",
    },
    {
      title: "Costo Por horas",
      dataIndex: "RATE",
      key: "RATE",
      render: (value) =>
        formatter({ value, format: "currency", prefix: "RD", fix: 2 }),
    },
    {
      title: "Total",
      dataIndex: "TOTAL",
      render: (value) =>
        formatter({ value, format: "currency", prefix: "RD", fix: 2 }),
    },
    {
      title: "¿Pagado?",
      dataIndex: "PAID",
      key: "PAID",
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
            <CustomButton
              disabled={record.PAID}
              type={"link"}
              icon={<EditOutlined />}
              onClick={() => handleOnEdit(record)}
            />
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
    OVERTIME_ID: "ID",
    EMPLOYEE: "Usuario",
    DATE: "Fecha",
    TIME: "Horas",
    RATE: "Costo Por horas",
    TOTAL: "Total",
    PAID: "Pagado",
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
          <CustomFormItem
            layout="vertical"
            name={"PAID"}
            label={<CustomText strong>Estado de pago</CustomText>}
            labelCol={{ span: 24 }}
          >
            <CustomCheckboxGroup
              options={[
                { label: "Pagadas", value: true },
                { label: "Pendientes", value: false },
              ]}
            />
          </CustomFormItem>
        </CustomCol>
        <CustomCol xs={24}>
          <CustomFormItem label={"Rango de Fecha"} name={"RANGE_DATE"}>
            <CustomRangePicker />
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
          dataSource={overtimeList}
          pagination={makePagination(metadata)}
          onChange={({ pageSize, current }) => onSearch(current, pageSize)}
          exportable={{
            open: showExportOptions,
            onClose: toggleExportOptions,
            columnsMap,
            getData: overtimeList.map((item) => {
              return {
                ...item,
                PAID: item.PAID ? "Sí" : "No",
              }
            }),
          }}
        />
      </CustomCol>
    </CustomRow>
  )
}

export default OvertimeTable

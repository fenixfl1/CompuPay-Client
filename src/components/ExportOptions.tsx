import React, { useEffect, useRef, useState } from "react"
import {
  CustomButton,
  CustomCheckbox,
  CustomCheckboxGroup,
  CustomCol,
  CustomForm,
  CustomFormItem,
  CustomInput,
  CustomModal,
  CustomPopover,
  CustomRow,
  CustomSelect,
} from "./custom"
import { Form, InputRef } from "antd"
import errorHandler from "@/helpers/errorHandler"
import { DownloadOutlined, TableOutlined } from "@ant-design/icons"
import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
} from "@/helpers/report-helpers"
import { defaultBreakpoints, formItemLayout } from "@/styles/breakpoints"
import ConditionalComponent from "./ConditionalComponent"
import useUserStore from "@/stores/userStore"

const options = [
  {
    label: "PDF",
    value: "pdf",
  },
  {
    label: "Excel",
    value: "xlsx",
  },
  {
    label: "CSV",
    value: "csv",
  },
]

interface ExportOptionsProps<T = any> {
  dataSource: readonly T[]
  open: boolean
  onCancel?: () => void
  ref: React.ForwardedRef<any> | null
  columnsMap?: Record<string, string>
}

const ExportOptions: React.FC<ExportOptionsProps> = ({
  dataSource,
  open,
  onCancel,
  ref,
  columnsMap = {},
}) => {
  const [form] = Form.useForm()
  const title = Form.useWatch("title", form)
  const reportFormat = Form.useWatch("format", form)

  const inputRef = useRef<InputRef>(null)

  const [selectedColumns, setSelectedColumns] = useState<string[]>(() =>
    Object.keys(columnsMap).map((col) => col)
  )

  const { businessInfo } = useUserStore()

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [inputRef])

  useEffect(() => {
    if (title && reportFormat) {
      form.setFieldValue(
        "filename",
        title.replace(/\s/g, "_").toLowerCase() + `.${reportFormat}`
      )
    }
  }, [title, reportFormat])

  const handleExport = async () => {
    try {
      const data = await form.validateFields()

      data.ref = ref
      data.data = dataSource
      data.businessInfo = businessInfo
      data.columnsMap = {}

      selectedColumns.forEach((col) => {
        data.columnsMap[col] = columnsMap[col]
      })

      switch (data.format) {
        case "pdf":
          await exportToPDF(data)
          break
        case "xlsx":
          await exportToExcel(data)
          break
        case "csv":
          await exportToCSV(data)
          break
        default:
          break
      }

      onCancel?.()
    } catch (error) {
      errorHandler(error)
    }
  }

  const columnContent = (
    <div style={{ maxWidth: "250px" }}>
      <CustomCheckboxGroup
        value={selectedColumns}
        onChange={setSelectedColumns}
        options={Object.keys(columnsMap ?? {}).map((col) => ({
          label: columnsMap[col],
          value: col,
          style: { width: "100%" },
        }))}
      />
    </div>
  )

  return (
    <CustomModal
      closable={false}
      open={open}
      onCancel={onCancel}
      onOk={handleExport}
      okText={"Exportar"}
      title={"Opciones de Exportación"}
      okButtonProps={{ icon: <DownloadOutlined />, size: "small" }}
    >
      <CustomForm form={form} {...formItemLayout}>
        <CustomRow>
          <CustomCol {...defaultBreakpoints}>
            <CustomFormItem
              label={"Formato"}
              name={"format"}
              rules={[{ required: true }]}
              labelCol={{ xs: 10 }}
            >
              <CustomSelect
                placeholder={"Seleccionar formato"}
                options={options}
              />
            </CustomFormItem>
          </CustomCol>
          <CustomCol {...defaultBreakpoints}>
            <CustomFormItem
              label={"Orientación"}
              name={"orientation"}
              rules={[{ required: true }]}
              initialValue={"portrait"}
              labelCol={{ xs: 10 }}
            >
              <CustomSelect
                disabled={reportFormat !== "pdf"}
                placeholder={"Seleccionar formato"}
                options={[
                  { label: "Horizontal", value: "landscape" },
                  { label: "Vertical", value: "portrait" },
                ]}
              />
            </CustomFormItem>
          </CustomCol>
          <ConditionalComponent condition={reportFormat === "pdf"}>
            <CustomCol xs={24}>
              <CustomFormItem
                label={"Titulo"}
                name={"title"}
                rules={[{ required: true }]}
                labelCol={{ xs: 5 }}
              >
                <CustomInput
                  ref={inputRef}
                  placeholder={"Titulo del reporte"}
                />
              </CustomFormItem>
            </CustomCol>
          </ConditionalComponent>
          <CustomCol xs={24}>
            <CustomFormItem
              label={"Nombre Archivo"}
              name={"filename"}
              initialValue={"reporte"}
              rules={[{ required: true }]}
              labelCol={{ xs: 5 }}
            >
              <CustomInput ref={inputRef} placeholder={"Nombre del archivo"} />
            </CustomFormItem>
          </CustomCol>
          <CustomCol {...defaultBreakpoints}>
            <ConditionalComponent condition={!!Object.keys(columnsMap).length}>
              <CustomFormItem label={" "} colon={false}>
                <CustomPopover content={columnContent}>
                  <CustomButton
                    type={"text"}
                    size={"large"}
                    icon={<TableOutlined />}
                  >
                    Columnas
                  </CustomButton>
                </CustomPopover>
              </CustomFormItem>
            </ConditionalComponent>
          </CustomCol>
          <CustomCol {...defaultBreakpoints}>
            <CustomFormItem
              label={" "}
              colon={false}
              name={"showHead"}
              valuePropName={"checked"}
              labelCol={{ xs: 10 }}
              initialValue={true}
            >
              <CustomCheckbox>¿Incluir Cabeceras?</CustomCheckbox>
            </CustomFormItem>
          </CustomCol>
          <CustomCol {...defaultBreakpoints} />
        </CustomRow>
      </CustomForm>
    </CustomModal>
  )
}

export default ExportOptions

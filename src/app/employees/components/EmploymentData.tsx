import ConditionalComponent from "@/components/ConditionalComponent"
import {
  CustomForm,
  CustomRow,
  CustomCol,
  CustomFormItem,
  CustomInput,
  CustomDatePicker,
  CustomInputNumber,
  CustomSelect,
  CustomDragger,
  CustomCard,
  CustomButton,
  CustomSpace,
  CustomTooltip,
  CustomSpin,
  CustomDivider,
  CustomCheckboxGroup,
  CustomAlert,
} from "@/components/custom"
import {
  CustomLink,
  CustomParagraph,
  CustomText,
} from "@/components/custom/CustomParagraph"
import CustomUpload from "@/components/custom/CustomUpload"
import { base64ToBlob, downloadDocument } from "@/helpers/base64-helpers"
import createUploadObject from "@/helpers/build-file-list"
import { normalizeFiles } from "@/helpers/form-item-normalizers"
import { truncateText } from "@/helpers/truncateText"
import useDebounce from "@/hooks/useDebounce"
import useGetDeductionList from "@/services/hooks/payroll/useGetDeductionList"
import useGetDepartmentList from "@/services/hooks/user/useGetDepartmentList"
import useGetRolesList from "@/services/hooks/user/useGetRolesList"
import { useGetUserLIst } from "@/services/hooks/user/useGetUserList"
import useUpdateUser from "@/services/hooks/user/useUpdateUser"
import { AdvancedCondition } from "@/services/interfaces"
import useUserStore from "@/stores/userStore"
import {
  formItemLayout,
  defaultBreakpoints,
  labelColFullWidth,
} from "@/styles/breakpoints"
import {
  BulbOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  FileWordOutlined,
} from "@ant-design/icons"
import { FormInstance } from "antd"
import dayjs from "dayjs"
import Link from "next/link"
import React, { useCallback, useEffect, useState } from "react"
import styled from "styled-components"

export const documentIcons: Record<string, React.ReactNode> = {
  pdf: <FilePdfOutlined style={{ fontSize: "36px" }} />,
  docx: <FileWordOutlined style={{ fontSize: "36px" }} />,
}

const FilePreview = styled(CustomCard)`
  width: 100%;
  height: 80px;
  margin-top: 20px;
`

interface EmploymentDataProps {
  form: FormInstance
}

const EmploymentData: React.FC<EmploymentDataProps> = ({ form }) => {
  const [fileExtension, setFileExtension] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const debounce = useDebounce(searchKey)
  const { user } = useUserStore()

  const {
    mutateAsync: getRolesList,
    data: { data },
  } = useGetRolesList()
  const { mutateAsync: updateUser, isPending } = useUpdateUser()
  const {
    mutateAsync: getSupervisor,
    data: { data: supervisors },
  } = useGetUserLIst()
  const { mutateAsync: getDeductionList, data: deductions } =
    useGetDeductionList()
  const { mutateAsync: getDepartments, data: departments } =
    useGetDepartmentList()

  const handleSearchSupervisor = useCallback(() => {
    const condition: AdvancedCondition[] = [
      {
        condition: "A",
        dataType: "str",
        field: "STATE",
        operator: "=",
      },
      {
        condition: "A",
        dataType: "str",
        field: "roles__state",
        operator: "=",
      },
      {
        condition: "Supervisor",
        dataType: "str",
        field: "roles__name",
        operator: "ILIKE",
      },
      {
        condition: debounce,
        dataType: "str",
        field: "name",
        operator: "ILIKE",
      },
    ]

    getSupervisor({ page: 1, size: 20, condition })
  }, [])

  useEffect(handleSearchSupervisor, [handleSearchSupervisor])

  useEffect(() => {
    getRolesList({
      page: 1,
      size: 100,
      condition: [
        {
          condition: "A",
          dataType: "str",
          field: "STATE",
          operator: "=",
        },
        {
          condition: "A",
          dataType: "str",
          field: "rol_id__state",
          operator: "=",
        },
      ],
    })
  }, [])

  useEffect(() => {
    getDeductionList({
      condition: {
        STATE: "A",
      },
    })
  }, [])

  useEffect(() => {
    getDepartments({
      fields: ["DEPARTMENT_ID", "NAME"],
      condition: {
        STATE: "A",
      },
    })
  }, [])

  useEffect(() => {
    if (user?.RESUME) {
      const type = user.RESUME.split(",")[0].match(/:(.*?);/)?.[1] as string
      setFileExtension(type.split("/")[1])
    }
  }, [user])

  const handleUpdateResume = async () => {
    await updateUser({
      USER_ID: user?.USER_ID,
      RESUME: "",
    })

    form.setFieldsValue({ RESUME: [] })
  }

  return (
    <CustomSpin spinning={isPending}>
      <CustomForm form={form} {...formItemLayout} style={{ width: "100%" }}>
        <CustomRow justify={"start"}>
          <CustomCol {...defaultBreakpoints}>
            <CustomFormItem
              label={"Fecha Contratación"}
              name={"HIRED_DATE"}
              initialValue={dayjs()}
            >
              <CustomDatePicker placeholder={"DD/MM/YYYY"} />
            </CustomFormItem>
          </CustomCol>
          <CustomCol {...defaultBreakpoints}>
            <CustomFormItem
              label={"Salario"}
              name={"SALARY"}
              help={"Salario promedio mensual"}
            >
              <CustomInputNumber
                width={"60%"}
                format={{
                  format: "currency",
                  currency: "RD",
                }}
                placeholder={"Salario Bruto"}
              />
            </CustomFormItem>
          </CustomCol>
          <CustomCol {...defaultBreakpoints}>
            <CustomFormItem
              label={"Rol"}
              name={"ROLES"}
              rules={[{ required: true }]}
            >
              <CustomSelect
                placeholder={"Seleccionar Rol"}
                options={data?.map((item) => ({
                  label: item.NAME,
                  value: item.ROL_ID,
                }))}
              />
            </CustomFormItem>
          </CustomCol>
          <CustomCol {...defaultBreakpoints}>
            <CustomFormItem
              label={"Departamento"}
              name={"DEPARTMENT"}
              rules={[{ required: true }]}
            >
              <CustomSelect
                placeholder={"Seleccionar Rol"}
                options={departments?.map((item) => ({
                  label: item.NAME,
                  value: item.DEPARTMENT_ID,
                }))}
              />
            </CustomFormItem>
          </CustomCol>
          <CustomCol {...defaultBreakpoints}>
            <CustomFormItem label={"Supervisor"} name={"SUPERVISOR"}>
              <CustomSelect
                onSearch={setSearchKey}
                showSearch
                placeholder={"Seleccionar supervisor"}
                options={supervisors?.map((item) => ({
                  label: item.NAME,
                  value: item.USERNAME,
                }))}
              />
            </CustomFormItem>
          </CustomCol>
          <CustomDivider>
            <CustomText>Beneficios e impuestos</CustomText>
          </CustomDivider>
          <CustomCol xs={24}>
            <CustomFormItem
              name={"DEDUCTIONS"}
              label={" "}
              colon={false}
              {...labelColFullWidth}
            >
              <CustomCheckboxGroup
                onChange={(values) =>
                  form.setFieldsValue({
                    DEDUCTIONS: Array.from(new Set(values)),
                  })
                }
                options={deductions?.map((item) => ({
                  label: (
                    <CustomTooltip title={item.LABEL}>
                      {truncateText(item.LABEL, 60)}
                    </CustomTooltip>
                  ),
                  value: item.DEDUCTION_ID,
                  style: { width: "100%" },
                }))}
              />
            </CustomFormItem>
          </CustomCol>
          <CustomCol xs={24}>
            <CustomFormItem label={" "} colon={false} {...labelColFullWidth}>
              <CustomAlert
                icon={<BulbOutlined />}
                type={"info"}
                message={
                  <CustomParagraph>
                    Antes de seleccionar el impuesto sobre la renta (ISR), le
                    recomendamos visitar la página de la DGI. Allí encontrará
                    todas las herramientas necesarias para determinar en qué
                    rango de retención se encuentra su empleado, según su
                    salario. Para obtener más información, visite el siguiente
                    enlace: <br />
                    <Link
                      passHref
                      legacyBehavior
                      href={
                        "https://www.toptrabajos.com/blog/do/descuentos-de-nomina-sfs-afp-isr/#:~:text=Siguiendo%20el%20ejemplo%20si%20tu%20salario%20es%20de,que%20se%20te%20har%C3%A1%20en%20concepto%20de%20AFP."
                      }
                    >
                      <a target={"_blank"}>
                        Descuentos de nómina en República Dominicana: SFS, AFP e
                        ISR
                      </a>
                    </Link>
                  </CustomParagraph>
                }
              />
            </CustomFormItem>
          </CustomCol>
          <CustomDivider>
            <CustomText>Documentos</CustomText>
          </CustomDivider>
          <CustomCol xs={24}>
            <ConditionalComponent
              condition={!user?.RESUME}
              fallback={
                <CustomFormItem
                  label={" "}
                  colon={false}
                  {...labelColFullWidth}
                >
                  <FilePreview>
                    <CustomRow justify={"space-between"}>
                      <CustomSpace
                        width={"80%"}
                        direction={"horizontal"}
                        size={10}
                        align={"center"}
                      >
                        {documentIcons[fileExtension]}
                        <CustomLink
                          onClick={() => downloadDocument(user?.RESUME ?? "")}
                        >
                          Descargar Documento
                        </CustomLink>
                      </CustomSpace>
                      <CustomTooltip title={"Eliminar"}>
                        <CustomButton
                          onClick={handleUpdateResume}
                          danger
                          type={"link"}
                          icon={<DeleteOutlined />}
                        />
                      </CustomTooltip>
                    </CustomRow>
                  </FilePreview>
                </CustomFormItem>
              }
            >
              <CustomFormItem
                label={" "}
                colon={false}
                name={"RESUME"}
                getValueFromEvent={normalizeFiles}
                valuePropName={"fileList"}
                {...labelColFullWidth}
              >
                <CustomDragger
                  accept={"application/pdf"}
                  listType={"picture"}
                />
              </CustomFormItem>
            </ConditionalComponent>
          </CustomCol>
        </CustomRow>
      </CustomForm>
    </CustomSpin>
  )
}

export default EmploymentData

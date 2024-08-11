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
} from "@/components/custom"
import { CustomLink } from "@/components/custom/CustomParagraph"
import CustomUpload from "@/components/custom/CustomUpload"
import { base64ToBlob, downloadDocument } from "@/helpers/base64-helpers"
import createUploadObject from "@/helpers/build-file-list"
import { normalizeFiles } from "@/helpers/form-item-normalizers"
import useDebounce from "@/hooks/useDebounce"
import useGetRolesList from "@/services/hooks/user/useGetRolesList"
import { useGetUserLIst } from "@/services/hooks/user/useGetUserList"
import useUpdateUser from "@/services/hooks/user/useUpdateUser"
import useUserStore from "@/stores/userStore"
import {
  formItemLayout,
  defaultBreakpoints,
  labelColFullWidth,
} from "@/styles/breakpoints"
import {
  DeleteOutlined,
  FilePdfOutlined,
  FileWordOutlined,
} from "@ant-design/icons"
import { FormInstance } from "antd"
import dayjs from "dayjs"
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

  const handleSearchSupervisor = useCallback(() => {
    getSupervisor({
      page: 1,
      size: 20,
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
      ],
    })
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
            <CustomFormItem label={"Salario"} name={"SALARY"}>
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
            <CustomFormItem label={"Rol"} name={"ROLES"}>
              <CustomSelect
                placeholder={"Seleccionar Cargo"}
                options={data?.map((item) => ({
                  label: item.NAME,
                  value: item.ROL_ID,
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
          <CustomCol xs={24}>
            <ConditionalComponent
              condition={!user?.RESUME}
              fallback={
                <CustomFormItem label={"Currículum"} {...labelColFullWidth}>
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
                label={"Currículum"}
                name={"RESUME"}
                getValueFromEvent={normalizeFiles}
                valuePropName={"fileList"}
                {...labelColFullWidth}
              >
                <CustomDragger listType={"picture"} />
              </CustomFormItem>
            </ConditionalComponent>
          </CustomCol>
        </CustomRow>
      </CustomForm>
    </CustomSpin>
  )
}

export default EmploymentData

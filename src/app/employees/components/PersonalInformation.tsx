import ConditionalComponent from "@/components/ConditionalComponent"
import {
  CustomForm,
  CustomRow,
  CustomCol,
  CustomFormItem,
  CustomInput,
  CustomSelect,
  CustomRadioGroup,
  CustomMaskedInput,
  CustomTextArea,
  CustomUpload,
  CustomDatePicker,
} from "@/components/custom"
import CustomInputGroup from "@/components/custom/CustomInputGroup"
import errorHandler from "@/helpers/errorHandler"
import {
  normalizeFiles,
  normalizeMaskedInput,
} from "@/helpers/form-item-normalizers"
import { ValidateStatus } from "@/interfaces/general"
import { User } from "@/interfaces/user"
import useCheckIdentityDocument from "@/services/hooks/user/useCheckIdentityDocument"
import useCheckUsername from "@/services/hooks/user/useCheckUsername"
import useUserStore from "@/stores/userStore"
import {
  defaultBreakpoints,
  formItemLayout,
  labelColFullWidth,
} from "@/styles/breakpoints"
import { Form, FormInstance } from "antd"
import { isAxiosError } from "axios"
import dayjs from "dayjs"
import React, { useEffect, useState } from "react"

const maskType = {
  C: "cedula",
  P: "pasaporte",
}
interface PersonalInformationProps {
  form: FormInstance
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({ form }) => {
  const typeDocument = Form.useWatch("DOCUMENT_TYPE", form)

  const [validateStatus, setValidateStatus] = useState<ValidateStatus>("")
  const [validateDocStatus, setValidateDocStatus] = useState<ValidateStatus>("")

  const { mutateAsync: checkUsername } = useCheckUsername()
  const { mutateAsync: checkIdentityDocument } = useCheckIdentityDocument()

  const { user, setDocumentAvailable, setUsernameAvailable } = useUserStore()

  const isEditing = !!user.USER_ID

  useEffect(() => {
    if (user.USER_ID) {
      setDocumentAvailable(true)
      setUsernameAvailable(true)
    }
  }, [user])

  const handleCheckUsername = async (
    event: React.FocusEvent<HTMLInputElement, Element>
  ) => {
    try {
      const { value } = event.target
      if (!value) return

      setValidateStatus("validating")
      await checkUsername({ USERNAME: value })
      setValidateStatus("success")
    } catch (error) {
      if (isAxiosError(error)) {
        form.setFields([
          {
            name: "USERNAME",
            errors: [error?.response?.data.message],
          },
        ])
      }
      setValidateStatus("error")
      errorHandler(error)
    }
  }

  const handleCheckIdentityDocument = async (
    event: React.FocusEvent<HTMLInputElement, Element>
  ) => {
    try {
      const value = event.target.value.replace(/\D/g, "")
      if (!value) return
      setValidateDocStatus("validating")
      await checkIdentityDocument({
        IDENTITY_DOCUMENT: value,
      })
      setValidateDocStatus("success")
    } catch (error) {
      if (isAxiosError(error)) {
        form.setFields([
          {
            name: "IDENTITY_DOCUMENT",
            validated: true,
            errors: [error?.response?.data.message],
          },
        ])
      }
      setValidateDocStatus("error")
      errorHandler(error)
    }
  }

  return (
    <CustomForm form={form} {...formItemLayout} style={{ width: "100%" }}>
      <CustomRow justify={"start"}>
        <CustomCol {...defaultBreakpoints} />
        <ConditionalComponent condition={!!user.USER_ID}>
          <CustomCol {...defaultBreakpoints}>
            <CustomFormItem label={"Código"} name={"USER_ID"}>
              <CustomInput disabled placeholder={"Código de empleado"} />
            </CustomFormItem>
          </CustomCol>
        </ConditionalComponent>
        <CustomCol xs={24}>
          <CustomFormItem
            {...labelColFullWidth}
            label={"Doc. Identidad"}
            rules={[{ required: true }]}
            required
          >
            <CustomInputGroup>
              <CustomFormItem
                noStyle
                name={"DOCUMENT_TYPE"}
                label={"Tipo de documento"}
                initialValue={"C"}
                rules={[{ required: true }]}
              >
                <CustomSelect
                  disabled={isEditing}
                  width={"20%"}
                  placeholder={"Tipo de documento"}
                  options={[
                    { label: "Cédula", value: "C" },
                    { label: "Pasaporte", value: "P" },
                  ]}
                />
              </CustomFormItem>
              <CustomFormItem
                noStyle
                name={"IDENTITY_DOCUMENT"}
                label={"Número de documento"}
                noSymbol={typeDocument === "P"}
                validateStatus={validateDocStatus}
                hasFeedback
                rules={[{ required: true, len: 11 }]}
                getValueFromEvent={
                  typeDocument === "C" ? normalizeMaskedInput : undefined
                }
              >
                <CustomMaskedInput
                  disabled={isEditing}
                  onBlur={handleCheckIdentityDocument}
                  type={maskType[typeDocument as never] || "cedula"}
                  width={"80%"}
                  placeholder={"Documento de identidad"}
                />
              </CustomFormItem>
            </CustomInputGroup>
          </CustomFormItem>
        </CustomCol>
        <CustomCol {...defaultBreakpoints}>
          <CustomFormItem
            label={"Nombres"}
            name={"NAME"}
            rules={[{ required: true }]}
          >
            <CustomInput placeholder={"Nombres"} />
          </CustomFormItem>
        </CustomCol>
        <CustomCol {...defaultBreakpoints}>
          <CustomFormItem
            label={"Apellidos"}
            name={"LAST_NAME"}
            rules={[{ required: true }]}
          >
            <CustomInput placeholder={"Apellidos"} />
          </CustomFormItem>
        </CustomCol>
        <CustomCol {...defaultBreakpoints}>
          <CustomFormItem
            label={"Correo"}
            name={"EMAIL"}
            rules={[{ required: true, type: "email" }]}
          >
            <CustomInput placeholder={"Correo electrónico"} />
          </CustomFormItem>
        </CustomCol>
        <CustomCol {...defaultBreakpoints}>
          <CustomFormItem
            onlyNumber
            label={"Teléfono"}
            name={"PHONE"}
            getValueFromEvent={normalizeMaskedInput}
            rules={[{ required: true, len: 10 }]}
          >
            <CustomMaskedInput
              type={"telefono"}
              placeholder={"Número de teléfono"}
            />
          </CustomFormItem>
        </CustomCol>
        <CustomCol {...defaultBreakpoints}>
          <CustomFormItem
            onlyString
            label={"Usuario"}
            name={"USERNAME"}
            validateStatus={validateStatus}
            hasFeedback
            rules={[{ required: true }]}
          >
            <CustomInput
              disabled={isEditing}
              prefix={"@"}
              placeholder={"Nombre de usuario"}
              onBlur={handleCheckUsername}
            />
          </CustomFormItem>
        </CustomCol>
        <CustomCol {...defaultBreakpoints}>
          <CustomFormItem
            onlyString
            label={"Género"}
            name={"GENDER"}
            rules={[{ required: true }]}
          >
            <CustomRadioGroup
              options={[
                { label: "Masculino", value: "M" },
                { label: "Femenino", value: "F" },
              ]}
            />
          </CustomFormItem>
        </CustomCol>
        <CustomCol {...defaultBreakpoints}>
          <CustomFormItem
            label={"Fecha Nacimiento"}
            name={"BIRTH_DATE"}
            rules={[{ required: true }]}
          >
            <CustomDatePicker maxDate={dayjs().subtract(15, "year")} />
          </CustomFormItem>
        </CustomCol>
        <CustomCol xs={24}>
          <CustomFormItem
            label={"Dirección"}
            name={"ADDRESS"}
            {...labelColFullWidth}
          >
            <CustomTextArea placeholder={"Dirección"} />
          </CustomFormItem>
        </CustomCol>
        <CustomCol {...defaultBreakpoints}>
          <CustomFormItem
            label={"Foto de Perfil"}
            name={"AVATAR"}
            getValueFromEvent={normalizeFiles}
            valuePropName={"fileList"}
          >
            <CustomUpload accept={"image/*"} />
          </CustomFormItem>
        </CustomCol>
      </CustomRow>
    </CustomForm>
  )
}

export default PersonalInformation

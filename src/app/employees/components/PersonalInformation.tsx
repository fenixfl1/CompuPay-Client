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
import {
  normalizeFiles,
  normalizeMaskedInput,
} from "@/helpers/form-item-normalizers"
import replaceAccentedVowels from "@/helpers/replaceAccentedVowels"
import useUserStore from "@/stores/userStore"
import {
  defaultBreakpoints,
  formItemLayout,
  labelColFullWidth,
} from "@/styles/breakpoints"
import { Form, FormInstance } from "antd"
import dayjs from "dayjs"
import React, { useEffect, useMemo } from "react"

const maskType = {
  C: "cedula",
  P: "pasaporte",
}
interface PersonalInformationProps {
  form: FormInstance
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({ form }) => {
  const name = Form.useWatch("NAME", form)
  const lastName = Form.useWatch("LAST_NAME", form)
  const typeDocument = Form.useWatch("DOCUMENT_TYPE", form)

  const { user } = useUserStore()

  const generateUsername = useMemo(() => {
    if (!name || !lastName) return ""
    // Prefijos comunes que deben ser ignorados en los apellidos
    const prefixes = ["de", "del", "la", "las", "los", "y"]

    // Obtener la inicial del nombre
    const initial = replaceAccentedVowels(name.charAt(0)).toLowerCase()

    // Dividir el apellido en partes
    const lastNameParts = replaceAccentedVowels(lastName)
      .toLowerCase()
      .split(" ")

    // Encontrar la primera parte significativa del apellido
    let significantPart = ""
    for (const part of lastNameParts) {
      if (!prefixes.includes(part)) {
        significantPart = part
        break
      }
    }
    return `${initial}${significantPart}`
  }, [name, lastName])

  useEffect(() => {
    form.setFieldsValue({ USERNAME: generateUsername })
  }, [generateUsername])

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
          >
            <CustomInputGroup>
              <CustomFormItem
                noStyle
                name={"DOCUMENT_TYPE"}
                label={"Tipo de documento"}
                initialValue={"C"}
              >
                <CustomSelect
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
                rules={[{ required: true, len: 11 }]}
                getValueFromEvent={
                  typeDocument === "C" ? normalizeMaskedInput : undefined
                }
              >
                <CustomMaskedInput
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
            rules={[{ required: true }]}
          >
            <CustomInput prefix={"@"} placeholder={"Nombre de usuario"} />
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
        {/* <ConditionalComponent condition={!user.USER_ID}> */}
        <CustomCol {...defaultBreakpoints}>
          <CustomFormItem
            label={"Foto de Perfil"}
            name={"AVATAR"}
            getValueFromEvent={normalizeFiles}
            valuePropName={"fileList"}
          >
            <CustomUpload
              fileList={
                [
                  {
                    url: "https://static.vecteezy.com/system/resources/previews/006/487/917/original/man-avatar-icon-free-vector.jpg",
                  },
                ] as never
              }
              accept={"image/*"}
            />
          </CustomFormItem>
        </CustomCol>
        {/* </ConditionalComponent> */}
      </CustomRow>
    </CustomForm>
  )
}

export default PersonalInformation

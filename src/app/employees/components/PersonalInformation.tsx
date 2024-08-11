import ConditionalComponent from "@/components/ConditionalComponent"
import {
  CustomForm,
  CustomRow,
  CustomCol,
  CustomFormItem,
  CustomInput,
  CustomSelect,
  CustomPasswordInput,
  CustomRadioGroup,
  CustomMaskedInput,
  CustomTextArea,
} from "@/components/custom"
import CustomInputGroup from "@/components/custom/CustomInputGroup"
import { document_mask, passport_mask, phone_mask } from "@/constants/masks"
import replaceAccentedVowels from "@/helpers/replaceAccentedVowels"
import useUserStore from "@/stores/userStore"
import {
  defaultBreakpoints,
  formItemLayout,
  labelColFullWidth,
} from "@/styles/breakpoints"
import { Form, FormInstance } from "antd"
import React, { useEffect, useMemo } from "react"

interface PersonalInformationProps {
  form: FormInstance
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({ form }) => {
  const name = Form.useWatch("NAME", form)
  const lastName = Form.useWatch("LAST_NAME", form)

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
              >
                <CustomMaskedInput
                  mask={(input) => {
                    if (isNaN(Number(input))) return passport_mask

                    return document_mask
                  }}
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
            rules={[{ required: true, max: 14 }]}
          >
            <CustomMaskedInput
              mask={phone_mask}
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
          <ConditionalComponent condition={!user.USER_ID}>
            <CustomFormItem
              label={"Contraseña"}
              name={"PASSWORD"}
              rules={[{ required: true }]}
            >
              <CustomPasswordInput placeholder={"Contraseña"} />
            </CustomFormItem>
          </ConditionalComponent>
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
        <CustomCol xs={24}>
          <CustomFormItem
            label={"Dirección"}
            name={"ADDRESS"}
            {...labelColFullWidth}
          >
            <CustomTextArea placeholder={"Dirección"} />
          </CustomFormItem>
        </CustomCol>
      </CustomRow>
    </CustomForm>
  )
}

export default PersonalInformation

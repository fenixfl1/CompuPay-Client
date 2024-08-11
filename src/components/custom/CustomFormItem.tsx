import React from "react"
import { Form } from "antd"
import { FormItemProps, Rule } from "antd/lib/form"
import { CustomFormItemProps, FormItemProvider } from "@/context/form-item"

const { Item } = Form

const patternOnlyLetter = "^[a-z A-Z ZÀ-ÿ]+$"
const patternOnlyNumbers = "^[0-9 -,]+$"
const patternAlfaNumeric = "^[a-z A-Z ZÀ-ÿ 0-9]+$"

const CustomFormItem: React.FC<CustomFormItemProps> = ({
  required,
  onlyNumber,
  onlyString,
  noSymbol,
  ...props
}) => {
  const checkRequiredRule = props.rules
    ? !!props.rules.find((value: Rule) => value["required" as keyof Rule])
    : required

  if (onlyString) {
    props.normalize = (value: string) => {
      if (RegExp(patternOnlyLetter).test(value)) {
        return value
      } else {
        return value.substring(0, value.length - 1)
      }
    }
  } else if (onlyNumber) {
    props.normalize = (value: string) =>
      value?.match(new RegExp(patternOnlyNumbers))
        ? value
        : value?.substring(0, value?.length - 1)
  } else if (noSymbol) {
    props.normalize = (value: string) =>
      value?.match(new RegExp(patternAlfaNumeric))
        ? value
        : value?.substring(0, value?.length - 1)
  } else {
    props.normalize = (value: string) => value
  }

  return (
    <FormItemProvider {...props}>
      <Item required={checkRequiredRule} {...props}>
        {props.children}
      </Item>
    </FormItemProvider>
  )
}

export default CustomFormItem

import React from "react"
import { Checkbox, CheckboxProps } from "antd"

const CustomCheckbox: React.FC<CheckboxProps> = ({ ...props }) => {
  return <Checkbox {...props}>{props.children}</Checkbox>
}

export default CustomCheckbox

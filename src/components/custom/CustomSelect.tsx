import React from "react"
import { Select, SelectProps } from "antd"
import { defaultTheme } from "@/styles/themes"

interface CustomSelectProps extends SelectProps {
  width?: string | number
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  optionLabelProp = "label",
  size = defaultTheme.size,
  showSearch = true,
  width,
  ...props
}) => {
  return (
    <Select
      showSearch={showSearch}
      size={size}
      optionLabelProp={optionLabelProp}
      filterOption={(input, option) => {
        return option?.label
          ?.toString()
          ?.toLowerCase()
          ?.includes(input) as boolean
      }}
      style={{ ...props.style, width }}
      {...props}
    >
      {props.children}
    </Select>
  )
}

export default CustomSelect

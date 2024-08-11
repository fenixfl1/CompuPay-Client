import React from "react"
import { Input, InputProps, InputRef } from "antd"
import { defaultTheme } from "@/styles/themes"

export type CustomInputProps = InputProps & {
  autoComplete?: string
  tooltip?: string
  alwaysAvailable?: boolean
  notNumber?: boolean
  width?: string | number
}

const CustomInput = React.forwardRef<InputRef, CustomInputProps>(
  (
    {
      autoComplete = "off",
      tooltip,
      width,
      size = defaultTheme.size,
      ...props
    },
    ref
  ) => {
    return (
      <Input
        autoComplete={autoComplete}
        ref={ref}
        size={size}
        style={{ ...props.style, width }}
        {...props}
      />
    )
  }
)

export default CustomInput

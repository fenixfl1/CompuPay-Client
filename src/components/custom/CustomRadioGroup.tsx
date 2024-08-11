import React from "react"
import { Radio, RadioGroupProps } from "antd"
import { defaultTheme } from "@/styles/themes"

const { Group } = Radio

const CustomRadioGroup = React.forwardRef<HTMLInputElement, RadioGroupProps>(
  ({ size = defaultTheme.size, ...props }, ref) => {
    return <Group size={size} {...props} ref={ref} />
  }
)

export default CustomRadioGroup

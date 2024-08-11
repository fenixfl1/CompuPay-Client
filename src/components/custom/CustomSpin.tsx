import React from "react"
import { Spin, SpinProps } from "antd"
import { defaultTheme } from "@/styles/themes"

const CustomSpin: React.FC<SpinProps> = ({
  size = defaultTheme.size as any,
  spinning = false,
  ...props
}) => {
  return (
    <Spin spinning={spinning} size={size} {...props}>
      {props.children}{" "}
    </Spin>
  )
}

export default CustomSpin

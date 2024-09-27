import React from "react"
import { Tabs, TabsProps } from "antd"
import { defaultTheme } from "@/styles/themes"

const CustomTabs: React.FC<TabsProps> = ({
  size = defaultTheme.size,
  type = "line",
  ...props
}) => {
  return <Tabs size={size} type={type} {...props} />
}

export default CustomTabs

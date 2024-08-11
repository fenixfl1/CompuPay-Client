import React from "react"
import { Drawer, DrawerProps } from "antd"

const CustomDrawer: React.FC<DrawerProps> = ({
  placement = "right",
  ...props
}) => {
  return (
    <Drawer placement={placement} {...props}>
      {props.children}
    </Drawer>
  )
}

export default CustomDrawer

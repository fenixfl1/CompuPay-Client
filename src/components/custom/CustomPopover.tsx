import React from "react"
import { Popover, PopoverProps } from "antd"
import { TooltipRef } from "antd/lib/tooltip"

const CustomPopover = React.forwardRef<TooltipRef, PopoverProps>(
  ({ trigger = "click", ...props }, ref) => {
    return (
      <Popover {...props} ref={ref} trigger={trigger}>
        {props.children}
      </Popover>
    )
  }
)

export default CustomPopover

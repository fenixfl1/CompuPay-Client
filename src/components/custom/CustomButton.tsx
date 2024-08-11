import React from "react"
import { Button, ButtonProps } from "antd"
import { defaultTheme } from "@/styles/themes"

const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ size = defaultTheme.size, ...props }, ref) => {
    return (
      <Button size={size} {...props} ref={ref}>
        {props.children}
      </Button>
    )
  }
)

export default CustomButton

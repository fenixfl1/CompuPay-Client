import React from "react"
import styled from "styled-components"
import { DownOutlined } from "@ant-design/icons"
import { Collapse, CollapseProps } from "antd"

const StyledCollapse = styled(Collapse)`
  background: #ffffff !important;

  .ant-collapse-item {
    border: none !important;
    border-radius: ${({ theme }) => theme.borderRadius} !important;
    background-color: ${({ theme }) => theme.textColor} !important;
  }

  .ant-collapse-item:not(:last-child) {
    margin-bottom: 10px !important;
  }
`

const CustomCollapse = React.forwardRef<HTMLDivElement, CollapseProps>(
  ({ bordered = false, expandIconPosition = "end", ...props }, ref) => {
    return (
      <StyledCollapse
        ref={ref}
        bordered={bordered}
        expandIconPosition={expandIconPosition}
        expandIcon={({ isActive }) => (
          <DownOutlined style={{ fontSize: 16 }} rotate={isActive ? 180 : 0} />
        )}
        {...props}
      />
    )
  }
)
export default CustomCollapse

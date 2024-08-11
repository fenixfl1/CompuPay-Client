import React from "react"
import { CustomRow, CustomSpace, CustomText } from "./custom"
import { InboxOutlined } from "@ant-design/icons"

interface NoDataProps {
  description?: string
}

const NoData: React.FC<NoDataProps> = ({ description = "No hay datos" }) => {
  return (
    <CustomRow>
      <CustomSpace align={"center"} width={"max-content"} size={5}>
        <InboxOutlined style={{ fontSize: "50px" }} />
        <CustomText>{description}</CustomText>
      </CustomSpace>
    </CustomRow>
  )
}

export default NoData

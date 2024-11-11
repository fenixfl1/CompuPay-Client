"use client"

import { CustomButton, CustomResult } from "@/components/custom"
import React from "react"

const NotFound: React.FC = (): React.ReactElement => {
  return (
    <CustomResult
      status="404"
      title="404"
      subTitle="Lo sentimos, la página que intenta visitar no existe."
      extra={
        <CustomButton type="link" href={"/"}>
          Ir a inicio
        </CustomButton>
      }
    />
  )
}

export default NotFound

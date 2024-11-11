"use client"

import { CustomContent, CustomSpin } from "@/components/custom"
import React from "react"
import styled from "styled-components"

const Content = styled(CustomContent)`
  height: 100dvh;
  width: 100dvw;
`

const loading: React.FC = () => {
  return (
    <CustomSpin size={"large"} spinning tip={"Cargando..."}>
      <Content />
    </CustomSpin>
  )
}

export default loading

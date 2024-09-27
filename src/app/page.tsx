"use client"

import React from "react"
import { NextPage } from "next"
import { CustomRow } from "@/components/custom"
import styled from "styled-components"

const Container = styled(CustomRow)`
  height: calc(100vh - 150px);
`

const Home: NextPage = () => {
  return (
    <Container align={"middle"}>
      <img width={"65%"} src="/assets/logo_2.svg" alt="Logo" />
    </Container>
  )
}

export default Home

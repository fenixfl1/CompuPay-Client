"use client"

import React from "react"
import { NextPage } from "next"
import { CustomRow } from "@/components/custom"

const Home: NextPage = () => {
  return (
    <CustomRow>
      <img width={"65%"} src="/assets/logo_2.svg" alt="Logo" />
    </CustomRow>
  )
}

export default Home

"use client"

import { CustomCol, CustomParagraph, CustomRow } from "@/components/custom"
import useMenuOptionStore from "@/stores/useMenuOptionStore"
import { defaultTheme } from "@/styles/themes"
import { NextPage } from "next"
import React from "react"

const page: NextPage = () => {
  const { selectedMenuOption } = useMenuOptionStore()
  return (
    <CustomCol xs={24}>
      <CustomRow justify={"center"}>
        <CustomCol xs={16}>
          <CustomParagraph>
            <div
              dangerouslySetInnerHTML={{
                __html: selectedMenuOption?.content ?? "",
              }}
            />
          </CustomParagraph>
        </CustomCol>
      </CustomRow>
    </CustomCol>
  )
}

export default page

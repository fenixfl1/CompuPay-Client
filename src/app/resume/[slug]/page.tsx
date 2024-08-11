"use client"

import ConditionalComponent from "@/components/ConditionalComponent"
import Fallback from "@/components/Fallback"
import PdfViewer from "@/components/PdfViewer"
import { base64ToBlob } from "@/helpers/base64-helpers"
import useGetUser from "@/services/hooks/user/useGetUser"
import useUserStore from "@/stores/userStore"
import { NextPage } from "next"
import React, { useEffect } from "react"

interface PageProps {
  params: {
    slug: string
  }
}

const page: NextPage<PageProps> = ({ params }) => {
  const username = params.slug
  const { user } = useUserStore()
  const { mutateAsync: getUser } = useGetUser()

  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.log({ user })
  }, [user])

  useEffect(() => {
    if (!username) return
    getUser({
      condition: {
        USERNAME: username,
      },
    })
  }, [username])

  const downloadPDF = (base64: string) => {
    const blob = base64ToBlob(base64)
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "file.pdf"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <ConditionalComponent condition={!!user?.USER_ID} fallback={<Fallback />}>
      <PdfViewer stringFile={user?.RESUME ?? ""} />
    </ConditionalComponent>
  )
}

export default page

"use client"

import { Form } from "antd"
import LoginForm from "./_components/LoginForm"
import { NextPage } from "next"
import { useAuthenticateUser } from "@/services/hooks"
import { CustomSpin } from "@/components/custom"
import { useRouter } from "next/navigation"
import { PATH_HOME } from "@/constants/routes"
import { createSession, isLoggedIn } from "@/lib/session"
import { useEffect } from "react"

const page: NextPage = () => {
  const router = useRouter()
  const [form] = Form.useForm()
  const {
    mutateAsync: authenticateUser,
    isPending,
    isError,
  } = useAuthenticateUser()

  const handleOnFinish = async () => {
    try {
      const data = await form.validateFields()
      const response = await authenticateUser(data)
      createSession(response)
      window.location.reload()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error({ error })
    }
  }

  return (
    <CustomSpin spinning={isPending}>
      <LoginForm form={form} onFinish={handleOnFinish} isFailed={isError} />
    </CustomSpin>
  )
}

export default page

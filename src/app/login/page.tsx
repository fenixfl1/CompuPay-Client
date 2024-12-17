"use client"

import { Form } from "antd"
import LoginForm from "./components/LoginForm"
import { NextPage } from "next"
import { useAuthenticateUser } from "@/services/hooks"
import { CustomSpin } from "@/components/custom"
import { useRouter } from "next/navigation"
import { createSession } from "@/lib/session"
import { assert } from "@/helpers/assert"
import { AxiosError } from "axios"
import { useState } from "react"

const page: NextPage = () => {
  const router = useRouter()
  const [form] = Form.useForm()

  const [message, setMessage] = useState<string>()

  const { mutateAsync: authenticateUser, isPending } = useAuthenticateUser()

  const handleOnFinish = async () => {
    try {
      const data = await form.validateFields()
      const response = await authenticateUser(data)
      createSession(response)
      window.location.reload()
    } catch (error: any) {
      assert<AxiosError>(error)
      setMessage(error?.response?.data?.["error" as never])
    }
  }

  return (
    <CustomSpin spinning={isPending}>
      <LoginForm
        form={form}
        onFinish={handleOnFinish}
        message={message}
        onClose={() => setMessage(undefined)}
      />
    </CustomSpin>
  )
}

export default page

import {
  CustomButton,
  CustomModal,
  CustomRow,
  CustomSpace,
  CustomSpin,
  CustomSteps,
} from "@/components/custom"
import { User } from "@/interfaces/user"
import useModalStore from "@/stores/modalStore"
import { Form, StepsProps } from "antd"
import React, { useEffect, useState } from "react"
import PersonalInformation from "./PersonalInformation"
import ConditionalComponent from "@/components/ConditionalComponent"
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  SaveOutlined,
} from "@ant-design/icons"
import EmploymentData from "./EmploymentData"
import errorHandler from "@/helpers/errorHandler"
import useCreateUser from "@/services/hooks/user/useCreateUse"
import { customNotification } from "@/components/custom/customNotification"
import { getBase64 } from "@/helpers/base64-helpers"
import { assert } from "@/helpers/assert"
import dayjs from "dayjs"
import useRolesStore from "@/stores/rolesStore"
import createUploadObject from "@/helpers/build-file-list"
import useUserStore from "@/stores/userStore"
import useUpdateUser from "@/services/hooks/user/useUpdateUser"
import queryClient from "@/lib/appClient"
import useMenuOptionStore from "@/stores/useMenuOptionStore"
import { CustomModalConfirmation } from "@/components/custom/CustomModalMethods"
import useSetFiles from "@/hooks/useSetFiles"

const items: StepsProps["items"] = [
  {
    title: "Datos Personales",
    description: "Información personal del empleado",
  },
  {
    title: "Datos de Empleo",
    description: "Información laboral del empleado",
  },
]

interface Parameters {
  DEFAULT_PASSWORD: string
}

interface EmployeeFormProps {
  loading?: boolean
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ loading }) => {
  const [form] = Form.useForm<Partial<User>>()
  const avatar = Form.useWatch("AVATAR", form)
  const [currentStep, setCurrentStep] = useState(0)
  const [employee, setEmployee] = useState<Partial<User>>({})

  const { visible, setVisible } = useModalStore()
  const { user, setUser } = useUserStore()
  const { roles } = useRolesStore()
  const { parameters } = useMenuOptionStore<Parameters>()

  const { DEFAULT_PASSWORD } = parameters

  const { mutateAsync: createUser, isPending: isPendingCreateUser } =
    useCreateUser()
  const { mutateAsync: updateUser, isPending: isPendingUpdateUser } =
    useUpdateUser()
  useEffect(() => {
    if (!user?.USER_ID) return

    form.setFieldsValue({
      ...user,
      BIRTH_DATE: dayjs(user.BIRTH_DATE) as never,
      ROLES: user.ROLES?.[0]?.ROL_ID as never,
      HIRED_DATE: user?.HIRED_DATE
        ? (dayjs(user?.HIRED_DATE) as any)
        : undefined,
      RESUME: user?.RESUME
        ? (createUploadObject(user?.RESUME ?? "", user) as any)
        : undefined,
      SALARY: user?.GROSS_SALARY,
      GENDER: user.GENDER,
      AVATAR: { url: user?.AVATAR } as never,
    })
  }, [user])

  useEffect(() => {
    form.setFieldsValue({
      AVATAR: !user?.AVATAR?.includes("http")
        ? { ...(createUploadObject(user?.AVATAR ?? "", user) as any) }
        : undefined,
    } as never)
  }, [user])

  useEffect(() => {
    return () => {
      form.resetFields()
      setCurrentStep(0)
      setEmployee({} as User)
      queryClient.invalidateQueries()
      queryClient.resetQueries({ queryKey: ["users"] })
    }
  }, [])

  const steps = [
    {
      key: "personal_information",
      node: <PersonalInformation form={form} />,
    },
    {
      key: "employment_information",
      node: <EmploymentData form={form} />,
    },
  ]

  const handleOnFinish = async () => {
    try {
      const dataForm = await form.validateFields()
      const data = { ...employee, ...dataForm }

      assert<dayjs.Dayjs>(data.HIRED_DATE)
      assert<dayjs.Dayjs>(data.BIRTH_DATE)
      assert<File[]>(data.RESUME)
      assert<File[]>(data.AVATAR)

      data.AVATAR = await getBase64(data.AVATAR?.[0])
      data.RESUME = await getBase64(data.RESUME?.[0])

      data.PASSWORD = DEFAULT_PASSWORD
      data.ROLES = [data.ROLES] as never
      data.HIRED_DATE = data.HIRED_DATE.format("YYYY-MM-DD")
      data.BIRTH_DATE = data.BIRTH_DATE.format("YYYY-MM-DD")
      data.STATE = roles.find(
        (rol) => rol.ROL_ID === (data.ROLES as unknown as number)
      )?.INIT_USER_STATE as string

      if (user?.USER_ID) {
        delete data.IDENTITY_DOCUMENT
        delete data.USERNAME

        await updateUser({
          ...data,
          USER_ID: user.USER_ID,
        })
        setVisible(false)
        return customNotification({
          type: "success",
          message: "Empleado actualizado con éxito.",
        })
      }

      await createUser(data as User)
      customNotification({
        type: "success",
        message: "Registro completado con éxito.",
      })
      setVisible(false)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleOnClickNext = async () => {
    try {
      const data = await form.validateFields()
      setEmployee((prev) => ({ ...prev, ...data }))
      setCurrentStep(currentStep + 1)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleOnPrevious = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleOnCancel = () => {
    CustomModalConfirmation({
      title: "Cancelar registro",
      onOk: () => setVisible(false),
      content:
        "¿Seguro que desea cancelar eḷ registro, cualquier cambio que halla hecho se perderá?",
    })
  }

  return (
    <CustomModal
      destroyOnClose
      width={"60%"}
      onCancel={handleOnCancel}
      open={visible}
      footer={null}
      title={"Nuevo Empleado"}
    >
      <CustomSpin
        spinning={isPendingCreateUser || isPendingUpdateUser || loading}
      >
        <CustomSpace size={"large"}>
          <CustomSteps current={currentStep} items={items} />

          <div style={{ minHeight: "350px" }}>{steps[currentStep].node}</div>

          <CustomRow justify={"end"}>
            <CustomSpace direction={"horizontal"} width={"max-content"}>
              <ConditionalComponent condition={currentStep > 0}>
                <CustomButton
                  onClick={handleOnPrevious}
                  icon={<ArrowLeftOutlined />}
                >
                  Anterior
                </CustomButton>
              </ConditionalComponent>
              <ConditionalComponent
                condition={currentStep < steps.length - 1}
                fallback={
                  <CustomButton
                    onClick={handleOnFinish}
                    icon={<SaveOutlined />}
                    type={"primary"}
                  >
                    {user?.USER_ID ? "Actualizar" : "Guardar"}
                  </CustomButton>
                }
              >
                <CustomButton
                  type={"primary"}
                  onClick={handleOnClickNext}
                  icon={<ArrowRightOutlined />}
                >
                  Siguiente
                </CustomButton>
              </ConditionalComponent>
            </CustomSpace>
          </CustomRow>
        </CustomSpace>
      </CustomSpin>
    </CustomModal>
  )
}

export default EmployeeForm

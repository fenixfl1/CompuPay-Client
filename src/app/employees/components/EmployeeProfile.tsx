import ConditionalComponent from "@/components/ConditionalComponent"
import {
  CustomAlert,
  CustomAvatar,
  CustomButton,
  CustomCard,
  CustomCol,
  CustomCollapse,
  CustomDescriptions,
  CustomDivider,
  CustomDrawer,
  CustomFormItem,
  CustomInput,
  CustomModal,
  CustomRow,
  CustomSpace,
  CustomSpin,
  CustomTag,
  CustomText,
  CustomTooltip,
  CustomUpload,
} from "@/components/custom"
import { states } from "@/constants/general"
import { logDate } from "@/helpers/date-helpers"
import formatter from "@/helpers/formatter"
import useUserStore from "@/stores/userStore"
import { BulbOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons"
import { CollapseProps, DescriptionsProps, Form, UploadFile } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import styled from "styled-components"
import { documentIcons } from "./EmploymentData"
import { CustomLink } from "@/components/custom/CustomParagraph"
import { downloadDocument, getBase64 } from "@/helpers/base64-helpers"
import NoData from "@/components/NoData"
import { getSessionInfo } from "@/lib/session"
import useDrawerStore from "@/stores/drawerStore"
import CustomFrom from "@/components/custom/CustomFrom"
import { formItemLayout } from "@/styles/breakpoints"
import { normalizeFiles } from "@/helpers/form-item-normalizers"
import CustomInputGroup from "@/components/custom/CustomInputGroup"
import errorHandler from "@/helpers/errorHandler"
import useUpdateUser from "@/services/hooks/user/useUpdateUser"
import ChangePasswordForm from "./ChangePasswordForm"
import useChangePassword from "@/services/hooks/user/useChangePassword"
import { customNotification } from "@/components/custom/customNotification"
import ChangeProfilePicForm from "./ChangeProfilePicForm"

const AvatarContainer = styled(CustomCard)`
  height: 150px;
  min-height: 150px;
  width: 100% !important;
  background-color: ${({ theme }) => theme.baseBgColor} !important;
  background-image: url("https://images.unsplash.com/photo-1654599879153-61eb2d785fb7?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D") !important;
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;

  .button-container {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 10px;
  }
`

const DocumentContainer = styled(CustomCard)`
  width: 100%;
  height: 80px;
  margin-top: 20px;
`

const EmployeeProfile: React.FC = () => {
  const [form] = Form.useForm()
  const fileList: UploadFile = Form.useWatch("AVATAR_FILE", form)
  const [fileExtension, setFileExtension] = useState("")
  const [changePasswordModal, setChangePasswordModal] = useState(false)
  const [showChangeProfileOptions, setShowChangeProfileOptions] =
    useState(false)
  const { user } = useUserStore()
  const { open, setOpenDrawer } = useDrawerStore()

  const { mutateAsync: updateUser, isPending } = useUpdateUser()
  const { mutateAsync: changePassword, isPending: changePasswordIsPending } =
    useChangePassword()

  useEffect(() => {
    if (user?.RESUME) {
      const type = user.RESUME.split(",")[0].match(/:(.*?);/)?.[1] as string
      setFileExtension(type.split("/")[1])
    }
  }, [user])

  const handleUpdateUser = useCallback(async () => {
    try {
      const data = await form.validateFields()
      if (!Object.keys(data).length) return

      let url = data.AVATAR_URL

      if (fileList?.uid) {
        url = await getBase64(fileList)
      }

      await updateUser({ USER_ID: user.USER_ID, AVATAR: url })

      form.resetFields()
      setShowChangeProfileOptions(false)
    } catch (error) {
      errorHandler(error)
    }
  }, [fileList, form])

  useEffect(() => {
    handleUpdateUser
  }, [handleUpdateUser])

  const handleModalState = () => {
    setShowChangeProfileOptions(!showChangeProfileOptions)
  }

  const handleChangePassword = async () => {
    try {
      const data = await form.validateFields()

      delete data.CONFIRM_PASSWORD

      await changePassword({ USER_ID: user.USER_ID, ...data })
      customNotification({
        type: "success",
        message: "Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada con éxito",
      })
      form.resetFields()
      setChangePasswordModal(false)
    } catch (error) {
      errorHandler(error)
    }
  }

  const isMyProfile = getSessionInfo().USER_ID === user.USER_ID

  const personalInfoItems: DescriptionsProps["items"] = [
    {
      key: "CREATED_AT",
      label: "Fecha de registro",
      children: logDate(user.CREATED_AT),
      span: 2,
    },
    {
      key: "USER_ID",
      label: "Código",
      children: user.USER_ID,
    },
    {
      key: "STATE",
      label: "Estado",
      children: (
        <CustomTag color={states[user.STATE].color}>
          {states[user.STATE].label}
        </CustomTag>
      ),
    },
    {
      key: "USERNAME",
      label: "Usuario",
      children: `@${user.USERNAME}`,
    },
    {
      key: "PASSWORD",
      label: isMyProfile ? "Contraseña" : "",
      children: (
        <ConditionalComponent condition={isMyProfile} fallback={" "}>
          <CustomSpace direction={"horizontal"} size={2}>
            <span>**********</span>
            <CustomTooltip title={"Cambiar contraseña"} placement={"right"}>
              <CustomButton
                type={"link"}
                icon={<EditOutlined />}
                onClick={() => setChangePasswordModal(true)}
              />
            </CustomTooltip>
          </CustomSpace>
        </ConditionalComponent>
      ),
    },
    {
      key: "FIRST_NAME",
      label: "Nombre",
      children: user.NAME,
    },
    {
      key: "LAST_NAME",
      label: "Apellido",
      children: user.LAST_NAME,
    },
    {
      key: "EMAIL",
      label: "Correo electrónico",
      children: user.EMAIL,
    },
    {
      key: "PHONE",
      label: "Teléfono",
      children: formatter({
        value: user.PHONE?.replace(/\D/g, ""),
        format: "phone",
      }),
    },
    {
      key: "BIRTHDAY",
      label: "Fecha de nacimiento",
      children: logDate(user.BIRTH_DAY),
    },
    {
      key: "DESC_GENDER",
      label: "Género",
      children: user.DESC_GENDER,
    },
    {
      key: "ADDRESS",
      label: "Dirección",
      children: user.ADDRESS,
      span: 2,
    },
  ]

  const employeeInfoItems: DescriptionsProps["items"] = [
    {
      key: "ROLES",
      label: "Rol",
      span: 2,
      children: (
        <CustomSpace direction="horizontal" wrap>
          {user.ROLES.map((role) => (
            <CustomTag key={role.ROL_ID} color={role.COLOR}>
              {role.NAME}
            </CustomTag>
          ))}
        </CustomSpace>
      ),
    },
    {
      key: "HIRED_DATE",
      label: "Contratación",
      children: logDate(user.HIRED_DATE),
    },
    {
      key: "CONTRACT_END",
      label: "Finalización contrato",
      children: logDate(user.CONTRACT_END),
    },
    {
      key: "GROSS_SALARY",
      label: "Salario bruto",
      children: formatter({
        value: user.GROSS_SALARY,
        format: "currency",
        prefix: user.CURRENCY,
        fix: 2,
      }),
    },
    {
      key: "TAXES",
      label: "Impuestos",
      children: formatter({
        value: user.TAX,
        format: "currency",
        prefix: user.CURRENCY,
        fix: 2,
      }),
    },
    {
      key: "NET_SALARY",
      label: "Salario neto",
      span: 2,
      children: formatter({
        value: user.NET_SALARY,
        format: "currency",
        prefix: user.CURRENCY,
        fix: 2,
      }),
    },
    {
      key: "SUPERVISOR",
      label: "Supervisor",
      children: user.SUPERVISOR,
    },
  ]

  const items: CollapseProps["items"] = [
    {
      key: 1,
      label: <CustomText strong>Información personal</CustomText>,
      children: <CustomDescriptions column={2} items={personalInfoItems} />,
    },
    {
      key: 2,
      label: <CustomText strong>Información laboral</CustomText>,
      children: <CustomDescriptions column={2} items={employeeInfoItems} />,
    },
    {
      key: 3,
      label: <CustomText strong>Documentos</CustomText>,
      children: (
        <CustomRow>
          <ConditionalComponent
            condition={!!user?.RESUME}
            fallback={<NoData />}
          >
            <DocumentContainer>
              <CustomRow justify={"space-between"}>
                <CustomSpace
                  width={"80%"}
                  direction={"horizontal"}
                  size={10}
                  align={"center"}
                >
                  {documentIcons[fileExtension]}
                  <CustomSpace size={1}>
                    <CustomLink
                      onClick={() => downloadDocument(user?.RESUME ?? "")}
                    >
                      Descargar Documento
                    </CustomLink>
                    <CustomText type={"secondary"}>Currículum</CustomText>
                  </CustomSpace>
                </CustomSpace>
              </CustomRow>
            </DocumentContainer>
          </ConditionalComponent>
        </CustomRow>
      ),
    },
  ]

  return (
    <>
      <CustomDrawer
        closable={false}
        placement={"right"}
        width={"50%"}
        open={open}
        onClose={() => setOpenDrawer(false)}
      >
        <CustomRow width={"100%"} gap={10}>
          <AvatarContainer>
            <CustomRow gap={10} justify={"start"} align={"middle"}>
              <CustomAvatar
                shape={"square"}
                shadow
                size={100}
                src={user?.AVATAR}
              >
                {user?.AVATAR}
              </CustomAvatar>
              <CustomSpace width={"max-content"} size={2}>
                <CustomText strong>
                  {user?.NAME} {user?.LAST_NAME}
                </CustomText>
                <CustomText type={"secondary"}>@{user?.USERNAME}</CustomText>
              </CustomSpace>
            </CustomRow>
            <ConditionalComponent condition={isMyProfile}>
              <CustomTooltip
                title={"Cambiar foto de perfil"}
                placement={"left"}
              >
                <div className={"button-container"}>
                  <CustomButton
                    size={"middle"}
                    icon={<UploadOutlined />}
                    onClick={handleModalState}
                  />
                </div>
              </CustomTooltip>
            </ConditionalComponent>
          </AvatarContainer>
          <CustomCol xs={24}>
            <CustomCollapse defaultActiveKey={[1, 2, 3]} items={items} />
          </CustomCol>
        </CustomRow>
      </CustomDrawer>

      <ChangePasswordForm
        onFinish={handleChangePassword}
        open={changePasswordModal}
        onClose={() => setChangePasswordModal(false)}
        form={form}
        loading={changePasswordIsPending}
      />

      <ChangeProfilePicForm
        open={showChangeProfileOptions}
        onClose={handleModalState}
        onFinish={handleUpdateUser}
        form={form}
        loading={isPending}
      />
    </>
  )
}

export default EmployeeProfile

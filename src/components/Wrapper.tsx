"use client"

import React, { useEffect, useTransition } from "react"
import CustomLayout from "./custom/CustomLayout"
import styled from "styled-components"
import {
  CustomAvatar,
  CustomBadge,
  CustomButton,
  CustomCol,
  CustomContent,
  CustomDropdown,
  CustomHeader,
  CustomMenu,
  CustomRow,
  CustomSider,
  CustomSpace,
  CustomSpin,
  CustomText,
} from "./custom"
import { getSessionInfo, isLoggedIn, removeSession } from "@/lib/session"
import ConditionalComponent from "./ConditionalComponent"
import { PATH_HOME } from "@/constants/routes"
import { useGetMenuOptions } from "@/services/hooks"
import useMenuOptionStore from "@/stores/useMenuOptionStore"
import SVGReader from "./SVGReader"
import {
  BellOutlined,
  LogoutOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { truncateText } from "@/helpers/truncateText"
import { ItemType } from "antd/lib/menu/interface"
import { MenuOption } from "@/interfaces/user"
import getSelectedOption from "@/helpers/getSelectedOption"
import { useRouter } from "next/navigation"
import useModalStore from "@/stores/modalStore"
import MotionComponent from "./MotionComponent"
import useDrawerStore from "@/stores/drawerStore"
import useGetUser from "@/services/hooks/user/useGetUser"
import { CustomModalConfirmation } from "./custom/CustomModalMethods"
import useIsAuthorized from "@/hooks/useIsAuthorized"
import { GenericParameters } from "@/interfaces/parameters"
import { assert } from "@/helpers/assert"
import EmployeeProfile from "@/app/employees/components/EmployeeProfile"
import Fallback from "./Fallback"
import Link from "next/link"
import { MenuProps } from "antd"
import { w3cwebsocket as W3CWebSocket } from "websocket"
import { customNotification } from "./custom/customNotification"
import jsonParse from "@/helpers/jsonParse"

const LogoContainer = styled.div`
  height: 75px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  cursor: pointer;
`

const Logo = styled.span`
  font-family: "Courier New", Courier, monospace;
  font-size: 32px;
  font-weight: bold;
  color: white;
  padding: 16px;
  display: block;
  text-align: center;
  color: ${({ theme }) => theme.colorPrimaryText};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`

const HeaderContainer = styled(CustomRow)`
  height: 75px;
  min-height: 62px;
  width: 100%;
  gap: 16px;
`

const Content = styled(CustomContent)``

const Sider = styled(CustomSider)`
  height: 100vh !important;
  overflow: auto !important;
  position: fixed !important;
  left: 0 !important;
  top: 0 !important;
  bottom: 0 !important;
  background-color: #ffffff !important;
  border-right: 1px solid #f3f3f3 !important;
`

const UserContainer = styled.div`
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  width: 90%;
  margin: 25px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  padding: 8px;
  cursor: pointer;
`

const CustomContentContainer = styled.div`
  background: ${(props) => props.theme.colorBgContainer};
  border-radius: ${(props) => props.theme.borderRadius};
  margin: 0px 34px 10px 274px !important;
  padding: 10px;
  height: auto;

  @media screen and (min-width: 1430px) {
    max-width: 1090px;
    margin: 0px 34px 10px 460px !important;
  }

  @media screen and (max-width: 1800px) {
    margin: 0px 34px 10px 274px !important;
    max-width: 1377px;
  }
`

const ContentLayout = styled(CustomLayout)`
  margin-left: 240px !important;
  font-size: 100px !important;
  height: 100vh !important;
`

const LogoutContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
`
interface WrapperProps {
  children: React.ReactNode
}

const Wrapper: React.FC<WrapperProps> = (props) => {
  const router = useRouter()
  // const socket = useSocket()
  const client = new W3CWebSocket("ws://localhost:8000/ws/notifications")
  const [isPending, startTransition] = useTransition()
  const { setOpenDrawer, open } = useDrawerStore()
  const { setVisible } = useModalStore()
  const { parameters, menuOptions, setSelectedMenuOption, setParameters } =
    useMenuOptionStore()

  const { isPending: menuOptionIsPending } = useGetMenuOptions(!isLoggedIn())
  const { mutateAsync: getUser, isPending: isUserPending } = useGetUser()

  assert<GenericParameters>(parameters)

  const operationCreate =
    parameters?.ID_OPERACION_CREAR_EMPLEADOS ||
    parameters?.ID_OPERACION_CREAR_TAREAS ||
    parameters?.ID_OPERACION_CREAR_NOMINA

  const canCreate = useIsAuthorized(Number(operationCreate))

  useEffect(() => {
    client.onopen = () => {
      client.send(JSON.stringify({ message: "Ahora estoy conectado." }))
    }

    client.onmessage = ({ data }) => {
      const info = jsonParse<Record<string, string>>(data as unknown as string)
    }
  }, [client])

  useEffect(() => {
    setSelectedMenuOption(getSelectedOption())
    setParameters(getSelectedOption()?.parameters)
  }, [menuOptions])

  const handleLogout = () => {
    CustomModalConfirmation({
      title: "Cerrar Sesión",
      content: "¿Estás seguro que deseas cerrar sesión?",
      onOk: async () => {
        removeSession()
        window.location.reload()
      },
    })
  }

  const handleOnSelect = (item: MenuOption) => {
    if (item.type !== "link") {
      setSelectedMenuOption(item)
      setParameters(item.parameters)
    }
  }

  const items: ItemType[] = menuOptions.map(({ icon, label, ...item }) => ({
    ...item,
    icon: <SVGReader svg={icon as string} />,
    type: item.type as any,
    onClick: () => handleOnSelect({ ...item, label }),
    label: (
      <ConditionalComponent condition={!!item.path} fallback={label}>
        <Link href={item.path} passHref legacyBehavior>
          <a target={item.type === "link" ? "_blank" : undefined}>{label}</a>
        </Link>
      </ConditionalComponent>
    ),
  }))

  const notifyItems: MenuProps["items"] = [
    {
      label: (
        <CustomRow justify={"space-between"}>
          <div
            style={{
              width: "max-content",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CustomText strong>Task</CustomText>{" "}
            <CustomText type={"secondary"}>Notification Message 1</CustomText>
          </div>
          <CustomBadge dot />
        </CustomRow>
      ),
      key: "1",
    },
    {
      label: (
        <CustomRow justify={"space-between"}>
          <div
            style={{
              width: "max-content",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CustomText strong>Users</CustomText>{" "}
            <CustomText type={"secondary"}>Notification Message 2</CustomText>
          </div>
          <CustomBadge dot />
        </CustomRow>
      ),
      key: "2",
    },
    {
      label: (
        <CustomRow justify={"space-between"}>
          <div
            style={{
              width: "max-content",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CustomText strong>Payroll</CustomText>{" "}
            <CustomText type={"secondary"}>Notification Message 3</CustomText>
          </div>
          <CustomBadge dot />
        </CustomRow>
      ),
      key: "3",
    },
  ]

  return (
    <ConditionalComponent
      condition={isLoggedIn() || menuOptionIsPending}
      fallback={props.children}
    >
      <>
        <CustomLayout hasSider>
          <Sider theme={"light"} width={240}>
            <LogoContainer
              onClick={() => {
                router.push(PATH_HOME)
                setSelectedMenuOption({} as MenuOption)
              }}
            >
              <img width={"85%"} src={"/assets/logo_1.svg"} />
            </LogoContainer>
            <CustomRow>
              <UserContainer
                onClick={async () => {
                  await getUser({
                    condition: {
                      USER_ID: getSessionInfo().USER_ID,
                    },
                  })
                  setOpenDrawer(true)
                }}
              >
                <CustomAvatar
                  icon={<UserOutlined />}
                  shape="circle"
                  size={36}
                  src={getSessionInfo().AVATAR}
                />
                <CustomCol xs={18}>
                  <CustomSpace size={1}>
                    <CustomText strong>
                      {truncateText(getSessionInfo().FULL_NAME, 20)}
                    </CustomText>
                    <CustomText type="secondary">
                      {getSessionInfo().ROLES?.[0]}
                    </CustomText>
                  </CustomSpace>
                </CustomCol>
              </UserContainer>
            </CustomRow>
            <CustomMenu
              theme="light"
              mode="inline"
              defaultSelectedKeys={[getSelectedOption()?.key]}
              items={items}
            />

            <LogoutContainer>
              <CustomButton
                size={"large"}
                type={"text"}
                icon={<LogoutOutlined />}
                block
                onClick={handleLogout}
              >
                Cerrar Sesión
              </CustomButton>
            </LogoutContainer>
          </Sider>
          <ContentLayout>
            <CustomHeader
              style={{
                marginLeft: "240px",
                height: "75px",
              }}
            >
              <HeaderContainer justify={"space-between"} align={"middle"}>
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: 24,
                  }}
                >
                  {getSelectedOption()?.title}
                </span>
                <CustomRow justify={"end"} align={"middle"} gap={8}>
                  <ConditionalComponent condition={canCreate}>
                    <CustomButton
                      size={"large"}
                      type="primary"
                      icon={<PlusOutlined />}
                      shape={"circle"}
                      onClick={() => setVisible(true)}
                    />
                  </ConditionalComponent>
                  <CustomButton
                    size={"large"}
                    icon={<SearchOutlined />}
                    shape={"circle"}
                  />
                  <CustomDropdown
                    destroyPopupOnHide
                    menu={{
                      items: notifyItems,
                      className: "notification-dropdown",
                    }}
                    dropdownRender={(node) => (
                      <div style={{ width: "400px" }}>{node}</div>
                    )}
                  >
                    <CustomBadge count={5}>
                      <CustomButton
                        size={"large"}
                        icon={<BellOutlined />}
                        shape={"circle"}
                      />
                    </CustomBadge>
                  </CustomDropdown>
                </CustomRow>
              </HeaderContainer>
            </CustomHeader>
            <Content>
              <CustomContentContainer>
                <ConditionalComponent
                  condition={!isPending}
                  fallback={<Fallback />}
                >
                  <MotionComponent key={isPending ? 1 : 0}>
                    <CustomSpin spinning={isUserPending}>
                      {props.children}
                    </CustomSpin>
                  </MotionComponent>
                </ConditionalComponent>
              </CustomContentContainer>
            </Content>
          </ContentLayout>
        </CustomLayout>

        <ConditionalComponent condition={open}>
          <EmployeeProfile />
        </ConditionalComponent>
      </>
    </ConditionalComponent>
  )
}

export default Wrapper

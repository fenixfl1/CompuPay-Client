import React, { useCallback, useEffect, useState } from "react"
import { customNotification } from "./custom/customNotification"
import {
  CustomAvatar,
  CustomBadge,
  CustomButton,
  CustomCol,
  CustomDropdown,
  CustomParagraph,
  CustomRow,
  CustomSpin,
  CustomText,
} from "./custom"
import { MenuProps } from "antd"
import jsonParse from "@/helpers/jsonParse"
import { useWebSocket } from "@/context/web-socket"
import useGetNotifications from "@/services/hooks/notifications/useGetNotification"
import styled from "styled-components"
import { getSessionInfo } from "@/lib/session"
import randomHexColorCode from "@/helpers/random-hex-color-code"
import { BellOutlined } from "@ant-design/icons"
import errorHandler from "@/helpers/errorHandler"
import useMarkAsRead from "@/services/hooks/notifications/useMarkAsRead"

const NotificationItem = styled.div`
  padding: 5px;
  max-width: 320px;
  text-wrap: wrap;
`

const DropdownContainer = styled.div`
  width: 450px;
  max-height: 600px;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.boxShadow};
`

const Mention = styled.span`
  color: #1890ff; /* Color para el nombre de usuario */
  font-weight: bold;
`

const BoldText = styled.strong`
  font-weight: bold;
  text-decoration: underline;
`

const textFormatter = (message: string) => {
  const regex = /(@\w+|#[^#]+#)/g

  return message.split(regex).map((part, index) => {
    if (part.startsWith("@")) {
      return <Mention key={index}>{part}</Mention>
    }
    if (part.startsWith("#") && part.endsWith("#")) {
      return <BoldText key={index}>{part.replace(/#/g, "")} </BoldText>
    }

    return (
      <span key={index}>
        <div dangerouslySetInnerHTML={{ __html: part }} />
      </span>
    )
  })
}

interface NotificationProps {
  children: React.ReactNode
}

const Notifications: React.FC<NotificationProps> = ({ children }) => {
  const socket = useWebSocket()

  const [shouldUpdate, setShouldUpdate] = useState<boolean>()

  const {
    mutate: getNotifications,
    isPending,
    data: { data, metadata },
  } = useGetNotifications()
  const { mutateAsync: markAsRead } = useMarkAsRead()

  const handleGetNotification = useCallback(
    (page = metadata?.page, size = metadata?.page_size) => {
      getNotifications({
        page,
        size,
        condition: [
          {
            field: "STATE",
            dataType: "str",
            condition: "A",
            operator: "=",
          },
          {
            field: "RECEIVER__USERNAME",
            dataType: "str",
            condition: getSessionInfo().USERNAME,
            operator: "=",
          },
        ],
      })
    },
    [shouldUpdate]
  )

  useEffect(handleGetNotification, [handleGetNotification])

  useEffect(() => {
    if (socket) {
      socket.onmessage = ({ data }) => {
        const obj = jsonParse<any>(data)
        const message = jsonParse<{ message: string; type: string }>(
          obj.message
        )

        if (message?.type === "ontime") {
          customNotification({
            description: textFormatter(message.message),
            duration: 30,
            icon: <BellOutlined />,
            message: "Notification",
            placement: "bottomRight",
            type: "info",
          })
        }
      }
    }
  }, [socket])

  const handleUpdateNotifications = async () => {
    try {
      await markAsRead({
        condition: {
          USERNAME: getSessionInfo().USERNAME,
        },
      })

      setShouldUpdate(!setShouldUpdate)
    } catch (error) {
      errorHandler(error)
    }
  }

  const notifyItems: MenuProps["items"] = data.map((item, index) => ({
    key: index,
    label: (
      <CustomRow gap={5} justify={"start"} align={"top"}>
        <CustomAvatar
          shadow
          size={36}
          src={item.SENDER.AVATAR}
          style={{
            backgroundColor:
              item.SENDER.USERNAME?.length === 2
                ? randomHexColorCode()
                : undefined,
          }}
        >
          {item.SENDER.AVATAR}
        </CustomAvatar>

        <NotificationItem>
          <CustomParagraph>
            <CustomCol xs={24}>
              <CustomText type={"secondary"}>{item.CREATED_AT}</CustomText>
            </CustomCol>
            {textFormatter(item.MESSAGE)}
          </CustomParagraph>
        </NotificationItem>
      </CustomRow>
    ),
  }))

  return (
    <CustomDropdown
      dropdownRender={(node) => (
        <CustomSpin spinning={isPending}>
          <DropdownContainer>
            <CustomRow justify={"end"}>
              <CustomButton type={"link"} onClick={handleUpdateNotifications}>
                Marcar como leídas
              </CustomButton>
            </CustomRow>
            {node}
          </DropdownContainer>
        </CustomSpin>
      )}
      destroyPopupOnHide
      menu={{
        items: notifyItems,
        className: "notification-dropdown",
      }}
    >
      <CustomBadge count={data?.filter((item) => !item.IS_READ).length}>
        {children}
      </CustomBadge>
    </CustomDropdown>
  )
}

export default Notifications

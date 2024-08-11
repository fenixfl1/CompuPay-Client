import React from "react"
import { Modal, ModalProps } from "antd"
import { CheckOutlined, StopOutlined } from "@ant-design/icons"
import { defaultTheme } from "@/styles/themes"

const CustomModal: React.FC<ModalProps> = ({
  okText = "Aceptar",
  cancelText = "Cancelar",
  okButtonProps = { icon: <CheckOutlined />, size: defaultTheme.size },
  cancelButtonProps = { icon: <StopOutlined />, size: defaultTheme.size },
  ...props
}) => {
  return (
    <Modal
      cancelButtonProps={cancelButtonProps}
      okButtonProps={okButtonProps}
      okText={okText}
      cancelText={cancelText}
      {...props}
    >
      {props.children}
    </Modal>
  )
}

export default CustomModal

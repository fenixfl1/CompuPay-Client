import {
  CustomModal,
  CustomSpin,
  CustomRow,
  CustomAlert,
  CustomFormItem,
  CustomInput,
  CustomTooltip,
  CustomUpload,
} from "@/components/custom"
import CustomFrom from "@/components/custom/CustomFrom"
import CustomInputGroup from "@/components/custom/CustomInputGroup"
import { formItemLayout } from "@/styles/breakpoints"
import { BulbOutlined } from "@ant-design/icons"
import { FormInstance } from "antd"
import React from "react"

interface ChangeProfilePicFormProps {
  open: boolean
  onClose: () => void
  onFinish: () => void
  loading: boolean
  form: FormInstance
}

const ChangeProfilePicForm: React.FC<ChangeProfilePicFormProps> = ({
  open,
  onClose,
  onFinish,
  loading,
  form,
}) => {
  return (
    <CustomModal
      open={open}
      onCancel={onClose}
      title={"Cambiar foto de perfil"}
      onOk={onFinish}
    >
      <CustomSpin spinning={loading}>
        <CustomRow width={"100%"}>
          <CustomFrom
            style={{ width: "100%" }}
            layout="vertical"
            form={form}
            {...formItemLayout}
          >
            <CustomAlert
              closable
              message={"Tips"}
              showIcon
              icon={<BulbOutlined />}
              description={
                "Puedes cargar una imagen desde tu dispositivo o pegar la URL de la imagen"
              }
              type={"info"}
            />
            <CustomFormItem>
              <CustomInputGroup>
                <CustomFormItem noStyle name={"PREFIX"} initialValue={"HTTPS"}>
                  <CustomInput disabled width={"10%"} />
                </CustomFormItem>
                <CustomFormItem
                  noStyle
                  rules={[{ type: "url" }]}
                  name={"AVATAR_URL"}
                >
                  <CustomInput
                    placeholder={"https://some-image-url.com"}
                    width={"80%"}
                  />
                </CustomFormItem>
                <CustomTooltip title={"Cargar image desde mi dispositivo"}>
                  <CustomFormItem noStyle name={"AVATAR_FILE"}>
                    <CustomUpload listType={"text"} accept={"image/*"} />
                  </CustomFormItem>
                </CustomTooltip>
              </CustomInputGroup>
            </CustomFormItem>
          </CustomFrom>
        </CustomRow>
      </CustomSpin>
    </CustomModal>
  )
}

export default ChangeProfilePicForm

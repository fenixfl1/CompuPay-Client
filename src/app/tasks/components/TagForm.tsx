import {
  CustomCol,
  CustomColorPicker,
  CustomForm,
  CustomFormItem,
  CustomInput,
  CustomModal,
  CustomRow,
  CustomSpin,
  CustomTextArea,
} from "@/components/custom"
import errorHandler from "@/helpers/errorHandler"
import { Tag } from "@/interfaces/task"
import useCreateTag from "@/services/hooks/tasks/useCreateTag"
import useGetTagList from "@/services/hooks/tasks/useGetTagList"
import useUpdateTag from "@/services/hooks/tasks/useUpdateTag"
import { formItemLayout, labelColFullWidth } from "@/styles/breakpoints"
import { Form } from "antd"
import { ColorFactory } from "antd/es/color-picker/color"
import React, { useEffect } from "react"

interface TagFormProps {
  open: boolean
  onClose: () => void
  tag?: Tag
}

const TagForm: React.FC<TagFormProps> = ({ open, onClose, tag }) => {
  const [form] = Form.useForm()
  const { mutate: getTags } = useGetTagList()
  const { mutateAsync: createTag, isPending: createTagIsPending } =
    useCreateTag()
  const { mutateAsync: updateTag, isPending: updateTagIsPending } =
    useUpdateTag()

  const isEditing = !!tag

  useEffect(() => {
    form.setFieldsValue({ ...tag })
  }, [tag])

  const handleOnCancel = () => {
    form.resetFields()
    onClose()
  }

  const handleOnOk = async () => {
    try {
      const data = await form.validateFields()
      data.state = "A"

      if (isEditing) {
        await updateTag({ ...tag, ...data })
      } else {
        await createTag(data)
      }

      getTags([
        {
          condition: "A",
          field: "STATE",
          dataType: "str",
          operator: "=",
        },
      ])
      handleOnCancel()
    } catch (error) {
      errorHandler(error)
    }
  }

  return (
    <CustomModal
      onCancel={handleOnCancel}
      onOk={handleOnOk}
      open={open}
      title={"Crear etiqueta"}
      okText={isEditing ? "Actualizar" : "Crear"}
    >
      <CustomSpin spinning={createTagIsPending || updateTagIsPending}>
        <CustomForm form={form} {...formItemLayout}>
          <CustomRow>
            <CustomCol xs={24}>
              <CustomFormItem
                name={"NAME"}
                label={"Nombre"}
                rules={[{ required: true }]}
                {...labelColFullWidth}
              >
                <CustomInput placeholder={"Nombre de la etiqueta"} />
              </CustomFormItem>
            </CustomCol>
            <CustomCol xs={24}>
              <CustomFormItem
                name={"DESCRIPTION"}
                label={"Descripción"}
                {...labelColFullWidth}
              >
                <CustomTextArea placeholder={"Descripción de la etiqueta"} />
              </CustomFormItem>
            </CustomCol>
            <CustomCol xs={24}>
              <CustomFormItem
                name={"COLOR"}
                label={"Color"}
                initialValue={isEditing ? "#8B89CF" : undefined}
                getValueFromEvent={(color: ColorFactory) => {
                  return `#${color.toHex()}`
                }}
                {...labelColFullWidth}
              >
                <CustomColorPicker showText />
              </CustomFormItem>
            </CustomCol>
          </CustomRow>
        </CustomForm>
      </CustomSpin>
    </CustomModal>
  )
}

export default TagForm

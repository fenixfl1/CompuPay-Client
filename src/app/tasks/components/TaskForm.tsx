import {
  CustomButton,
  CustomCol,
  CustomForm,
  CustomFormItem,
  CustomInput,
  CustomModal,
  CustomRangePicker,
  CustomRow,
  CustomSelect,
  CustomSpace,
  CustomSpin,
  CustomTag,
  CustomTextArea,
} from "@/components/custom"
import CustomInputGroup from "@/components/custom/CustomInputGroup"
import { Tag } from "@/interfaces/task"
import useModalStore from "@/stores/modalStore"
import useTagStore from "@/stores/tagStore"
import {
  defaultBreakpoints,
  formItemLayout,
  labelColFullWidth,
} from "@/styles/breakpoints"
import { PlusOutlined } from "@ant-design/icons"
import { Form } from "antd"
import React, { useEffect, useState } from "react"
import TagsList from "./TagsList"
import { useGetUserLIst } from "@/services/hooks/user/useGetUserList"
import useDebounce from "@/hooks/useDebounce"
import useCreateTask from "@/services/hooks/tasks/useCreateTask"
import errorHandler from "@/helpers/errorHandler"
import ConditionalComponent from "@/components/ConditionalComponent"

const priorityOptions = [
  { label: "Baja", value: "L" },
  { label: "Media", value: "M" },
  { label: "Alta", value: "H" },
]

const TaskForm: React.FC = () => {
  const [form] = Form.useForm()
  const [searchValue, setSearchValue] = useState("")
  const [showTagList, setShowTagList] = useState(false)
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const { visible, setVisible } = useModalStore()

  const debounce = useDebounce(searchValue)

  const { mutateAsync: createTask, isPending: createTaskIsPending } =
    useCreateTask()
  const { mutate: getUser, data } = useGetUserLIst()

  const userOptions = data?.data?.map((user) => ({
    label: `${user?.NAME} ${user.LAST_NAME} - ${user.USERNAME}`,
    value: user.USERNAME,
  }))

  useEffect(() => {
    return () => {
      form.resetFields()
      setSelectedTags([])
    }
  }, [])

  useEffect(() => {
    getUser({
      page: 1,
      size: 15,
      condition: [
        {
          condition: "A",
          field: "STATE",
          dataType: "str",
          operator: "=",
        },
        {
          condition: debounce,
          field: ["NAME", "LAST_NAME", "USERNAME"],
          dataType: "str",
          operator: "ILIKE",
        },
      ],
    })
  }, [debounce])

  const handleOnOk = async () => {
    try {
      const data = await form.validateFields()

      data.TAGS = selectedTags.map((tag) => tag.TAG_ID)
      data.START_DATE = data.FECHAS[0].toISOString()
      data.END_DATE = data.FECHAS[1].toISOString()
      data.STATE = "A"

      delete data.FECHAS

      await createTask(data)
      setVisible(false)
    } catch (error) {
      errorHandler(error)
    }
  }

  return (
    <>
      <CustomModal
        destroyOnClose
        open={visible}
        width={"700px"}
        style={{ maxWidth: "100%" }}
        onCancel={() => setVisible(false)}
        onOk={handleOnOk}
        title={"Nueva Tarea"}
      >
        <CustomSpin spinning={createTaskIsPending}>
          <CustomForm form={form} {...formItemLayout}>
            <CustomRow justify={"start"}>
              <CustomCol xs={24}>
                <CustomFormItem
                  label={"Titulo"}
                  name={"NAME"}
                  rules={[{ required: true }]}
                  {...labelColFullWidth}
                >
                  <CustomInput placeholder={"Titulo de la tarea"} />
                </CustomFormItem>
              </CustomCol>

              <CustomCol xs={24}>
                <CustomFormItem
                  label={"Usuarios"}
                  name={"ASSIGNED_USERS"}
                  {...labelColFullWidth}
                >
                  <CustomSelect
                    showSearch
                    mode={"multiple"}
                    onSearch={setSearchValue}
                    placeholder={"Seleccionar usuario asignado"}
                    options={userOptions}
                  />
                </CustomFormItem>
              </CustomCol>
              <CustomCol {...defaultBreakpoints}>
                <CustomFormItem
                  label={"Fechas"}
                  name={"FECHAS"}
                  tooltip={"Fecha de inicio y de entrega de la tarea"}
                >
                  <CustomRangePicker
                    placeholder={["Fecha de inicio", "Fecha de entrega"]}
                  />
                </CustomFormItem>
              </CustomCol>
              <CustomCol {...defaultBreakpoints}>
                <CustomFormItem label={"Prioridad"} name={"PRIORITY"}>
                  <CustomSelect
                    placeholder={"Seleccionar Prioridad"}
                    options={priorityOptions}
                  />
                </CustomFormItem>
              </CustomCol>
              <ConditionalComponent condition={false}>
                <CustomCol xs={20} push={4} style={{ marginBottom: "20px" }}>
                  <CustomSpace direction="horizontal" size={4} wrap>
                    {selectedTags.map((tag) => (
                      <CustomTag
                        closable
                        onClose={() => {
                          setSelectedTags((prev) =>
                            prev.filter(
                              (prevTag) => prevTag.TAG_ID !== tag.TAG_ID
                            )
                          )
                        }}
                        key={tag.TAG_ID}
                        color={tag.COLOR}
                      >
                        {tag.NAME}
                      </CustomTag>
                    ))}
                    <CustomButton
                      icon={<PlusOutlined />}
                      type={"primary"}
                      onClick={() => setShowTagList(true)}
                    >
                      Agregar etiqueta
                    </CustomButton>
                  </CustomSpace>
                </CustomCol>
              </ConditionalComponent>
              <CustomCol xs={24}>
                <CustomFormItem
                  label={"Descripción"}
                  name={"DESCRIPTION"}
                  rules={[{ required: true }]}
                  {...labelColFullWidth}
                >
                  <CustomTextArea rows={2} maxLength={100} />
                </CustomFormItem>
              </CustomCol>
            </CustomRow>
          </CustomForm>
        </CustomSpin>
      </CustomModal>

      <TagsList
        onClose={() => setShowTagList(false)}
        open={showTagList}
        onUnselect={(tag) =>
          setSelectedTags((prev) =>
            prev.filter((prevTag) => prevTag.TAG_ID !== tag.TAG_ID)
          )
        }
        onSelect={(tag) =>
          setSelectedTags((prev) => Array.from(new Set([...prev, tag])))
        }
      />
    </>
  )
}

export default TaskForm

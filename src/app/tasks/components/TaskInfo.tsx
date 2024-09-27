import ConditionalComponent from "@/components/ConditionalComponent"
import {
  CustomAvatar,
  CustomButton,
  CustomCheckboxGroup,
  CustomCol,
  CustomDatePicker,
  CustomDivider,
  CustomForm,
  CustomModal,
  CustomParagraph,
  CustomRadioGroup,
  CustomRow,
  CustomSpace,
  CustomTag,
  CustomText,
  CustomTitle,
  CustomTooltip,
} from "@/components/custom"
import { CustomModalConfirmation } from "@/components/custom/CustomModalMethods"
import { assert } from "@/helpers/assert"
import capitalize from "@/helpers/capitalize"
import { compareDate } from "@/helpers/date-helpers"
import errorHandler from "@/helpers/errorHandler"
import formatter from "@/helpers/formatter"
import randomHexColorCode from "@/helpers/random-hex-color-code"
import { EditConfig } from "@/interfaces/general"
import { Task } from "@/interfaces/task"
import useAddOrRemoveUserFromTask from "@/services/hooks/tasks/useAddOrRemoveUserFromTask"
import useGetTask from "@/services/hooks/tasks/useGetTask"
import useUpdateTask from "@/services/hooks/tasks/useUpdateTask"
import useTaskStore from "@/stores/taskStore"
import useUserStore from "@/stores/userStore"
import { defaultBreakpoints } from "@/styles/breakpoints"
import {
  ArrowDownOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  WarningOutlined,
} from "@ant-design/icons"
import { Form } from "antd"
import React, { useEffect, useState } from "react"
import styled from "styled-components"

const TextWrapper = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 10px 20px 5px;
  width: 100%;
  height: auto;
  background-color: ${({ theme }) => theme.textColor};
  display: flex;
  align-items: center;
  align-content: center;
  margin: auto;
  cursor: pointer;

  textarea {
    border: none !important;
    background-color: transparent !important;
    margin-top: 5px !important;
    outline: none !important;

    &:focus {
      outline: none !important;
    }
  }
`

const Tag = styled(CustomTag)`
  width: 110px;
  text-align: center;
  font-size: 16 !important;
`

const Container = styled.div`
  max-height: 250px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
`

const priority: Record<
  string,
  { icon: React.ReactNode; color: string; label: string }
> = {
  L: {
    icon: <ArrowDownOutlined />,
    color: "#73d13d",
    label: "BAJA",
  },
  M: {
    icon: <ExclamationCircleOutlined />,
    color: "#ffa940",
    label: "MEDIA",
  },
  H: {
    icon: <WarningOutlined />,
    color: "#ff4d4f",
    label: "ALTA",
  },
}

interface TaskInfoProps {
  open: boolean
  onClose: () => void
}

const TaskInfo: React.FC<TaskInfoProps> = ({ open, onClose }) => {
  const [form] = Form.useForm()

  const [assignedUsers, setAssignedUsers] = useState<Task["ASSIGNED_USERS"]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [openSelectUserModal, setOpenSelectUserModal] = useState<boolean>()

  const { task } = useTaskStore()
  const { users } = useUserStore()

  assert<Required<Task>>(task)

  const { mutateAsync: updateTask } = useUpdateTask()
  const { mutate: getTask } = useGetTask()
  const { mutateAsync: addOrRemoveUser } = useAddOrRemoveUserFromTask()

  useEffect(() => {
    form.setFieldsValue({
      ...task,
      ASSIGNED_USERS: task.ASSIGNED_USERS?.map((item) => ({
        label: item.FULL_NAME,
        value: item.USERNAME,
      })),
    })
  }, [task])

  useEffect(() => {
    if (task?.ASSIGNED_USERS.length) {
      setAssignedUsers(task?.ASSIGNED_USERS ?? [])
    }
  }, [task])

  useEffect(() => {
    assignedUsers.length &&
      setSelectedUsers(assignedUsers?.map((user) => user.USERNAME))
  }, [assignedUsers])

  const handelGetTask = () => {
    getTask({
      condition: {
        TASK_ID: task.TASK_ID,
      },
    })
  }

  const handleUpdate = async (key: keyof Task, value: string) => {
    if (task[key] === value) return

    try {
      await updateTask({
        TASK_ID: task.TASK_ID,
        [key]: value,
      })

      handelGetTask()
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleAddUsers = async () => {
    try {
      await addOrRemoveUser({
        TASK_ID: task.TASK_ID,
        ASSIGNED_USERS: selectedUsers,
      })

      handelGetTask()
      setOpenSelectUserModal(false)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleOnDelete = async () => {
    CustomModalConfirmation({
      title: "Confirmación",
      content: "¿Seguro que desea archivar esta tarea?",
      onOk: async () => {
        await handleUpdate("STATE", "A")
        onClose()
      },
    })
  }

  const userOptions = users?.map((user) => ({
    label: `${user.NAME} ${user.LAST_NAME} (@${user.USERNAME})`,
    value: user.USERNAME,
    style: { width: "100%" },
  }))

  const editable: EditConfig = {
    icon: null,
    enterIcon: null,
    triggerType: ["text"],
  }

  return (
    <>
      <CustomModal open={open} onCancel={onClose} width={"500px"} footer={null}>
        <CustomDivider />
        <CustomForm form={form}>
          <CustomRow gap={10} justify={"end"}>
            <CustomCol xs={24}>
              <CustomRow justify={"space-between"}>
                <CustomText type={"secondary"}>
                  Creado por:{" "}
                  <CustomText strong>@{task?.CREATED_BY}</CustomText>
                </CustomText>
                <CustomText type={"secondary"}>
                  {formatter({ value: task?.CREATED_AT, format: "date" })}
                </CustomText>
              </CustomRow>
            </CustomCol>
            <Tag
              color={priority[task?.PRIORITY].color}
              icon={priority[task?.PRIORITY].icon}
            >
              Prioridad {priority[task?.PRIORITY].label}
            </Tag>
            <TextWrapper>
              <CustomTitle
                level={4}
                editable={
                  task.STATE === "I"
                    ? false
                    : {
                        ...editable,
                        onChange: (value) => handleUpdate("NAME", value),
                      }
                }
                style={{ width: "100%" }}
              >
                {task.NAME}
              </CustomTitle>
            </TextWrapper>
            <TextWrapper>
              <CustomParagraph
                style={{ width: "100%" }}
                editable={
                  task.STATE === "I"
                    ? false
                    : {
                        ...editable,
                        text: task.DESCRIPTION,
                        onChange: (value) => handleUpdate("DESCRIPTION", value),
                      }
                }
              >
                {task.DESCRIPTION}
              </CustomParagraph>
            </TextWrapper>
            <CustomText
              type={
                compareDate(task?.END_DATE ?? "") === -1
                  ? "danger"
                  : "secondary"
              }
            >
              Vencimiento:{" "}
              {capitalize(
                formatter({ value: task?.END_DATE, format: "long_date" })
              )}
            </CustomText>
            <CustomDivider>
              <CustomText type={"secondary"}>Usuarios asignados</CustomText>
            </CustomDivider>
            <CustomSpace direction={"horizontal"} wrap>
              {assignedUsers.map((user) => (
                <CustomTooltip title={user.FULL_NAME}>
                  <CustomAvatar
                    shadow
                    size={32}
                    src={user.AVATAR}
                    style={{
                      backgroundColor: !user.AVATAR?.length
                        ? randomHexColorCode()
                        : undefined,
                    }}
                  >
                    {user.USERNAME.slice(0, 2).toUpperCase()}
                  </CustomAvatar>
                </CustomTooltip>
              ))}

              <CustomTooltip title={"Agregar usuario"}>
                <CustomButton
                  size={"middle"}
                  type={"primary"}
                  icon={<PlusOutlined />}
                  disabled={task.STATE === "I"}
                  onClick={() => setOpenSelectUserModal(true)}
                />
              </CustomTooltip>
            </CustomSpace>

            <CustomCol xs={24} />
            <ConditionalComponent condition={task.STATE === "A"}>
              <CustomTooltip title={"Archivar Tarea"}>
                <CustomButton
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleOnDelete}
                  size={"large"}
                  type={"link"}
                />
              </CustomTooltip>
            </ConditionalComponent>
          </CustomRow>
        </CustomForm>
      </CustomModal>

      <CustomModal
        open={openSelectUserModal}
        title={"Seleccionar Usuarios"}
        width={"300px"}
        onOk={handleAddUsers}
        onCancel={() => {
          if (assignedUsers.length !== selectedUsers.length) {
            CustomModalConfirmation({
              onOk: () => setOpenSelectUserModal(false),
              title: "Confirmación",
              okText: "Sí, cerrar",
              content:
                "Realizo cambios a lista de usuarios asignados a esta tarea, si cierra esta ventana se perderán los cambios,",
            })
          } else {
            setOpenSelectUserModal(false)
          }
        }}
      >
        <Container>
          <CustomCheckboxGroup
            value={selectedUsers}
            options={userOptions}
            onChange={setSelectedUsers}
          />
        </Container>
      </CustomModal>
    </>
  )
}

export default TaskInfo

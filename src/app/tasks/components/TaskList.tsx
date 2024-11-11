import ConditionalComponent from "@/components/ConditionalComponent"
import {
  CustomButton,
  CustomCheckboxGroup,
  CustomCol,
  CustomDivider,
  CustomForm,
  CustomFormItem,
  CustomPagination,
  CustomPopover,
  CustomRadioGroup,
  CustomRow,
  CustomSearch,
  CustomSelect,
  CustomSpace,
  CustomSpin,
  CustomTooltip,
} from "@/components/custom"
import { CustomText } from "@/components/custom/CustomParagraph"
import NoData from "@/components/NoData"
import { priorities } from "@/constants/general"
import errorHandler from "@/helpers/errorHandler"
import useDebounce from "@/hooks/useDebounce"
import { Task } from "@/interfaces/task"
import useGetTaskList from "@/services/hooks/tasks/useGetTaskList"
import useModalStore from "@/stores/modalStore"
import useTaskStore from "@/stores/taskStore"
import { FilterOutlined, PrinterOutlined } from "@ant-design/icons"
import { Form } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import styled from "styled-components"
import FilterTemplate from "@/components/FilterTemplate"
import TaskListItem from "./TaskListItem"
import useUpdateTaskState from "@/services/hooks/tasks/useUpdateTaskState"
import TaskInfo from "./TaskInfo"
import useGetTask from "@/services/hooks/tasks/useGetTask"
import { AdvancedCondition } from "@/services/interfaces"
import { getSessionInfo } from "@/lib/session"
import { useWebSocket } from "@/context/web-socket"

const TaskGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 10px;
  row-gap: 10px;

  @media (max-width: 1254px) {
    grid-template-columns: 1fr;
  }
`

const radioStyle: React.CSSProperties = {
  width: "100%",
}

const status: Record<string, { color: string; label: string }> = {
  true: { color: "green", label: "Completada" },
  false: { color: "blue", label: "Pendiente" },
}

const statusOptions = Object.keys(status).map((key) => ({
  label: status[key].label,
  value: key,
  style: radioStyle,
}))

const searchOptions = [
  { label: "Nombre", value: "NAME", style: radioStyle },
  { label: "Descripción", value: "DESCRIPTION" },
  {
    label: "Usuario asignado",
    value:
      "'TASKXUSERS__user_username', 'TASKXUSERS__USER_name', 'TASKXUSERS__USER_last_name'",
    style: radioStyle,
  },
  {
    label: "Informador",
    value:
      "'CREATED_BY__username', 'CREATED_BY__name', 'CREATED_BY__last_name'",
    style: radioStyle,
  },
]

const prioritiesOptions = Object.keys(priorities).map((key) => ({
  label: priorities[key].label,
  value: key,
  style: radioStyle,
}))

const TaskList: React.FC = () => {
  const socket = useWebSocket()
  const [form] = Form.useForm()
  const priority = Form.useWatch("PRIORITY", form)
  const searchKeys = Form.useWatch("SEARCH_OPTIONS", form)

  const debouncedValues = useDebounce(status || priority || searchOptions)

  const [showTaskInfo, setShowTaskInfo] = useState(false)
  const [shouldUpdate, setShouldUpdate] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const debounce = useDebounce(searchValue)

  const { tasks, metadata } = useTaskStore()
  const { visible } = useModalStore()

  const { mutate: getTaskList, isIdle } = useGetTaskList()
  const { mutateAsync: updateTaskState } = useUpdateTaskState()
  const { mutateAsync: getTask, isPending: isGetTaskPending } = useGetTask()

  const handleGetTasks = useCallback(
    (page = metadata?.page, size = metadata?.page_size) => {
      if (visible || !page || !size) return
      try {
        const data = form.getFieldsValue()
        const condition: AdvancedCondition[] = [
          {
            condition: "A",
            field: "STATE",
            dataType: "str",
            operator: "=",
          },
        ]

        if (typeof data.COMPLETED === "boolean") {
          condition.push({
            condition: data.COMPLETED,
            field: "COMPLETED",
            dataType: "bool",
            operator: "=",
          })
        }

        if (priority && priority?.length) {
          condition.push({
            condition: priority,
            field: "PRIORITY",
            dataType: "list",
            operator: "IN",
          })
        }

        if (searchKeys && searchKeys?.length && debounce) {
          condition.push({
            condition: debounce,
            field: searchKeys || "NAME",
            dataType: "str",
            operator: "ILIKE",
          })
        } else {
          condition.push({
            condition: debounce,
            field: "NAME",
            dataType: "str",
            operator: "ILIKE",
          })
        }

        getTaskList({ page, size, condition })
      } catch (error) {
        errorHandler(error)
      }
    },
    [debounce, debouncedValues, visible, shouldUpdate]
  )

  useEffect(handleGetTasks, [handleGetTasks])

  const handleUpdateTask = async (task: Task) => {
    try {
      await updateTaskState({
        TASK_ID: task.TASK_ID,
        COMPLETED: !task.COMPLETED,
      })

      const receivers = task.ASSIGNED_USERS.map((user) => user.USERNAME)
      receivers.push(task.CREATED_BY)

      if (socket) {
        socket.send(
          JSON.stringify({
            message: `La tarea #NO.${task.TASK_ID} - ${task.NAME}# ha sido marcada como ${task.COMPLETED ? "No completada" : "completada"} por @${getSessionInfo().USERNAME} `,
            receivers: Array.from(
              new Set(
                receivers.filter((item) => item !== getSessionInfo().USERNAME)
              )
            ),
          })
        )
      }

      setShouldUpdate(!shouldUpdate)
    } catch (error) {
      errorHandler(error)
    }
  }

  const popoverContent = (
    <FilterTemplate form={form} onFilter={() => setShouldUpdate(!shouldUpdate)}>
      <CustomSpace>
        <CustomCol xs={24}>
          <CustomFormItem
            layout="vertical"
            name={"COMPLETED"}
            label={<CustomText strong>Estado</CustomText>}
          >
            <CustomRadioGroup
              options={[
                { label: "Pendientes", value: false },
                { label: "Completadas", value: true },
              ]}
            />
          </CustomFormItem>
        </CustomCol>
        <CustomCol xs={24}>
          <CustomFormItem
            layout="vertical"
            name={"PRIORITY"}
            label={<CustomText strong>Prioridad</CustomText>}
          >
            <CustomCheckboxGroup options={prioritiesOptions} />
          </CustomFormItem>
        </CustomCol>
        <CustomCol xs={24}>
          <CustomFormItem
            layout="vertical"
            name={"SEARCH_OPTIONS"}
            label={<CustomText strong>Opciones de búsqueda</CustomText>}
            labelCol={{ span: 24 }}
          >
            <CustomCheckboxGroup options={searchOptions} />
          </CustomFormItem>
        </CustomCol>
      </CustomSpace>
    </FilterTemplate>
  )

  return (
    <>
      <CustomSpin spinning={isIdle}>
        <CustomRow>
          <CustomCol xs={24}>
            <CustomForm style={{ width: "100%" }} form={form}>
              <CustomRow justify={"space-between"} gap={15}>
                <CustomCol xs={24} sm={12}>
                  <CustomSpace direction="horizontal" size={10}>
                    <CustomTooltip title={"Filtros"} placement={"left"}>
                      <CustomPopover
                        content={popoverContent}
                        title={
                          <CustomDivider>
                            <CustomText strong>Filtros</CustomText>
                          </CustomDivider>
                        }
                      >
                        <CustomButton
                          size={"large"}
                          type={"text"}
                          icon={<FilterOutlined />}
                        />
                      </CustomPopover>
                    </CustomTooltip>
                    <CustomTooltip title={"Generar Reporte"}>
                      <CustomButton
                        size={"large"}
                        icon={<PrinterOutlined />}
                        type={"text"}
                      />
                    </CustomTooltip>
                  </CustomSpace>
                </CustomCol>
                <CustomCol xs={24} lg={12} xl={8}>
                  <CustomSearch
                    placeholder={"Buscar tareas"}
                    onChange={({ target }) => setSearchValue(target.value)}
                  />
                </CustomCol>
              </CustomRow>
            </CustomForm>
          </CustomCol>
          <CustomDivider />

          <CustomCol xs={24}>
            <ConditionalComponent
              condition={!!tasks.length}
              fallback={<NoData />}
            >
              <CustomSpace split={<CustomDivider style={{ margin: 0 }} />}>
                <TaskGrid>
                  {tasks?.map((task) => (
                    <TaskListItem
                      onChange={handleUpdateTask}
                      task={task}
                      onClick={async (task) => {
                        await getTask({
                          condition: {
                            TASK_ID: task.TASK_ID,
                          },
                        })

                        setShowTaskInfo(true)
                      }}
                    />
                  ))}
                </TaskGrid>
                <CustomPagination
                  total={metadata?.total}
                  defaultCurrent={metadata?.page}
                  onChange={handleGetTasks}
                  defaultPageSize={metadata?.page_size}
                />
              </CustomSpace>
            </ConditionalComponent>
          </CustomCol>
        </CustomRow>
      </CustomSpin>

      <ConditionalComponent condition={showTaskInfo}>
        <TaskInfo open={showTaskInfo} onClose={() => setShowTaskInfo(false)} />
      </ConditionalComponent>
    </>
  )
}

export default TaskList

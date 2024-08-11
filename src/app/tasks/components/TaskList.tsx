import ConditionalComponent from "@/components/ConditionalComponent"
import {
  CustomAvatar,
  CustomBadge,
  CustomButton,
  CustomCard,
  CustomCheckboxGroup,
  CustomCol,
  CustomCollapse,
  CustomDescriptions,
  CustomDivider,
  CustomDropdownButton,
  CustomForm,
  CustomFormItem,
  CustomPopover,
  CustomRow,
  CustomSearch,
  CustomSelect,
  CustomSpace,
  CustomSpin,
  CustomTag,
  CustomTooltip,
} from "@/components/custom"
import {
  CustomParagraph,
  CustomText,
} from "@/components/custom/CustomParagraph"
import NoData from "@/components/NoData"
import { priorities } from "@/constants/general"
import errorHandler from "@/helpers/errorHandler"
import formatter from "@/helpers/formatter"
import jsonParse from "@/helpers/jsonParse"
import randomHexColorCode from "@/helpers/random-hex-color-code"
import useDebounce from "@/hooks/useDebounce"
import { Task } from "@/interfaces/task"
import useGetTagList from "@/services/hooks/tasks/useGetTagList"
import useGetTaskList, {
  TaskCondition,
} from "@/services/hooks/tasks/useGetTaskList"
import { AdvancedCondition } from "@/services/interfaces"
import useModalStore from "@/stores/modalStore"
import useTagStore from "@/stores/tagStore"
import useTaskStore from "@/stores/taskStore"
import { formItemLayout } from "@/styles/breakpoints"
import {
  ArrowDownOutlined,
  DownOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons"
import { CollapseProps, DescriptionsProps, Form, MenuProps } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import styled from "styled-components"

const radioStyle: React.CSSProperties = {
  width: "100%",
}

const status: Record<string, { color: string; label: string }> = {
  D: { color: "green", label: "Completada" },
  P: { color: "blue", label: "Pendiente" },
  I: { color: "yellow", label: "En progreso" },
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
      "'ASSIGNED_USER__username', 'ASSIGNED_USER__name', 'ASSIGNED_USER__last_name'",
    style: radioStyle,
  },
  {
    label: "Informador",
    value:
      "'CREATED_BY__username', 'CREATED_BY__name', 'CREATED_BY__last_name'",
    style: radioStyle,
  },
]

const Label = (label: string, icon: React.ReactNode) => (
  <CustomSpace direction="horizontal" size={1}>
    <CustomText>{label}</CustomText>
    {icon}
  </CustomSpace>
)

// const orderOptions = [
//   { label: Label("Nombre", <SortAscendingOutlined />), value: "NAME" },
//   { label: Label("Nombre", <SortDescendingOutlined />), value: "-NAME" },
//   { label: "Fecha de inicio", value: "START_DATE" },
//   { label: "Fecha de fin", value: "END_DATE" },
// ]

const prioritiesOptions = Object.keys(priorities).map((key) => ({
  label: priorities[key].label,
  value: key,
  style: radioStyle,
}))

const Tag = styled(CustomTag)`
  min-width: 80px !important;
`

const PopoverContainer = styled.div`
  width: 300px;
  max-height: 300px;
  overflow-y: auto;
`

const TaskList: React.FC = () => {
  const [form] = Form.useForm()
  const estado = Form.useWatch("STATUS", form)
  const priority = Form.useWatch("PRIORITY", form)
  const searchKeys = Form.useWatch("SEARCH_OPTIONS", form)
  const debouncedValues = useDebounce(status || priority || searchOptions)

  const [filterCount, setFilterCount] = useState(0)
  const [searchValue, setSearchValue] = useState("")
  const debounce = useDebounce(searchValue)

  const { tasks } = useTaskStore()
  const { visible } = useModalStore()

  const { mutate: getTaskList, isPending } = useGetTaskList()

  const handleGetTasks = useCallback(() => {
    if (visible) return
    try {
      const condition: TaskCondition = [
        {
          condition: "A",
          field: "STATE",
          dataType: "str",
          operator: "=",
        },
      ]

      if (estado && estado?.length) {
        condition.push({
          condition: estado,
          field: "STATUS",
          dataType: "list",
          operator: "IN",
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

      getTaskList({ page: 1, size: 10, condition })
    } catch (error) {
      errorHandler(error)
    }
  }, [debounce, debouncedValues, visible])

  useEffect(handleGetTasks, [handleGetTasks])

  useEffect(() => {
    const stateLength = estado?.length || 0
    const priorityLength = priority?.length || 0
    const searchKeysLength = searchKeys?.length || 0
    setFilterCount(stateLength + priorityLength + searchKeysLength)
  }, [estado, priority, searchKeys])

  const menu: MenuProps["items"] = Object.keys(status).map((key) => ({
    label: status[key].label,
    onClick: () => console.log("click"),
    key: key,
  }))

  const descItems = (item: Task): DescriptionsProps["items"] => [
    {
      label: "Informador",
      children: `@${item.CREATED_BY}`,
    },
    {
      label: "Usuario asignado",
      children: `@${item.ASSIGNED_USER}`,
    },
    {
      label: "Creado el",
      children: formatter({ value: item.CREATED_AT, format: "date" }),
    },
    {
      label: "Estado",
      children: (
        <CustomDropdownButton
          buttonsRender={() => [
            <CustomTag
              color={status[item.STATUS].color}
              style={{ marginRight: 0, borderRadius: "4px 0 0 4px" }}
            >
              {status[item.STATUS].label}
            </CustomTag>,
            <CustomButton icon={<DownOutlined />} />,
          ]}
          menu={{ items: menu }}
          icon={<DownOutlined />}
        />
      ),
    },
    {
      label: "Fecha de inicio",
      children: formatter({ value: item.START_DATE, format: "date" }),
    },
    {
      label: "Fecha de fin",
      children: formatter({ value: item.END_DATE, format: "date" }),
    },
    {
      label: "Prioridad",
      children: (
        <CustomTag color={priorities[item?.PRIORITY as string]?.color}>
          {priorities[item.PRIORITY as string]?.label}
        </CustomTag>
      ),
    },
    {
      label: "Etiquetas",
      children: (
        <ConditionalComponent condition={!!item.TAGS.length} fallback={"N/A"}>
          <CustomSpace wrap direction={"horizontal"} size={4}>
            {item.TAGS.map((tag) => (
              <Tag key={tag.TAG_ID} color={tag.COLOR}>
                {tag.NAME}
              </Tag>
            ))}
          </CustomSpace>
        </ConditionalComponent>
      ),
    },
  ]

  const itemContent = (item: Task) => (
    <CustomRow justify={"space-between"} align={"top"}>
      <CustomDivider />
      <CustomCol xs={24}>
        <CustomParagraph style={{ padding: "10px 0" }}>
          <CustomText strong>Descripción</CustomText>
          <br />
          {item.DESCRIPTION}
        </CustomParagraph>
        <CustomCard title={"Detalles"}>
          <CustomCol xs={24}>
            <CustomDescriptions items={descItems(item)} column={3} />
          </CustomCol>
        </CustomCard>
      </CustomCol>
    </CustomRow>
  )

  const extraItem = (item: Task) => (
    <CustomTag color={status[item.STATUS].color}>
      <CustomRow justify={"center"}>{status[item.STATUS].label}</CustomRow>
    </CustomTag>
  )

  const items: CollapseProps["items"] = tasks.map((task) => ({
    label: (
      <CustomSpace direction={"horizontal"}>
        <CustomAvatar
          size={38}
          shadow
          backgroundColor={randomHexColorCode()}
          src={task.AVATAR}
        >
          {task.AVATAR}
        </CustomAvatar>
        <CustomText strong>{task.NAME}</CustomText>
      </CustomSpace>
    ),
    children: itemContent(task),
    extra: extraItem(task),
  }))

  const popoverContent = (
    <PopoverContainer>
      <CustomSpace>
        <CustomCol xs={24}>
          <CustomFormItem
            layout="vertical"
            name={"STATUS"}
            label={<CustomText strong>Estado</CustomText>}
          >
            <CustomCheckboxGroup options={statusOptions} />
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
    </PopoverContainer>
  )

  return (
    <CustomSpin spinning={isPending}>
      <CustomRow>
        <CustomCol xs={24}>
          <CustomForm style={{ width: "100%" }} form={form}>
            <CustomRow justify={"space-between"} gap={15}>
              <CustomCol xs={24} sm={12}>
                <CustomSpace direction="horizontal" size={10}>
                  <CustomFormItem>
                    <CustomTooltip title={"Filtros"} placement={"left"}>
                      <CustomPopover
                        content={popoverContent}
                        title={
                          <CustomDivider>
                            <CustomText strong>Filtros</CustomText>
                          </CustomDivider>
                        }
                      >
                        <CustomBadge overflowCount={9} count={filterCount}>
                          <CustomButton
                            size={"large"}
                            type={"text"}
                            icon={<FilterOutlined />}
                          />
                        </CustomBadge>
                      </CustomPopover>
                    </CustomTooltip>
                  </CustomFormItem>
                  <ConditionalComponent condition={false}>
                    <CustomFormItem label={"Ordenar Por"}>
                      <CustomSelect />
                    </CustomFormItem>
                  </ConditionalComponent>
                </CustomSpace>
              </CustomCol>
              <CustomCol xs={24} sm={18} md={16} lg={12} xl={8}>
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
            <CustomCollapse accordion size={"large"} items={items} />
          </ConditionalComponent>
        </CustomCol>
      </CustomRow>
    </CustomSpin>
  )
}

export default TaskList

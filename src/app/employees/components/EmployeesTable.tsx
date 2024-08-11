import {
  CustomAvatar,
  CustomButton,
  CustomCol,
  CustomDivider,
  CustomForm,
  CustomFormItem,
  CustomPopover,
  CustomRow,
  CustomSearch,
  CustomSelect,
  CustomSpace,
  CustomTable,
  CustomTag,
  CustomTooltip,
} from "@/components/custom"
import formatter from "@/helpers/formatter"
import { Roles, User } from "@/interfaces/user"
import {
  DownOutlined,
  EditOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons"
import { ColumnType, TablePaginationConfig } from "antd/lib/table"
import React, { useContext, useEffect, useRef, useState } from "react"
import styled from "styled-components"
import EmployeeForm from "./EmployeeForm"
import { Metadata } from "@/services/interfaces"
import randomHexColorCode from "@/helpers/random-hex-color-code"
import useMenuOptionStore from "@/stores/useMenuOptionStore"
import { EmployeesParameters } from "@/interfaces/parameters"
import ConditionalComponent from "@/components/ConditionalComponent"
import useIsAuthorized from "@/hooks/useIsAuthorized"
import EditableRow, { EditableContext } from "@/components/EditableRow"
import { Form, InputRef, TableProps } from "antd"
import { CustomColumnType } from "@/interfaces/general"
import useRolesStore from "@/stores/rolesStore"
import { useChangeUserState } from "@/services/hooks/user/useChangeUserState"
import errorHandler from "@/helpers/errorHandler"
import useModalStore from "@/stores/modalStore"
import useGetUser from "@/services/hooks/user/useGetUser"
import { states } from "@/constants/general"
import EmployeeProfile from "./EmployeeProfile"
import useDrawerStore from "@/stores/drawerStore"

const Tag = styled(CustomTag)`
  min-width: 70px;
  text-align: center !important;
`

interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  dataIndex: keyof User
  record: User
  options: { label: string; value: string }[]
  handleSave: (record: User) => void
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  options,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<InputRef>(null)
  const form = useContext(EditableContext)!

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()

      if (record[dataIndex] === values[dataIndex]) {
        toggleEdit()
        return
      }

      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      errorHandler(errInfo)
    }
  }

  return (
    <td {...restProps}>
      <ConditionalComponent condition={editable} fallback={children}>
        <ConditionalComponent
          trigger={"onBlur"}
          onBlur={save}
          condition={editing}
          fallback={
            <div
              className="editable-cell-value-wrap"
              style={{ paddingInlineEnd: 24 }}
              onClick={toggleEdit}
            >
              {children}
            </div>
          }
        >
          <CustomFormItem
            style={{ margin: 0 }}
            name={dataIndex}
            rules={[{ required: true, message: `${title} is required.` }]}
          >
            <CustomSelect options={options} onSelect={save} onBlur={save} />
          </CustomFormItem>
        </ConditionalComponent>
      </ConditionalComponent>
    </td>
  )
}

interface EmployeeTableProps {
  dataSource: User[]
  loading?: boolean
  metadata: Metadata
  onChange?: (pagination: TablePaginationConfig) => void
  onSearch: (value: string) => void
}

const EmployeesTable: React.FC<EmployeeTableProps> = ({
  dataSource,
  loading,
  metadata,
  onChange,
  onSearch,
}) => {
  const [form] = Form.useForm()
  const { setOpenDrawer, open } = useDrawerStore()
  const { setVisible } = useModalStore()
  const { parameters } = useMenuOptionStore<EmployeesParameters>()
  const { roles } = useRolesStore()
  const { mutateAsync: getUser, isPending: getUserIsPending } = useGetUser()
  const { mutateAsync: changeUserState, isPending } = useChangeUserState()

  const currencyFormatter = (value = 0) => {
    return formatter({ value, format: "currency", prefix: "RD$", fix: 2 })
  }

  const allowEdit = useIsAuthorized(
    Number(parameters?.ID_OPERACION_EDITAR_EMPLEADOS)
  )
  const allowChangeState = useIsAuthorized(
    Number(parameters?.ID_OPERACION_CAMBIAR_ESTADO_EMPLEADOS)
  )

  const handleSave = async (record: User) => {
    try {
      await changeUserState({
        USER_ID: record.USER_ID,
        STATE: record.STATE,
      })

      onChange?.(metadata)
    } catch (error) {
      errorHandler(error)
    }
  }

  const popoverContent = (
    <CustomSpace direction={"vertical"} size={5}>
      <CustomButton type={"primary"} icon={<PlusOutlined />} block>
        Agregar Empleado
      </CustomButton>
      <CustomButton type={"default"} block>
        Importar Empleados
      </CustomButton>
    </CustomSpace>
  )

  const columns: CustomColumnType<User>[] = [
    {
      dataIndex: "AVATAR",
      key: "AVATAR",
      width: "5%",
      render: (value: string) => (
        <CustomAvatar
          style={{
            backgroundColor:
              value.length === 2 ? randomHexColorCode() : undefined,
          }}
          src={value}
          size={"large"}
          shape={"circle"}
        >
          {value}
        </CustomAvatar>
      ),
    },
    {
      title: "Nombre",
      dataIndex: "NAME",
      key: "NAME",
      render: (_, record: User) => (
        <CustomButton
          type={"link"}
          onClick={async () => {
            await getUser({ condition: { USER_ID: record.USER_ID } })
            setOpenDrawer(true)
          }}
        >
          {record.NAME} {record.LAST_NAME}
        </CustomButton>
      ),
    },
    {
      title: "Correo",
      dataIndex: "EMAIL",
      key: "EMAIL",
    },
    {
      title: "Salario Bruto",
      dataIndex: "GROSS_SALARY",
      key: "GROSS_SALARY",
      render: currencyFormatter,
    },
    {
      title: "Impuestos",
      dataIndex: "TAX",
      key: "TAX",
      render: currencyFormatter,
    },
    {
      title: "Salario Neto",
      dataIndex: "NET_SALARY",
      key: "NET_SALARY",
      render: currencyFormatter,
    },
    {
      title: "Rol",
      dataIndex: "ROLES",
      key: "ROLES",
      width: "8%",
      render: (roles: Roles[]) => (
        <CustomSpace size={1} wrap={false} direction="horizontal">
          {roles.map((role) => (
            <CustomTag color={role.COLOR} key={role.ROL_ID}>
              {role.NAME}
            </CustomTag>
          ))}
        </CustomSpace>
      ),
    },
    {
      title: "Estado",
      dataIndex: "STATE",
      key: "STATE",
      editable: allowChangeState,
      options: Object.keys(states).map((key) => ({
        label: states[key].label,
        value: key,
      })),
      render: (value: string) => (
        <CustomSpace wrap={false} direction="horizontal" size={1}>
          <Tag color={states[value].color}>{states[value].label}</Tag>

          <DownOutlined style={{ color: "#bfbfbf", fontSize: 10 }} />
        </CustomSpace>
      ),
    },
    {
      title: "Acciones",
      key: "ACTIONS",
      width: "5%",
      align: "center",
      fixed: true,
      render: (_, record) => (
        <CustomSpace
          direction="horizontal"
          size={1}
          split={<CustomDivider type={"vertical"} />}
        >
          <ConditionalComponent condition={allowEdit} visible>
            <CustomTooltip title={"Editar"}>
              <CustomButton
                size={"large"}
                type="link"
                icon={<EditOutlined />}
                onClick={async () => {
                  await getUser({
                    condition: {
                      USER_ID: record.USER_ID,
                    },
                  })
                  setVisible(true)
                }}
              />
            </CustomTooltip>
          </ConditionalComponent>
        </CustomSpace>
      ),
    },
  ]

  const mergedColumns = columns.map((col: any) => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: (record: User) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        options: col.options,
        handleSave: handleSave,
      }),
    }
  }) as ColumnType<User>[]

  const component: TableProps<User>["components"] = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  return (
    <>
      <CustomCol xs={24}>
        <CustomRow justify={"space-between"} gap={15}>
          <CustomTooltip title={"Filtros"} placement={"left"}>
            <CustomPopover
              title={"Filtros"}
              content={popoverContent}
              trigger={"click"}
            >
              <CustomButton
                size={"large"}
                type={"text"}
                icon={<FilterOutlined />}
              />
            </CustomPopover>
          </CustomTooltip>
          <CustomCol xs={24} sm={18} md={16} lg={12} xl={8}>
            <CustomSearch
              onChange={({ target }) => onSearch(target.value)}
              onSearch={onSearch}
              placeholder={"Buscar empleados"}
            />
          </CustomCol>
          <CustomCol xs={24}>
            <CustomForm form={form} component={false}>
              <CustomTable
                loading={loading || isPending}
                dataSource={dataSource}
                columns={mergedColumns}
                components={component}
                onChange={onChange}
                pagination={{
                  pageSize: metadata?.page_size,
                  total: metadata?.total,
                  current: metadata?.page,
                  showSizeChanger: true,
                }}
              />
            </CustomForm>
          </CustomCol>
        </CustomRow>
      </CustomCol>

      <EmployeeForm loading={getUserIsPending} />
      <ConditionalComponent condition={open}>
        <EmployeeProfile />
      </ConditionalComponent>
    </>
  )
}

export default EmployeesTable

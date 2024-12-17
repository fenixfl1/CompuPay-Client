import {
  CustomAvatar,
  CustomBadge,
  CustomButton,
  CustomCheckboxGroup,
  CustomCol,
  CustomDivider,
  CustomForm,
  CustomFormItem,
  CustomInputNumber,
  CustomMenu,
  CustomPopover,
  CustomRangePicker,
  CustomRow,
  CustomSearch,
  CustomSelect,
  CustomSpace,
  CustomTable,
  CustomTag,
  CustomText,
  CustomTooltip,
} from "@/components/custom"
import formatter from "@/helpers/formatter"
import { Roles, User } from "@/interfaces/user"
import {
  DownOutlined,
  EditOutlined,
  EllipsisOutlined,
  FilterOutlined,
  PrinterOutlined,
} from "@ant-design/icons"
import { ColumnType, TablePaginationConfig } from "antd/lib/table"
import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
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
import { CustomColumnType, Options } from "@/interfaces/general"
import useRolesStore from "@/stores/rolesStore"
import { useChangeUserState } from "@/services/hooks/user/useChangeUserState"
import errorHandler from "@/helpers/errorHandler"
import useModalStore from "@/stores/modalStore"
import useGetUser from "@/services/hooks/user/useGetUser"
import { states } from "@/constants/general"
import EmployeeProfile from "./EmployeeProfile"
import useDrawerStore from "@/stores/drawerStore"
import dayjs from "dayjs"
import { FormInstance } from "antd/lib"
import { PopoverContainer } from "@/components/custom/CustomPopover"
import FilterTemplate from "@/components/FilterTemplate"
import useUserStore from "@/stores/userStore"
import useGetDepartmentList from "@/services/hooks/user/useGetDepartmentList"
import jsonParse from "@/helpers/jsonParse"

const Tag = styled(CustomTag)`
  min-width: 70px;
  text-align: center !important;
`

const optionStyles: React.CSSProperties = {
  width: "100%",
}

const searchOptions = [
  {
    label: "Código",
    value: "USER_ID",
    style: optionStyles,
  },
  {
    label: "Nombre",
    value: "NAME",
    style: optionStyles,
  },
  {
    label: "Apellido",
    value: "LAST_NAME",
    style: optionStyles,
  },
  {
    label: "Cédula",
    value: "IDENTITY_DOCUMENT",
    style: optionStyles,
  },
  {
    label: "Usuario",
    value: "USERNAME",
    style: optionStyles,
  },
  {
    label: "Correo",
    value: "EMAIL",
    style: optionStyles,
  },
  {
    label: "Rol",
    value: "roles__name",
    style: optionStyles,
  },
]

interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  dataIndex: keyof User
  record: User
  options: { label: string; value: string }[]
  onSave: (record: User) => void
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  options,
  onSave,
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
      const values = form.getFieldsValue()

      if (record?.[dataIndex] !== values?.[dataIndex]) {
        onSave({ ...record, ...values })
      }
      toggleEdit()
    } catch (error) {
      errorHandler(error)
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
            <CustomSelect
              onKeyDown={({ code }) => {
                if (code === "Escape") toggleEdit()
              }}
              options={options}
              onSelect={save}
              onBlur={save}
              autoFocus
            />
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
  onFilter?: () => void
  onPrint?: () => void
  form: FormInstance
  showFilter?: boolean
}

const EmployeesTable: React.FC<EmployeeTableProps> = ({
  dataSource,
  loading,
  metadata,
  onChange,
  onSearch,
  onFilter,
  onPrint,
  showFilter = true,
  form,
}) => {
  const formValues = Form.useWatch([], form)

  const [filterCount, setFilterCount] = useState(0)

  const { setOpenDrawer, open } = useDrawerStore()
  const { setVisible, visible } = useModalStore()
  const { parameters } = useMenuOptionStore<EmployeesParameters>()
  const { roles } = useRolesStore()
  const { setUser, setDocumentAvailable, setUsernameAvailable } = useUserStore()

  const { mutateAsync: getUser, isPending: getUserIsPending } = useGetUser()
  const { mutateAsync: changeUserState, isPending } = useChangeUserState()
  const { mutate: getDepartments, data: departments } = useGetDepartmentList()

  const {
    ID_OPERACION_EDITAR_EMPLEADOS,
    ID_OPERACION_CAMBIAR_ESTADO_EMPLEADOS,
    LIST_ESTADOS_EMPLEADOS,
  } = parameters

  const allowEdit = useIsAuthorized(Number(ID_OPERACION_EDITAR_EMPLEADOS))
  const allowChangeState = useIsAuthorized(
    Number(ID_OPERACION_CAMBIAR_ESTADO_EMPLEADOS)
  )

  const statOptions = useMemo(() => {
    if (!LIST_ESTADOS_EMPLEADOS) return []

    const arr = jsonParse<Options[]>(LIST_ESTADOS_EMPLEADOS)

    return arr.map((item) => ({ ...item, style: optionStyles }))
  }, [LIST_ESTADOS_EMPLEADOS])

  useEffect(() => {
    if (!visible) {
      setUser({} as User)
      setDocumentAvailable(false)
      setUsernameAvailable(false)
    }
  }, [visible])

  useEffect(() => {
    getDepartments({
      fields: ["DEPARTMENT_ID", "NAME"],
      condition: {
        STATE: "A",
      },
    })
  }, [])

  useEffect(() => {
    setFilterCount(
      Object.keys(formValues ?? {}).filter((key) => formValues[key]).length
    )
  }, [formValues])

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
    <FilterTemplate form={form} onFilter={onFilter}>
      <CustomSpace>
        <CustomCol xs={24}>
          <CustomFormItem
            layout="vertical"
            name={"STATUS"}
            label={<CustomText strong>Estado</CustomText>}
          >
            <CustomCheckboxGroup options={statOptions} />
          </CustomFormItem>
        </CustomCol>
        <CustomCol xs={24}>
          <CustomFormItem
            layout="vertical"
            label={<CustomText strong>Rango salarial</CustomText>}
          >
            <CustomSpace direction="horizontal">
              <CustomFormItem name={"MIN_SALARY"} noStyle initialValue={0}>
                <CustomInputNumber
                  format={{ format: "currency", currency: "RD" }}
                  placeholder={"Mínimo"}
                  width={100}
                />
              </CustomFormItem>
              <CustomFormItem name={"MAX_SALARY"} noStyle>
                <CustomInputNumber
                  format={{ format: "currency", currency: "RD" }}
                  placeholder={"Máximo"}
                  width={100}
                />
              </CustomFormItem>
            </CustomSpace>
          </CustomFormItem>
        </CustomCol>
        <CustomCol xs={24}>
          <CustomFormItem
            label={<CustomText strong>Rango Fecha de contratación</CustomText>}
            layout="vertical"
            name={"RANGE_DATE"}
            labelCol={{ span: 24 }}
          >
            <CustomRangePicker
              maxDate={dayjs()}
              placeholder={["Fecha Inicial", "Fecha Final"]}
            />
          </CustomFormItem>
        </CustomCol>
        <CustomCol xs={24}>
          <CustomFormItem
            layout="vertical"
            label={<CustomText strong>Roles</CustomText>}
            name={"ROLES"}
          >
            <CustomSelect
              mode={"multiple"}
              placeholder={"Seleccionar roles"}
              options={roles.map((rol) => ({
                label: rol.NAME,
                value: rol.ROL_ID,
              }))}
            />
          </CustomFormItem>
        </CustomCol>
        <CustomCol xs={24}>
          <CustomFormItem
            layout="vertical"
            label={<CustomText strong>Departamentos</CustomText>}
            name={"DEPARTMENTS"}
            labelCol={{ span: 24 }}
          >
            <CustomSelect
              mode={"multiple"}
              placeholder={"Seleccionar departamentos"}
              options={departments.map((department) => ({
                label: department.NAME,
                value: department.DEPARTMENT_ID,
              }))}
            />
          </CustomFormItem>
        </CustomCol>
        <CustomCol xs={24}>
          <CustomFormItem
            layout="vertical"
            name={"SEARCH_OPTIONS"}
            label={<CustomText strong>Buscar por</CustomText>}
            labelCol={{ span: 24 }}
            initialValue={["NAME", "LAST_NAME", "USER_ID"]}
          >
            <CustomSelect
              placeholder={"Seleccionar opciones"}
              options={searchOptions}
              mode={"multiple"}
            />
          </CustomFormItem>
        </CustomCol>
      </CustomSpace>
    </FilterTemplate>
  )

  const columns: CustomColumnType<User>[] = [
    {
      key: "USER_ID",
      dataIndex: "USER_ID",
      responsive: ["xl"],
    },
    {
      dataIndex: "AVATAR",
      key: "AVATAR",
      width: "3%",
      align: "center",
      responsive: ["xl"],
      render: (value: string) => (
        <CustomAvatar
          style={{
            backgroundColor:
              value?.length === 2 ? randomHexColorCode() : undefined,
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
      responsive: ["xl"],
      render: (_, record) => (
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
      title: "Nombre de Usuario",
      dataIndex: "USERNAME",
      key: "USERNAME",
      render: (value) => `@${value}`,
      responsive: ["xl"],
    },
    {
      title: "Genero",
      dataIndex: "DESC_GENDER",
      key: "DESC_GENDER",
      responsive: ["xl"],
    },
    {
      title: "Correo",
      dataIndex: "EMAIL",
      key: "EMAIL",
      responsive: ["xl"],
    },
    {
      title: "Supervisor",
      dataIndex: "NAME_SUPERVISOR",
      key: "NAME_SUPERVISOR",
      responsive: ["xl"],
      render: (value) => value ?? "N/A",
    },
    {
      key: "DESC_DEPARTMENT",
      dataIndex: "DESC_DEPARTMENT",
      title: "Departamento",
      responsive: ["xl"],
    },
    {
      title: "Rol",
      dataIndex: "ROLES",
      key: "ROLES",
      responsive: ["xl"],
      width: "8%",
      render: (roles: Roles[]) => (
        <CustomSpace size={1} wrap={false} direction="horizontal">
          {roles?.map((role) => (
            <CustomTag
              color={role.COLOR}
              key={role.ROL_ID}
              style={{ minWidth: "70px", textAlign: "center" }}
            >
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
      responsive: ["xl"],
      editable: allowChangeState,
      options: Object.keys(states).map((key) => ({
        label: states[key].label,
        value: key,
      })),
      render: (value: string) => (
        <CustomSpace wrap={false} direction="horizontal" size={1}>
          <Tag color={states[value]?.color}>{states[value]?.label}</Tag>
          <ConditionalComponent condition={allowChangeState}>
            <DownOutlined style={{ color: "#bfbfbf", fontSize: 10 }} />
          </ConditionalComponent>
        </CustomSpace>
      ),
    },
    {
      title: "Acciones",
      key: "ACTIONS",
      width: "5%",
      align: "center",
      fixed: true,
      hidden: !allowEdit,
      render: (_, record) => (
        <CustomSpace
          direction="horizontal"
          size={1}
          split={<CustomDivider type={"vertical"} />}
        >
          <ConditionalComponent
            condition={allowEdit}
            visible
            onClick={async () => {
              await getUser({
                condition: {
                  USER_ID: record.USER_ID,
                },
              })
              setVisible(true)
            }}
          >
            <CustomTooltip title={"Editar"}>
              <CustomButton
                size={"large"}
                type="link"
                icon={<EditOutlined />}
              />
            </CustomTooltip>
          </ConditionalComponent>

          <CustomTooltip title={"Más opciones"}>
            <ConditionalComponent condition={allowEdit && false}>
              <CustomPopover
                showArrow
                placement={"right"}
                content={
                  <CustomButton block type={"text"} target={"click"}>
                    Finalizar Contrato
                  </CustomButton>
                }
              >
                <CustomButton type={"text"} icon={<EllipsisOutlined />} />
              </CustomPopover>
            </ConditionalComponent>
          </CustomTooltip>
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
        onSave: handleSave,
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
        <CustomForm form={form} component={false}>
          <CustomRow justify={"space-between"} gap={15}>
            <CustomCol xs={4} sm={6} lg={12} xl={8}>
              <CustomRow justify={"start"} gap={20}>
                <ConditionalComponent condition={showFilter}>
                  <CustomTooltip title={"Filtros"} placement={"left"}>
                    <CustomPopover
                      title={"Filtros"}
                      content={popoverContent}
                      trigger={"click"}
                    >
                      <CustomBadge count={filterCount}>
                        <CustomButton
                          size={"large"}
                          type={"text"}
                          icon={<FilterOutlined />}
                        />
                      </CustomBadge>
                    </CustomPopover>
                  </CustomTooltip>
                </ConditionalComponent>

                <CustomTooltip title={"Generar Reporte"}>
                  <CustomButton
                    size={"large"}
                    icon={<PrinterOutlined />}
                    type={"text"}
                    onClick={onPrint}
                  />
                </CustomTooltip>
              </CustomRow>
            </CustomCol>
            <CustomCol xs={24} sm={18} md={16} lg={12} xl={8}>
              <CustomFormItem noStyle name={"SEARCH"}>
                <CustomSearch
                  onChange={({ target }) => onSearch(target.value)}
                  onSearch={onSearch}
                  placeholder={"Buscar empleados"}
                />
              </CustomFormItem>
            </CustomCol>
            <CustomCol xs={24}>
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
            </CustomCol>
          </CustomRow>
        </CustomForm>
      </CustomCol>

      <ConditionalComponent condition={visible}>
        <EmployeeForm loading={getUserIsPending} />
      </ConditionalComponent>
      <ConditionalComponent condition={open}>
        <EmployeeProfile />
      </ConditionalComponent>
    </>
  )
}

export default EmployeesTable

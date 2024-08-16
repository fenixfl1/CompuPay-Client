"use client"

import {
  CustomCol,
  CustomCollapse,
  CustomRow,
  CustomSpin,
  CustomText,
} from "@/components/custom"
import { NextPage } from "next"
import React, { useCallback, useEffect, useState } from "react"
import { CollapseProps, Form } from "antd"
import { useGetUserLIst } from "@/services/hooks/user/useGetUserList"
import useMenuOptionStore from "@/stores/useMenuOptionStore"
import useDebounce from "@/hooks/useDebounce"
import useModalStore from "@/stores/modalStore"
import { EmployeesParameters } from "@/interfaces/parameters"
import useGetRolesList from "@/services/hooks/user/useGetRolesList"
import { getSessionInfo } from "@/lib/session"
import { AdvancedCondition } from "@/services/interfaces"
import useUserStore from "@/stores/userStore"

const EmployeesTable = React.lazy(
  () => import("@/app/employees/components/EmployeesTable")
)

const page: NextPage = () => {
  const [form] = Form.useForm()
  const [searchEmployee, setSearchEmployee] = useState("")
  const [searchNoEmployee, setSearchNoEmployee] = useState("")
  const debounceEmployeeSearch = useDebounce(searchEmployee)
  const debounceNoEmployeeSearch = useDebounce(searchNoEmployee)

  const { visible } = useModalStore()
  const { parameters } = useMenuOptionStore<EmployeesParameters>()
  const { setUsers, users } = useUserStore()
  const {
    mutateAsync: getUserList,
    isPending: isEmployeesPending,
    data: employeesData,
  } = useGetUserLIst()
  const {
    mutate: getNoEmployees,
    isPending: isNoEmployeesPending,
    data: { data: noEmployees, metadata: noEmployeesMetadata },
  } = useGetUserLIst()
  const { mutateAsync: getRolesList, isPending } = useGetRolesList()

  const { metadata: employeesMetadata } = employeesData

  useEffect(() => {
    getRolesList({
      page: 1,
      size: 1000,
      condition: [
        {
          condition: "A",
          dataType: "str",
          field: "STATE",
          operator: "=",
        },
      ],
    })
  }, [])

  const handleGetEmployees = useCallback(
    (page = employeesMetadata?.page, size = employeesMetadata?.page_size) => {
      if (!parameters?.ID_ROLES_EMPLEADOS) return
      const values = form.getFieldsValue()
      const condition: AdvancedCondition[] = [
        {
          condition: values.STATUS || false,
          dataType: values.STATUS ? "list" : "bool",
          field: "STATE",
          operator: values.STATUS ? "IN" : "IS NULL",
        },
        {
          condition: parameters?.ID_ROLES_EMPLEADOS?.split(","),
          dataType: "str",
          field: "roles__rol_id",
          operator: "IN",
        },
        {
          condition: getSessionInfo().USERNAME,
          dataType: "str",
          field: "username",
          operator: "!=",
        },
      ]

      if (values.STATUS) {
        condition.push({
          dataType: "list",
          field: "STATE",
          operator: "IN",
          condition: values.STATUS,
        })
      }

      if (values.MAX_SALARY) {
        condition.push({
          dataType: "list",
          field: "SALARY",
          operator: "BETWEEN",
          condition: [values.MIN_SALARY, values.MAX_SALARY],
        })
      }

      if (values.SEARCH_OPTIONS || debounceEmployeeSearch) {
        condition.push({
          dataType: "str",
          field: values.SEARCH_OPTIONS ?? ["name", "username"],
          operator: "ILIKE",
          condition: debounceEmployeeSearch,
        })
      }

      if (values.RANGE_DATE?.length) {
        condition.push({
          dataType: "list",
          field: "CREATED_AT",
          operator: "BETWEEN",
          condition: [
            values.RANGE_DATE[0].format("YYYY-MM-DD"),
            values.RANGE_DATE[1].format("YYYY-MM-DD"),
          ],
        })
      }

      if (values.ROLES) {
        condition.push({
          dataType: "list",
          field: "rolesusers__rol_id",
          operator: "IN",
          condition: values.ROLES,
        })
      }

      getUserList({ page, size, condition }).then(({ data }) => setUsers(data))
    },
    [parameters, visible, debounceEmployeeSearch, form]
  )

  useEffect(handleGetEmployees, [handleGetEmployees])

  const handleGetNoEmployees = useCallback(
    (
      page = noEmployeesMetadata?.page,
      size = noEmployeesMetadata?.page_size
    ) => {
      if (!parameters?.ID_ROLES_NO_EMPLEADOS) return
      getNoEmployees({
        page,
        size,
        condition: [
          {
            condition: ["A", "P", "E", "J"],
            dataType: "list",
            field: "STATE",
            operator: "IN",
          },
          {
            condition: parameters?.ID_ROLES_NO_EMPLEADOS?.split(","),
            dataType: "str",
            field: "roles__rol_id",
            operator: "IN",
          },
          {
            condition: debounceNoEmployeeSearch,
            dataType: "str",
            field: "name",
            operator: "ILIKE",
          },
        ],
      })
    },
    [parameters, debounceNoEmployeeSearch, visible]
  )

  useEffect(handleGetNoEmployees, [handleGetNoEmployees])

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: <CustomText strong>Empleados en Nómina</CustomText>,
      children: (
        <EmployeesTable
          form={form}
          onSearch={setSearchEmployee}
          metadata={employeesMetadata}
          loading={isEmployeesPending}
          dataSource={users}
          onChange={({ current, pageSize }) =>
            handleGetEmployees(current, pageSize)
          }
        />
      ),
    },
    {
      key: "2",
      label: <CustomText strong>Postulantes a Empleados</CustomText>,
      collapsible: "disabled",
      children: (
        <EmployeesTable
          onSearch={setSearchNoEmployee}
          metadata={noEmployeesMetadata}
          loading={isNoEmployeesPending}
          dataSource={noEmployees}
          showFilter={false}
          onChange={({ current, pageSize }) =>
            handleGetNoEmployees(current, pageSize)
          }
        />
      ),
    },
  ]

  return (
    <CustomSpin spinning={isPending}>
      <CustomRow width={"100%"}>
        <CustomCol xs={24}>
          <CustomCollapse defaultActiveKey={["1"]} items={items} />
        </CustomCol>
      </CustomRow>
    </CustomSpin>
  )
}

export default page

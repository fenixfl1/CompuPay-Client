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
  const [shouldUpdate, setShouldUpdate] = useState<boolean>()
  const [searchValue, setSearchValue] = useState("")
  const debounce = useDebounce(searchValue)

  const { visible } = useModalStore()
  const { parameters } = useMenuOptionStore<EmployeesParameters>()
  const { setUsers, users, metadata } = useUserStore()

  const { mutateAsync: getRolesList, isPending } = useGetRolesList()
  const { mutateAsync: getUserList, isPending: isEmployeesPending } =
    useGetUserLIst()

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
    (page = metadata?.page, size = metadata?.page_size) => {
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

      if (values.SEARCH_OPTIONS || debounce) {
        condition.push({
          dataType: "str",
          field: values.SEARCH_OPTIONS ?? ["name", "last_name"],
          operator: "ILIKE",
          condition: debounce,
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
        condition.push(
          {
            dataType: "list",
            field: "rolesusers__rol_id",
            operator: "IN",
            condition: values.ROLES,
          },
          {
            dataType: "str",
            field: "rolesusers__state",
            operator: "=",
            condition: "A",
          }
        )
      }

      getUserList({ page, size, condition }).then(({ data }) => setUsers(data))
    },
    [parameters, debounce, shouldUpdate]
  )

  useEffect(handleGetEmployees, [handleGetEmployees])

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: <CustomText strong>Lista de usuarios registrados</CustomText>,
      collapsible: "disabled",
      children: (
        <EmployeesTable
          form={form}
          onSearch={setSearchValue}
          onFilter={() => setShouldUpdate(!shouldUpdate)}
          metadata={metadata}
          loading={isEmployeesPending}
          dataSource={users}
          onChange={({ current, pageSize }) =>
            handleGetEmployees(current, pageSize)
          }
        />
      ),
    },
  ]

  return (
    <CustomSpin spinning={isPending}>
      <CustomRow width={"100%"}>
        <CustomCol xs={24}>
          <CustomCollapse defaultActiveKey={["1", "2"]} items={items} />
        </CustomCol>
      </CustomRow>
    </CustomSpin>
  )
}

export default page

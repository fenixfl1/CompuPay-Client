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
import EmployeesTable from "./components/EmployeesTable"
import { CollapseProps } from "antd"
import { useGetUserLIst } from "@/services/hooks/user/useGetUserList"
import useMenuOptionStore from "@/stores/useMenuOptionStore"
import useDebounce from "@/hooks/useDebounce"
import useModalStore from "@/stores/modalStore"
import { EmployeesParameters } from "@/interfaces/parameters"
import useGetRolesList from "@/services/hooks/user/useGetRolesList"
import { getSessionInfo } from "@/lib/session"

const page: NextPage = () => {
  const [searchEmployee, setSearchEmployee] = useState("")
  const [searchNoEmployee, setSearchNoEmployee] = useState("")
  const debounceEmployeeSearch = useDebounce(searchEmployee)
  const debounceNoEmployeeSearch = useDebounce(searchNoEmployee)

  const { visible } = useModalStore()
  const { parameters } = useMenuOptionStore<EmployeesParameters>()
  const {
    mutate: getUserList,
    isPending: isEmployeesPending,
    data: employeesData,
  } = useGetUserLIst()
  const {
    mutate: getNoEmployees,
    isPending: isNoEmployeesPending,
    data: { data: noEmployees, metadata: noEmployeesMetadata },
  } = useGetUserLIst()
  const { mutateAsync: getRolesList, isPending } = useGetRolesList()

  const { data: employees, metadata: employeesMetadata } = employeesData

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
      getUserList({
        page,
        size,
        condition: [
          {
            condition: false,
            dataType: "bool",
            field: "STATE",
            operator: "IS NULL",
          },
          {
            condition: parameters?.ID_ROLES_EMPLEADOS?.split(","),
            dataType: "str",
            field: "roles__rol_id",
            operator: "IN",
          },
          {
            condition: debounceEmployeeSearch,
            dataType: "str",
            field: "name",
            operator: "ILIKE",
          },
          {
            condition: getSessionInfo().USERNAME,
            dataType: "str",
            field: "username",
            operator: "!=",
          },
        ],
      })
    },
    [parameters, debounceEmployeeSearch, visible]
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
          onSearch={setSearchEmployee}
          metadata={employeesMetadata}
          loading={isEmployeesPending}
          dataSource={employees}
          onChange={({ current, pageSize }) =>
            handleGetEmployees(current, pageSize)
          }
        />
      ),
    },
    {
      key: "2",
      label: <CustomText strong>Postulantes a Empleados</CustomText>,
      children: (
        <EmployeesTable
          onSearch={setSearchNoEmployee}
          metadata={noEmployeesMetadata}
          loading={isNoEmployeesPending}
          dataSource={noEmployees}
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
          <CustomCollapse defaultActiveKey={["1", "2"]} items={items} />
        </CustomCol>
      </CustomRow>
    </CustomSpin>
  )
}

export default page

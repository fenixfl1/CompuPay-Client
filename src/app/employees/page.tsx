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
import errorHandler from "@/helpers/errorHandler"
import useGenerateReport from "@/services/hooks/reports/useGenerateReport"
import { WEB_API_GET_USER_REPORT } from "@/constants/routes"
import PDFRender from "@/components/PDFRender"
import ConditionalComponent from "@/components/ConditionalComponent"
import { openReport } from "@/helpers/open-report"

const EmployeesTable = React.lazy(
  () => import("@/app/employees/components/EmployeesTable")
)

const page: NextPage = () => {
  const [form] = Form.useForm()
  const [condition, setCondition] = useState<AdvancedCondition[]>([])
  const [shouldUpdate, setShouldUpdate] = useState<boolean>()
  const [searchValue, setSearchValue] = useState("")
  const debounce = useDebounce(searchValue)

  const { visible } = useModalStore()
  const { parameters } = useMenuOptionStore<EmployeesParameters>()
  const { users, metadata } = useUserStore()

  const { mutateAsync: generateReport, isPending: isGenerateReportPending } =
    useGenerateReport(WEB_API_GET_USER_REPORT)
  const { mutateAsync: getRolesList, isPending } = useGetRolesList()
  const { mutateAsync: getUserList, isPending: isEmployeesPending } =
    useGetUserLIst()

  const { USER_REPORT_COLUMNS_WIDTH, USER_REPORT_COLUMNS } = parameters

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

      if (values.DEPARTMENTS) {
        condition.push({
          dataType: "list",
          field: "department__department_id",
          operator: "IN",
          condition: values.DEPARTMENTS,
        })
      }

      setCondition(condition)

      getUserList({ page, size, condition })
    },
    [parameters, debounce, shouldUpdate]
  )

  useEffect(handleGetEmployees, [handleGetEmployees])

  const handleGenerateReport = async () => {
    try {
      const column_widths = USER_REPORT_COLUMNS_WIDTH.split(",").map((key) =>
        Number(key)
      )

      const fields = USER_REPORT_COLUMNS.split(",")

      const response = await generateReport({
        condition,
        column_widths,
        fields,
      })

      openReport(response)
    } catch (error) {
      errorHandler(error)
    }
  }

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: <CustomText strong>Lista de usuarios registrados</CustomText>,
      collapsible: "disabled",
      children: (
        <EmployeesTable
          form={form}
          onPrint={handleGenerateReport}
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
    <>
      <CustomSpin spinning={isPending || isGenerateReportPending}>
        <CustomRow width={"100%"}>
          <CustomCol xs={24}>
            <CustomCollapse
              expandIcon={() => null}
              defaultActiveKey={["1", "2"]}
              items={items}
            />
          </CustomCol>
        </CustomRow>
      </CustomSpin>
    </>
  )
}

export default page

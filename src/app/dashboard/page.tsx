"use client"

import React from "react"
import { NextPage } from "next"
import { CustomCol, CustomRow, CustomSpace } from "@/components/custom"
import Activities from "./components/Activities"
import PerformanceChart from "./components/PerformanceChart"
import EmployeesDetails from "./components/EmployeesDetails"
import EmployeesDepartmentChart from "./components/EmployeesDepartmentChart"
import useGetEmployeesByDepartments from "@/services/hooks/dashboard/useGetEmpleesByDepartments"
import PayrollDistributionChart from "./components/PayrollDistributionChart"
import PayrollByDepartment from "./components/PayrollByDepartment"

const page: NextPage = () => {
  const { isPending: isGetEmployeesPending, data: employeesDepartments } =
    useGetEmployeesByDepartments()
  return (
    <CustomRow justify={"space-between"} width={"100%"} gap={10}>
      <CustomCol xs={24}>
        <CustomSpace size={10} direction={"horizontal"}>
          <EmployeesDetails />

          <EmployeesDepartmentChart
            loading={isGetEmployeesPending}
            dataSource={employeesDepartments}
          />
        </CustomSpace>
      </CustomCol>
      <CustomCol xs={24}>
        <CustomSpace direction={"horizontal"} size={10}>
          <PayrollDistributionChart />
          <PayrollByDepartment />
        </CustomSpace>
      </CustomCol>
      <CustomCol xs={24}>
        <CustomSpace direction={"horizontal"} size={10}>
          <PerformanceChart />
          <Activities />
        </CustomSpace>
      </CustomCol>
    </CustomRow>
  )
}

export default page

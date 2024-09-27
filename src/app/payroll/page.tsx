"use client"

import {
  CustomCol,
  CustomDivider,
  CustomRow,
  CustomSpin,
  CustomStatistic,
  CustomTabs,
} from "@/components/custom"
import { NextPage } from "next"
import { Tab } from "rc-tabs/lib/interface"
import React, { useEffect } from "react"
import PayrollTable from "./components/PayrollTable"
import AdjustmentTab from "./components/Adjustments"
import PayrollForm from "./components/PayrollForm"
import useGetPayrollInfo from "@/services/hooks/payroll/useGetPayrollInfo"
import usePayrollStore from "@/stores/payrollStore"
import PayrollHistoryTable from "./components/PayrollHistoryTable"

const page: NextPage = () => {
  const { payrollInfo } = usePayrollStore()
  const { isPending: isGetInfoPending, refetch } = useGetPayrollInfo()

  useEffect(() => {}, [])

  const items: Tab[] = [
    {
      key: "payroll_entries",
      label: "Nómina",
      children: <PayrollTable payrollId={payrollInfo.PAYROLL_ID} />,
    },
    {
      key: "adjustments",
      label: "Descuentos y Bonificaciones",
      children: (
        <CustomCol xs={24}>
          <AdjustmentTab />
        </CustomCol>
      ),
    },
    {
      key: "history",
      label: "Historial",
      children: <PayrollHistoryTable />,
    },
  ]

  return (
    <>
      <CustomSpin spinning={isGetInfoPending}>
        <CustomCol xs={24}>
          <CustomRow
            width={"100%"}
            gap={10}
            justify={"space-between"}
            style={{ marginTop: "10px" }}
          >
            <CustomStatistic
              title={"Periodo de Nómina"}
              value={payrollInfo.LABEL}
            />
            <CustomStatistic
              title={"Próximo pago"}
              value={payrollInfo.NEXT_PAYMENT}
            />
            <CustomDivider />
            <CustomCol xs={24}>
              <CustomTabs destroyInactiveTabPane items={items} />
            </CustomCol>
          </CustomRow>
        </CustomCol>
      </CustomSpin>

      <PayrollForm onFinish={refetch} />
    </>
  )
}

export default page

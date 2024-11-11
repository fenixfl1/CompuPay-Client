"use client"

import {
  CustomCol,
  CustomCollapse,
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
import useUserStore from "@/stores/userStore"
import { initialData } from "@/services/hooks/user/useGetUserList"

const page: NextPage = () => {
  const { payrollInfo } = usePayrollStore()
  const { isPending: isGetInfoPending, refetch } = useGetPayrollInfo()
  const { setUsers } = useUserStore()

  useEffect(() => {
    return () => {
      setUsers(initialData)
    }
  }, [])

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
          <CustomCollapse
            expandIcon={() => null}
            defaultActiveKey={[1]}
            items={[
              {
                key: 1,
                collapsible: "disabled",
                children: (
                  <CustomCol xs={24}>
                    <CustomTabs destroyInactiveTabPane items={items} />
                  </CustomCol>
                ),
                label: (
                  <CustomRow justify={"space-between"}>
                    <CustomStatistic
                      title={"Periodo de Nómina"}
                      value={payrollInfo.LABEL}
                    />
                    <CustomStatistic
                      title={"Próximo pago"}
                      value={payrollInfo.NEXT_PAYMENT}
                    />
                  </CustomRow>
                ),
              },
            ]}
          />
        </CustomCol>
      </CustomSpin>

      <PayrollForm onFinish={refetch} />
    </>
  )
}

export default page

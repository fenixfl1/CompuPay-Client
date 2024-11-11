"use client"

import {
  CustomCol,
  CustomCollapse,
  CustomRow,
  CustomSpin,
} from "@/components/custom"
import React, { useCallback, useEffect, useState } from "react"
import LeavesTable from "./components/LeavesTable"
import LeavesForm from "./components/LeavesForm"
import { Form } from "antd"
import useModalStore from "@/stores/modalStore"
import useGetLeaveList from "@/services/hooks/leaves/useGetLeaveList"
import { AdvancedCondition } from "@/services/interfaces"
import useLeaveStore from "@/stores/leaveStore"
import useDebounce from "@/hooks/useDebounce"
import useUpdateLeave from "@/services/hooks/leaves/useUpdateLeave"
import errorHandler from "@/helpers/errorHandler"
import { customNotification } from "@/components/custom/customNotification"
import ConditionalComponent from "@/components/ConditionalComponent"

const page: React.FC = () => {
  const [searchValue, setSearchValue] = useState("")
  const [shouldUpdate, setShouldUpdate] = useState<boolean>()
  const debounce = useDebounce(searchValue)
  const [form] = Form.useForm()
  const { visible } = useModalStore()

  const { mutate: getLeaves, isPending: isGetLeavesPending } = useGetLeaveList()
  const { mutateAsync: updateLeaves, isPending: isUpdatePending } =
    useUpdateLeave()

  const { metadata, setLeave } = useLeaveStore()

  const handleGetLeaves = useCallback(
    (
      page = metadata?.page,
      size = metadata?.page_size,
      data?: Record<string, any>
    ) => {
      const condition: AdvancedCondition[] = [
        {
          dataType: "list",
          condition: data?.STATE ?? ["A"],
          field: "STATE",
          operator: "IN",
        },
      ]

      if (debounce) {
        condition.push({
          dataType: "str",
          condition: debounce,
          field: ["employee__name", "employee__username"],
          operator: "ILIKE",
        })
      }

      if (data?.CONCEPT) {
        condition.push({
          dataType: "list",
          condition: data.CONCEPT,
          field: "CONCEPT",
          operator: "IN",
        })
      }

      if (data?.RANGE_DATE) {
        condition.push(
          {
            dataType: "str",
            field: "END_DATE",
            operator: ">=",
            condition: data.RANGE_DATE[0].format("YYYY-MM-DD"),
          },
          {
            dataType: "str",
            field: "END_DATE",
            operator: "<=",
            condition: data.RANGE_DATE[1].format("YYYY-MM-DD"),
          }
        )
      }

      getLeaves({ condition, page, size })
    },
    [debounce, shouldUpdate]
  )

  useEffect(handleGetLeaves, [handleGetLeaves])

  useEffect(() => {
    if (!visible) {
      form.resetFields()
      setLeave({} as Leave)
      setShouldUpdate(!shouldUpdate)
    }
  }, [visible])

  const handleOnDelete = async (record: Leave) => {
    try {
      const isActive = record.STATE === "A"
      await updateLeaves({
        LEAVE_ID: record.LEAVE_ID,
        STATE: isActive ? "I" : "A",
      })

      customNotification({
        message: "Operación exitosa",
        description: isActive
          ? "Registro inhabilitado exitosamente"
          : "Registro habilitado exitosamente",
      })

      setShouldUpdate(!shouldUpdate)
    } catch (error) {
      errorHandler(error)
    }
  }

  return (
    <CustomSpin spinning={isGetLeavesPending || isUpdatePending}>
      <CustomCol xs={24}>
        <CustomRow>
          <CustomCol xs={24}>
            <CustomCollapse
              collapsible={"disabled"}
              activeKey={["table"]}
              items={[
                {
                  children: (
                    <LeavesTable
                      onSearch={handleGetLeaves}
                      searchKey={setSearchValue}
                      onUpdate={handleOnDelete}
                    />
                  ),
                  key: "table",
                },
              ]}
            />
          </CustomCol>
        </CustomRow>
      </CustomCol>

      <ConditionalComponent condition={visible}>
        <LeavesForm form={form} />
      </ConditionalComponent>
    </CustomSpin>
  )
}

export default page

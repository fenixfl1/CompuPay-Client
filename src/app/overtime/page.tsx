"use client"

import {
  CustomCol,
  CustomCollapse,
  CustomRow,
  CustomSpin,
} from "@/components/custom"
import React, { useCallback, useEffect, useState } from "react"
import OvertimeTable from "./components/OvertimeTable"
import useDebounce from "@/hooks/useDebounce"
import errorHandler from "@/helpers/errorHandler"
import ConditionalComponent from "@/components/ConditionalComponent"
import OvertimeForm from "./components/OvertimeForm"
import useModalStore from "@/stores/modalStore"
import useGetOvertimeList from "@/services/hooks/overtime/useGetOvertTimeList"
import useOvertimeStore from "@/stores/overtimes"
import { AdvancedCondition } from "../../services/interfaces"
import useUpdateOvertime from "@/services/hooks/overtime/useUpdateOvertime"

const page: React.FC = () => {
  const [shouldUpdate, setShouldUpdate] = useState<boolean>()
  const [searchValue, setSearchValue] = useState("")
  const debounce = useDebounce(searchValue)

  const { mutate: getOvertimeList, isPending: isGetOvertimePending } =
    useGetOvertimeList()
  const { mutateAsync: updateOvertime, isPending: isUpdatePending } =
    useUpdateOvertime()

  const { visible } = useModalStore()
  const { metadata, setOvertime } = useOvertimeStore()

  const handleOnSearch = useCallback(
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

      if (data?.PAID?.length) {
        condition.push({
          dataType: "list",
          condition: data.PAID,
          field: "PAID",
          operator: "IN",
        })
      }

      if (data?.RANGE_DATE) {
        condition.push({
          dataType: "str",
          field: "DATE",
          operator: "BETWEEN",
          condition: [
            data.RANGE_DATE[0].format("YYYY-MM-DD"),
            data.RANGE_DATE[1].format("YYYY-MM-DD"),
          ],
        })
      }

      getOvertimeList({ condition, page, size })
    },
    [debounce, visible, shouldUpdate]
  )

  useEffect(handleOnSearch, [handleOnSearch])

  useEffect(() => {
    setOvertime({} as Overtime)
  }, [shouldUpdate])

  const handleOnUpdate = async (record: Overtime) => {
    try {
      await updateOvertime({
        OVERTIME_ID: record.OVERTIME_ID,
        STATE: record.STATE === "A" ? "I" : "A",
      })

      setShouldUpdate(!shouldUpdate)
    } catch (error) {
      errorHandler(error)
    }
  }

  return (
    <>
      <CustomSpin spinning={isGetOvertimePending || isUpdatePending}>
        <CustomCol xs={24}>
          <CustomRow>
            <CustomCol xs={24}>
              <CustomCollapse
                collapsible={"disabled"}
                activeKey={"table"}
                items={[
                  {
                    key: "table",
                    children: (
                      <OvertimeTable
                        searchKey={setSearchValue}
                        onUpdate={handleOnUpdate}
                        onSearch={handleOnSearch}
                      />
                    ),
                  },
                ]}
              />
            </CustomCol>
          </CustomRow>
        </CustomCol>
      </CustomSpin>

      <ConditionalComponent condition={visible}>
        <OvertimeForm />
      </ConditionalComponent>
    </>
  )
}

export default page

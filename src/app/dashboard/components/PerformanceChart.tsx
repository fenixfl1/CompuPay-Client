import {
  CustomCard,
  CustomForm,
  CustomFormItem,
  CustomRangePicker,
  CustomRow,
} from "@/components/custom"
import useGetTaskPerformance from "@/services/hooks/dashboard/useGetTaskPerformance"
import { Form } from "antd"
import dayjs from "dayjs"
import { useCallback, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Label,
} from "recharts"
import styled from "styled-components"

const Card = styled(CustomCard)`
  width: 100%;
  padding: 0 !important;
`

const PerformanceChart: React.FC = () => {
  const [form] = Form.useForm()
  const dateRange: [dayjs.Dayjs, dayjs.Dayjs] = Form.useWatch(
    "DATE_RANGE",
    form
  )
  const {
    mutateAsync: getTaskPerformance,
    data: { departments, performance },
  } = useGetTaskPerformance()

  const handleGetTaskPerformance = useCallback(() => {
    if (!dateRange?.length) return
    const [start, end] = dateRange
    getTaskPerformance({
      condition: {
        date_range: [start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD")],
      },
    })
  }, [dateRange])

  useEffect(handleGetTaskPerformance, [handleGetTaskPerformance])

  return (
    <Card shadow color={"#f0f4f6"}>
      <CustomRow justify={"end"}>
        <CustomForm form={form}>
          <CustomFormItem
            name={"DATE_RANGE"}
            initialValue={[dayjs().startOf("month"), dayjs().endOf("month")]}
          >
            <CustomRangePicker maxDate={dayjs().endOf("month")} />
          </CustomFormItem>
        </CustomForm>
      </CustomRow>
      <BarChart
        width={455}
        height={455}
        data={performance}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day">
          <Label value={"Días"} offset={0} position={"insideBottom"} />
        </XAxis>
        <YAxis />
        <Tooltip />
        <Legend />
        {departments?.map((item, index) => (
          <Bar
            barSize={"20"}
            stackId="a"
            dataKey={item.name}
            fill={item.color}
            radius={
              index === departments.length - 1 ? [10, 10, 0, 0] : undefined
            }
          />
        ))}
      </BarChart>
    </Card>
  )
}

export default PerformanceChart

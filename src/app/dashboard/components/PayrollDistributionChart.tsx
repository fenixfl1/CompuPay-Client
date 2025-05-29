import ConditionalComponent from "@/components/ConditionalComponent"
import {
  CustomButton,
  CustomCard,
  CustomCheckbox,
  CustomCheckboxGroup,
  CustomCol,
  CustomDivider,
  CustomForm,
  CustomFormItem,
  CustomPopover,
  CustomRow,
  CustomSelect,
  CustomSpace,
  CustomText,
} from "@/components/custom"
import formatter from "@/helpers/formatter"
import useGetPaymentDistByMonth from "@/services/hooks/dashboard/useGetPaymentDistByMonth"
import { SlidersOutlined } from "@ant-design/icons"
import { Form } from "antd"
import React, { useEffect, useMemo, useState } from "react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Bar,
  BarChart,
  Label,
  Tooltip,
} from "recharts"
import styled from "styled-components"

const TooltipContent = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: #f0f4f6;
  opacity: 90%;
  height: max-content;
  padding: 10px;
`

const PayrollDistributionChart: React.FC = () => {
  const [form] = Form.useForm()
  const chartType = Form.useWatch("CHART_TYPE", form)
  const combinedBars = Form.useWatch("COMBINED", form)
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>()

  const { data: response } = useGetPaymentDistByMonth()

  useEffect(() => {
    setSelectedConcepts(response?.concepts?.map((item) => item.concept))
  }, [response])

  const dataSource = useMemo(() => {
    return response?.data
  }, [response])

  const concepts = useMemo(() => {
    const arr =
      response?.concepts.filter((item) =>
        selectedConcepts?.includes(item.concept)
      ) || []

    return arr.sort((a, b) => {
      if (a.concept === "SALARIO") return 1
      if (b.concept === "SALARIO") return -1
      return 0
    })
  }, [selectedConcepts, response])

  const commonProps = {
    width: 730,
    height: 250,
    data: dataSource,
    margin: {
      top: 5,
      right: 30,
      left: 20,
      bottom: 5,
    },
  }

  const content = (
    <div style={{ width: "150px" }}>
      <CustomForm form={form} layout={"vertical"}>
        <CustomRow>
          <CustomCol xs={24}>
            <CustomFormItem
              label={"Tipo de Gráfico"}
              name={"CHART_TYPE"}
              initialValue={"line"}
            >
              <CustomSelect
                options={[
                  { label: "Lineas", value: "line" },
                  { label: "Barras", value: "bar" },
                ]}
              />
            </CustomFormItem>
          </CustomCol>

          <ConditionalComponent condition={chartType === "bar"}>
            <CustomCol xs={24}>
              <CustomFormItem
                label={"Combinar Conceptos"}
                layout="horizontal"
                name={"COMBINED"}
                valuePropName={"checked"}
              >
                <CustomCheckbox
                  onClick={() => {
                    form.setFieldsValue({
                      COMBINED: !combinedBars,
                    })
                  }}
                />
              </CustomFormItem>
            </CustomCol>
          </ConditionalComponent>

          <CustomCol xs={24}>
            <CustomFormItem label={"Conceptos"}>
              <CustomCheckboxGroup
                onChange={setSelectedConcepts}
                value={selectedConcepts}
                options={response?.concepts
                  ?.filter((item) => !!item.concept)
                  ?.map((item) => ({
                    label: item?.concept,
                    value: item?.concept,
                    style: { width: "100%" },
                  }))}
              />
            </CustomFormItem>
          </CustomCol>
        </CustomRow>
      </CustomForm>
    </div>
  )

  const tooltipContent = ({ label }: any) => {
    const item =
      dataSource?.find((item) => item.period === label) ?? ({} as any)

    return (
      <TooltipContent>
        <CustomSpace>
          <CustomText>{item?.period}</CustomText>
          {Object.keys(item)
            ?.filter((key) => selectedConcepts?.includes(key))
            ?.map((key) => {
              if (!isNaN(item[key])) {
                return (
                  <CustomText>
                    {key} :{" "}
                    {formatter({
                      value: item[key],
                      format: "currency",
                      prefix: "RD",
                      fix: 2,
                    })}
                  </CustomText>
                )
              }

              return
            })}
        </CustomSpace>
      </TooltipContent>
    )
  }

  return (
    <CustomCard shadow color={"#f0f4f6"}>
      <CustomRow justify={"space-between"}>
        <CustomCol xs={22}>
          <CustomDivider>
            <CustomText strong>Distribución de pagos</CustomText>
          </CustomDivider>
        </CustomCol>
        <CustomPopover content={content} placement={"bottom"}>
          <CustomButton
            type={"text"}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-sliders"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1z"
                />
              </svg>
            }
          />
        </CustomPopover>
      </CustomRow>
      <ConditionalComponent
        condition={chartType !== "bar"}
        fallback={
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period">
              <Label
                value={"Periodos de Nómina"}
                offset={0}
                position={"insideBottom"}
              />
            </XAxis>
            <YAxis />
            <Tooltip content={tooltipContent} />
            <Legend />
            {concepts?.map((item, index) => (
              <Bar
                barSize={"20"}
                stackId={combinedBars ? "a" : undefined}
                dataKey={item.concept}
                fill={item.fill}
                radius={
                  index === concepts.length - 1 ? [5, 5, 0, 0] : undefined
                }
              />
            ))}
          </BarChart>
        }
      >
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip content={tooltipContent} />
          <Legend />
          {concepts.map((item) => (
            <Line
              type="monotone"
              dataKey={item.concept}
              stroke={item.fill}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ConditionalComponent>
    </CustomCard>
  )
}

export default PayrollDistributionChart

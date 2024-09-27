import { CustomCard, CustomDivider, CustomText } from "@/components/custom"
import useGetPaymentDistByMonth from "@/services/hooks/dashboard/useGetPaymentDistByMonth"
import { Tooltip } from "antd"
import React from "react"
import { XAxis, YAxis, CartesianGrid, Legend, Line, LineChart } from "recharts"

const PayrollDistributionChart: React.FC = () => {
  const { data: response } = useGetPaymentDistByMonth()

  return (
    <CustomCard shadow color={"#f0f4f6"}>
      <CustomDivider>
        <CustomText strong>Distribución de pagos</CustomText>
      </CustomDivider>
      <LineChart
        width={730}
        height={250}
        data={response?.data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        {response?.concepts.map((item) => (
          <Line
            type="monotone"
            dataKey={item.concept}
            stroke={item.fill}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </CustomCard>
  )
}

export default PayrollDistributionChart

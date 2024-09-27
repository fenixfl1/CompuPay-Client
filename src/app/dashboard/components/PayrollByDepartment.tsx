import {
  CustomCard,
  CustomDivider,
  CustomSpace,
  CustomText,
  CustomTooltip,
} from "@/components/custom"
import formatter from "@/helpers/formatter"
import useGetSalaryByDepartments from "@/services/hooks/dashboard/useGetSalaryByDepartments"
import React from "react"
import { BarChart, Bar, Legend, Tooltip, Label, XAxis, YAxis } from "recharts"
import styled from "styled-components"

const TooltipContent = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: #f0f4f6;
  opacity: 90%;
  height: 100px;
  padding: 10px;
`

const Text = styled(CustomText)``

const PayrollByDepartment: React.FC = () => {
  const { data } = useGetSalaryByDepartments()
  return (
    <CustomCard shadow color={"#f0f4f6"}>
      <CustomDivider>
        <CustomText strong>Salario por departamentos</CustomText>
      </CustomDivider>
      <BarChart width={260} height={250} data={data}>
        <YAxis />
        <Tooltip
          content={({ label }) => {
            const item = data?.[label as never]
            return (
              <TooltipContent>
                <CustomSpace>
                  <CustomText style={{ color: item?.fill }}>
                    {item?.department}
                  </CustomText>
                  <CustomText style={{ color: item?.fill }}>
                    {formatter({
                      value: item?.uv,
                      format: "currency",
                      prefix: "RD",
                      fix: 2,
                    })}
                  </CustomText>
                  <CustomText style={{ color: item?.fill }}>
                    {formatter({
                      value: item?.percentage,
                      format: "percentage",
                      fix: 2,
                    })}
                  </CustomText>
                </CustomSpace>
              </TooltipContent>
            )
          }}
        />
        <Bar dataKey="uv" radius={[8, 8, 0, 0]} />
      </BarChart>
    </CustomCard>
  )
}

export default PayrollByDepartment

import ConditionalComponent from "@/components/ConditionalComponent"
import {
  CustomCard,
  CustomCol,
  CustomDivider,
  CustomParagraph,
  CustomRow,
  CustomSpace,
  CustomSpin,
  CustomTag,
  CustomText,
  CustomTitle,
} from "@/components/custom"
import { assert } from "@/helpers/assert"
import useGetUserStatistic from "@/services/hooks/dashboard/useGetUserStatistic"
import { defaultTheme } from "@/styles/themes"
import {
  ContactsOutlined,
  FallOutlined,
  RiseOutlined,
  PlusOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons"
import React from "react"
import { Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"
import styled from "styled-components"

const Card = styled(CustomCard)`
  display: flex;
  align-content: center;
  align-items: center;
  box-shadow: ${({ theme }) => theme.boxShadow};
`

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 10px;
  margin: 0 auto;
  box-sizing: border-box;

  .icon {
    font-size: 2em;
    color: #8c8c8c;
    border-radius: 50% !important;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-content: center;
    background-color: #e3e6e9;
  }

  .stats {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
  }

  .number {
    font-size: 1.5em;
    font-weight: bold;
  }

  .percentage {
    background-color: #e6fffb;
    color: #52c41a;
    padding: 0.2em 0.5em;
    border-radius: 12px;
    font-size: 0.8em;
    display: inline-block;
  }

  .label {
    color: #8c8c8c;
    font-size: 0.9em;
  }
`

const Tag = styled(CustomTag)`
  width: 40px;
  max-width: 40px;
  text-align: center !important;
`

const getTag = (value: number): React.ReactNode => {
  return (
    <ConditionalComponent
      condition={value > 0}
      fallback={
        <CustomTag color={"red"} icon={<FallOutlined />}>
          {value}
        </CustomTag>
      }
    >
      <CustomTag color={"green"} icon={<RiseOutlined />}>
        +{value}
      </CustomTag>
    </ConditionalComponent>
  )
}

const EmployeesDetails: React.FC = (): React.ReactElement => {
  const { data, isPending } = useGetUserStatistic()

  assert<UserStatistics>(data)

  const {
    total_registered,
    total_inters,
    new_employees,
    total_employees,
    line_chart,
  } = data ?? {}

  return (
    <CustomSpin spinning={isPending}>
      <CustomSpace width={"100%"} size={10}>
        <Container>
          <CustomCard shadow color={"#f0f4f6"}>
            <CustomRow justify={"center"} gap={2}>
              <div className="icon">
                <UsergroupAddOutlined />
              </div>
              <CustomCol xs={24} />
              <Tag>{total_employees}</Tag>
              <CustomCol xs={24} />
              <CustomText type={"secondary"}>Total de empleados</CustomText>
            </CustomRow>
          </CustomCard>

          <CustomCard shadow color={"#f0f4f6"}>
            <CustomRow justify={"center"} gap={2}>
              <div className="icon">
                <ContactsOutlined />
              </div>
              <CustomCol xs={24} />
              <Tag>{total_inters}</Tag>
              <CustomCol xs={24} />
              <CustomText type={"secondary"}>Postulantes</CustomText>
            </CustomRow>
          </CustomCard>

          <CustomCard shadow color={"#f0f4f6"}>
            <CustomRow justify={"center"} gap={2}>
              <div className="icon">
                <UserAddOutlined />
              </div>
              <CustomCol xs={24} />
              <Tag>{new_employees}</Tag>
              <CustomCol xs={24} />
              <CustomText type={"secondary"}>Nuevos Empleados</CustomText>
            </CustomRow>
          </CustomCard>

          <CustomCard shadow color={"#f0f4f6"}>
            <CustomRow justify={"center"} gap={2}>
              <div className="icon">
                <UserDeleteOutlined />
              </div>
              <CustomCol xs={24} />
              <Tag>{total_registered}</Tag>
              <CustomCol xs={24} />

              <CustomText type={"secondary"}>Total Registrados</CustomText>
            </CustomRow>
          </CustomCard>
        </Container>

        <Card width={"100%"} height={"217px"} color={"#f0f4f6"}>
          <CustomDivider>
            <CustomText strong>Empleados activos</CustomText>
          </CustomDivider>
          <LineChart width={400} height={180} data={line_chart}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3bcaa7"
              strokeWidth={2}
            />
          </LineChart>
        </Card>
      </CustomSpace>
    </CustomSpin>
  )
}

export default EmployeesDetails

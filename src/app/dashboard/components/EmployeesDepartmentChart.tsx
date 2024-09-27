import {
  CustomCard,
  CustomCol,
  CustomDivider,
  CustomRow,
  CustomSpin,
  CustomTitle,
} from "@/components/custom"
import React, { PureComponent } from "react"
import { PieChart, Pie, Sector, Legend } from "recharts"
import styled from "styled-components"

const Card = styled(CustomCard)`
  .recharts-default-legend {
    width: max-content !important;
  }
`

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? "start" : "end"

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`PV ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  )
}

interface ChartProps {
  dataSource?: ChartRecord[]
  loading?: boolean
}

export default class EmployeesDepartmentChart extends PureComponent<ChartProps> {
  state = {
    activeIndex: 0,
  }

  onPieEnter = (_: any, index: any) => {
    this.setState({
      activeIndex: index,
    })
  }

  render() {
    return (
      <CustomSpin spinning={this.props.loading}>
        <Card shadow color={"#f0f4f6"}>
          <CustomCol xs={24} style={{ height: "460px" }}>
            <CustomRow justify={"center"}>
              <CustomDivider>
                <CustomTitle level={5}>Empleados por departamentos</CustomTitle>
              </CustomDivider>
              <PieChart width={500} height={300}>
                <Legend />
                <Pie
                  activeIndex={this.state.activeIndex}
                  activeShape={renderActiveShape}
                  data={this.props?.dataSource}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={this.onPieEnter}
                />
              </PieChart>
            </CustomRow>
          </CustomCol>
        </Card>
      </CustomSpin>
    )
  }
}

import React from "react"
import { Card, CardProps } from "antd"
import styled from "styled-components"

export interface CustomCardProps extends CardProps {
  width?: number | string
  height?: number | string
  shadow?: boolean
  color?: string
}

const StyledCard = styled<React.FC<CustomCardProps>>(Card)`
  box-shadow: ${(props) => (props.shadow ? props.theme.boxShadow : undefined)};
  background-color: ${(props) => props.color};
`

const CustomCard: React.FC<CustomCardProps> = ({
  shadow,
  height,
  width,
  ...props
}) => {
  return (
    <StyledCard {...props} style={{ ...props.style, height, width }}>
      {props.children}
    </StyledCard>
  )
}

export default CustomCard

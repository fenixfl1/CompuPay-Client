import {
  CustomButton,
  CustomCard,
  CustomDivider,
  CustomRow,
  CustomSpin,
  CustomTimeline,
  CustomTitle,
} from "@/components/custom"
import formatter from "@/helpers/formatter"
import useActivityStore from "@/stores/activitiesStore"
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  UndoOutlined,
} from "@ant-design/icons"
import React, { useCallback, useEffect, useMemo } from "react"
import styled from "styled-components"
import useGetRecentActivities from "@/services/hooks/dashboard/useGetRecentActivities"
import { AdvancedCondition } from "@/services/interfaces"
import ConditionalComponent from "@/components/ConditionalComponent"

const Container = styled(CustomRow)`
  padding: 5px;
  width: 100%;
  max-height: 450px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  justify-content: center;

  .ant-timeline-item-head {
    background: transparent !important;
  }
`

const Mention = styled.span`
  color: #1890ff; /* Puedes cambiar el color o el estilo que prefieras */
  font-weight: bold;
`

const Card = styled(CustomCard)`
  box-shadow: ${({ theme }) => theme.boxShadow};
`

const formatChangeMessage = (message: string) => {
  const regex = /(@\w+)/g
  return message.split(regex).map((part, index) => {
    // Si la parte es un nombre que comienza con "@", aplicar el estilo
    if (part.startsWith("@")) {
      return <Mention key={index}>{part.replace("@", "")}</Mention>
    }
    // Si no, retornar el texto normal
    return part
  })
}

const colors: Record<number, string> = {
  1: "blue",
  2: "green",
  3: "red",
}

const icons: Record<string, React.ReactNode> = {
  1: <PlusCircleOutlined />,
  2: <EditOutlined />,
  3: <DeleteOutlined />,
}

interface ActivitiesProps {
  onSearch?: () => void
}

const Activities: React.FC<ActivitiesProps> = () => {
  const {
    mutateAsync: getRecentActivities,
    isPending: isGetActivitiesPending,
  } = useGetRecentActivities()

  const { metadata, activities } = useActivityStore()

  const { page, page_size } = metadata

  const handleGetActivities = useCallback(
    (
      current = page,
      size = page_size,
      options = {} as Record<string, unknown>
    ) => {
      const condition: AdvancedCondition[] = [
        {
          condition: true,
          dataType: "bool",
          field: "ID",
          operator: ">=",
        },
      ]

      Object.keys(options).forEach((key) => {
        condition.push({
          condition: options[key] as string,
          dataType: "str",
          field: key as string,
          operator: "=",
        })
      })

      getRecentActivities({ page: current, size, condition })
    },
    []
  )

  useEffect(handleGetActivities, [handleGetActivities])

  const handleOnLoadMore = async () => {
    handleGetActivities(page, page_size + 10)
  }

  const items = useMemo(() => {
    return activities.map((activity) => ({
      // label: formatter({ value: activity.ACTION_TIME, format: "date" }),
      children: formatChangeMessage(activity.CHANGE_MESSAGE),
      color: colors[activity.ACTION_FLAG],
      dot: icons[activity.ACTION_FLAG],
    }))
  }, [activities])

  return (
    <CustomSpin spinning={isGetActivitiesPending}>
      <Card color={"#f0f4f6"}>
        <CustomDivider>
          <CustomTitle level={5}>Actividades Recientes</CustomTitle>
        </CustomDivider>
        <Container>
          <CustomTimeline items={items} />
          <ConditionalComponent condition={!!metadata.next_page}>
            <CustomButton
              block
              icon={<UndoOutlined />}
              onClick={handleOnLoadMore}
              type={"link"}
            >
              Cargar Más
            </CustomButton>
          </ConditionalComponent>
        </Container>
      </Card>
    </CustomSpin>
  )
}

export default Activities

import ConditionalComponent from "@/components/ConditionalComponent"
import {
  CustomAvatar,
  CustomAvatarGroup,
  CustomButton,
  CustomCard,
  CustomCheckbox,
  CustomCol,
  CustomRow,
  CustomSpace,
  CustomText,
  CustomTooltip,
} from "@/components/custom"
import { Task } from "@/interfaces/task"
import {
  BorderOutlined,
  CheckSquareOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { CheckboxChangeEvent } from "antd/lib/checkbox"
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import formatter from "@/helpers/formatter"
import capitalize from "@/helpers/capitalize"
import { CustomLink } from "@/components/custom/CustomParagraph"
import { LinkProps } from "antd/lib/typography/Link"
import { defaultBreakpoints } from "@/styles/breakpoints"

const Card = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: start;
  align-content: center;
  padding: 0 10px;
  border: 1px solid ${({ theme }) => theme.textColor};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.textColor};
  box-sizing: border-box;

  .ant-checkbox-inner {
    width: 20px !important;
    height: 20px !important;
  }
`

const Title = styled(CustomLink)<LinkProps & { deleted: boolean }>`
  text-decoration: ${({ deleted }) =>
    deleted ? "line-through !important" : undefined};
`

interface TaskListItemProps {
  task: Task
  onChange: (task: Task) => void
  onClick: (task: Task) => void
}

const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  onChange,
  onClick,
}) => {
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    if (task) setIsDone(task.COMPLETED)
  }, [task])

  const handleOnCheckChange = () => {
    setIsDone(!isDone)
    onChange(task)
  }

  return (
    <CustomCol xs={24}>
      <Card>
        <CustomRow justify={"space-between"} align={"middle"} width={"100%"}>
          <CustomCol {...defaultBreakpoints}>
            <CustomRow justify={"space-between"}>
              <CustomCol xs={1}>
                <CustomCheckbox
                  checked={isDone}
                  onClick={handleOnCheckChange}
                />
              </CustomCol>

              <CustomCol xs={21}>
                <CustomCol xs={24}>
                  <Title
                    onClick={() => onClick(task)}
                    deleted={task?.COMPLETED}
                  >
                    {task?.NAME}
                  </Title>
                </CustomCol>
                <CustomText type={"secondary"}>
                  {capitalize(
                    formatter({ value: task?.CREATED_AT, format: "long_date" })
                  )}
                </CustomText>
              </CustomCol>
            </CustomRow>
          </CustomCol>

          <CustomAvatarGroup max={{ count: 3 }}>
            {task?.ASSIGNED_USERS?.map((user, index) => (
              <CustomTooltip title={user.FULL_NAME} key={user.USERNAME}>
                <CustomAvatar
                  shadow
                  size={32}
                  src={user.AVATAR}
                  icon={<UserOutlined />}
                />
              </CustomTooltip>
            ))}
          </CustomAvatarGroup>
        </CustomRow>
      </Card>
    </CustomCol>
  )
}

export default TaskListItem

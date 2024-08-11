import { notification, NotificationArgsProps } from "antd"
import ConditionalComponent from "../ConditionalComponent"

export const customNotification = ({
  message,
  description,
  type = "info",
  duration,
  onClick,
}: NotificationArgsProps): void => {
  notification[type]({
    message,
    onClick: onClick,
    duration: duration ? duration : 10,
    description: (
      <ConditionalComponent
        condition={typeof description === "string"}
        fallback={description}
      >
        <div dangerouslySetInnerHTML={{ __html: `${description}` }} />
      </ConditionalComponent>
    ),
  })
}

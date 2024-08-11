import { Form, FormInstance } from "antd"
import React from "react"

export const EditableContext = React.createContext({} as FormInstance)

type EditableRowProps = {
  index?: number
}

const EditableRow: React.FC<EditableRowProps> = ({ ...props }) => {
  const [form] = Form.useForm()

  return (
    <Form component={false} form={form}>
      <EditableContext.Provider value={form}>
        <tr {...props} style={{ border: "1px solid red" }} />
      </EditableContext.Provider>
    </Form>
  )
}

export default EditableRow

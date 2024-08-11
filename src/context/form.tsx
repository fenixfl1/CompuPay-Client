import { FormProps, Form } from "antd"
import { createContext, useContext } from "react"

type CustomFormProps = FormProps & {
  readonly?: boolean
  uppercase?: boolean
  width?: string | number
  children?: React.ReactNode
}

const CustomFormContext = createContext<CustomFormProps>({})

const FormProvider: React.FC<CustomFormProps> = ({ children, ...props }) => {
  return (
    <CustomFormContext.Provider value={props}>
      <Form {...props}>{children}</Form>
    </CustomFormContext.Provider>
  )
}

function useFormContext() {
  const context = useContext(CustomFormContext)
  if (context === undefined) {
    throw new Error("useFormContext must be used within a CustomFormProvider")
  }
  return context
}

export type { CustomFormProps }
export { useFormContext, FormProvider }

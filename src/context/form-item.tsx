import { FormItemProps } from "antd"
import { createContext, useContext } from "react"

type CustomFormItemProps = FormItemProps & {
  onlyString?: boolean
  onlyNumber?: boolean
  noSymbol?: boolean
  readonly?: boolean
  children?: React.ReactNode
}

const CustomFormItemContext = createContext<CustomFormItemProps>({})

const FormItemProvider: React.FC<CustomFormItemProps> = ({ ...props }) => {
  return (
    <CustomFormItemContext.Provider value={props}>
      {props.children}
    </CustomFormItemContext.Provider>
  )
}

function useFormItemContext() {
  const context = useContext(CustomFormItemContext)
  if (context === undefined) {
    throw new Error(
      "useFormItemContext must be used within a CustomFormItemProvider"
    )
  }
  return context
}

export type { CustomFormItemProps }
export { useFormItemContext, FormItemProvider }

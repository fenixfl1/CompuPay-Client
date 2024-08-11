import React from "react"
import MaskedInput, { MaskedInputProps } from "react-text-mask"
import CustomInput from "./CustomInput"
import { InputRef } from "antd"

const CustomMaskedInput: React.FC<MaskedInputProps> = ({
  guide = true,
  mask,
  ...props
}) => {
  return (
    <MaskedInput
      guide={guide}
      mask={mask}
      render={(ref, props) => (
        <CustomInput
          {...props}
          ref={(input: InputRef) => ref(input?.input as HTMLInputElement)}
        />
      )}
      {...props}
    />
  )
}

export default CustomMaskedInput

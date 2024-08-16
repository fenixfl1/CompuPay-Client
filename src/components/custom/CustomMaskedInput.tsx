import React, { useCallback, useEffect, useMemo, useState } from "react"
import Input, { Mask, MaskedInputProps } from "react-text-mask"
import CustomInput, { CustomInputProps } from "./CustomInput"
import { useFormContext } from "@/context/form"
import sleep from "@/helpers/sleep"
import ConditionalComponent from "../ConditionalComponent"
import { MaskType } from "@/constants/types"
import { maskedInput } from "@/constants/masks"

export type CustomProps = CustomInputProps &
  Omit<MaskedInputProps, "mask"> &
  Omit<Readonly<MaskedInputProps>, "mask"> & {
    prefix?: string & React.ReactNode
    props?: never
    type: keyof MaskType
    width?: string | number
  }

const MaskedInput: React.FC<CustomProps> = ({
  guide = false,
  autoComplete = "off",
  disabled = false,
  variant = "outlined",
  keepCharPositions = true,
  className = "ant-input ant-input-sm ant-input ant-input-outlined ant-input-status-success",
  maxLength,
  type,
  width,
  ...props
}) => {
  const { readonly } = useFormContext()
  const [classes, setClasses] = useState<string>("")
  const [maxLen, setMaxLen] = useState<number>()

  const mask = useMemo(() => {
    switch (type) {
      case "cedula_rnc":
        return (value: string) =>
          (value.replace(/\D/g, "").length <= 9
            ? maskedInput["rnc"]
            : maskedInput["cedula"]) as Mask
      case "telefono":
        return (value: string) =>
          (value.length < (maskedInput["telefono"] as unknown[]).length + 1
            ? maskedInput["telefono"]
            : maskedInput["phone_format"]) as Mask
      default:
        return maskedInput[type] as Mask
    }
  }, [type])

  const handleClassName = useCallback(() => {
    sleep(100).then(() => {
      const form = document.querySelector("form")
      if (form) {
        const arrClass = form.className.split(" ")
        let lastClass = arrClass[arrClass.length - 1]

        if (variant === "borderless")
          lastClass = lastClass + " ant-input-borderless"
        setClasses(className + " " + lastClass)
      }
    })
  }, [variant])

  useEffect(handleClassName, [handleClassName])

  useEffect(() => {
    setMaxLen(typeof mask === "function" ? 16 : (mask as never[])?.length)
  }, [mask])

  return (
    <ConditionalComponent
      condition={classes.split(" ")?.length > 2}
      fallback={<CustomInput width={width} {...props} />}
    >
      <Input
        autoComplete={autoComplete}
        className={classes}
        disabled={readonly ? false : disabled}
        guide={guide}
        keepCharPositions={keepCharPositions}
        mask={mask}
        maxLength={maxLength ?? maxLen}
        readOnly={readonly}
        style={{ width }}
        {...props}
      />
    </ConditionalComponent>
  )
}

export default MaskedInput

import { CheckboxChangeEvent } from "antd/lib/checkbox"

export const normalizeFiles = (file: any) => {
  if (Array.isArray(file.fileList)) {
    return (
      file.fileList?.filter((item: any) => item.uid === file.file.uid) ?? []
    )
  }
}

export const normalizeNumber = (value: any) => {
  if (typeof value === "string") {
    return value.replace(/\D/g, "")
  }

  return value
}

export const normalizeMaskedInput = (event: any) => {
  if (event?.target) {
    return event.target.value?.replace(/\D/g, "")
  }

  return event
}

export const normalizeCheckBox = ({ target }: CheckboxChangeEvent) => {
  return target.checked
}

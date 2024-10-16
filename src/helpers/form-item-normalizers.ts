import { CheckboxChangeEvent } from "antd/lib/checkbox"

export const normalizeFiles = (file: any) => {
  // eslint-disable-next-line no-console
  console.log({ file })
  if (Array.isArray(file)) {
    return file
  }

  return file.fileList
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

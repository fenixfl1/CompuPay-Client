import { ColumnType } from "antd/lib/table"

export interface Formatter {
  value: string | number | undefined
  format: "phone" | "document" | "currency" | "date" | "long_date"
  prefix?: string
  fix?: number
}

export interface CustomColumnType<T> extends ColumnType<T> {
  editable?: boolean
  options?: { label: string; value: string }[]
}

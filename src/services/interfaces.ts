import { ErrorName } from "@/constants/types"
import { AxiosError, AxiosResponse } from "axios"

export interface Metadata {
  page: number
  page_size: number
  total: number
  next_page?: number
  previous_page?: string
}

export type QueryOperators =
  | "="
  | "!="
  | "LIKE"
  | "ILIKE"
  | ">"
  | ">="
  | "<"
  | "<="
  | "IN"
  | "NOT IN"
  | "IS NULL"

export interface Condition<T> {
  condition: { [P in keyof Partial<T>]: T[P] }
}

export interface AdvancedCondition<T = any> {
  condition: string | number | boolean | Array<string | number>
  dataType: "bool" | "str" | "int" | "list"
  field: keyof T | Array<keyof T>
  operator: QueryOperators
}

export interface ReturnPayload<T> {
  data: T
  metadata: Metadata
  message?: string
}

export interface GetPayload<T = AdvancedCondition[]> {
  condition: T
  page: number
  size: number
}

export interface ApiResponse<T> {
  data: ReturnPayload<T>
}

export interface ErrorResponse<T = unknown, D = any>
  extends Omit<AxiosError<T, D>, "response"> {
  response?: Omit<AxiosResponse<D>, "data"> & {
    data: {
      message: string
      error: ErrorName
      errorCode?: string
    }
  }
}

import { ColumnType } from "antd/lib/table"
import { ReactNode } from "react"
import type { w3cwebsocket as W3CWebSocket } from "websocket"

export interface Formatter {
  value: string | number | undefined
  format:
    | "phone"
    | "document"
    | "currency"
    | "date"
    | "long_date"
    | "percentage"
  prefix?: string
  fix?: number
}

export interface CustomColumnType<T> extends ColumnType<T> {
  editable?: boolean
  options?: { label: string; value: string }[]
}

export interface EditConfig {
  icon?: ReactNode
  tooltip?: ReactNode
  editing?: boolean
  maxLength?: number
  autoSize?: boolean | { minRows?: number; maxRows?: number }
  text?: string
  onChange?: (value: string) => void
  onCancel?: () => void
  onStart?: () => void
  onEnd?: () => void
  triggerType?: ("icon" | "text")[]
  enterIcon?: ReactNode
  tabIndex?: number
}

export interface SocketMessage {
  message: string
  sender: string
  receiver: string
}

export type WebSocketType = W3CWebSocket

export type ValidateStatus =
  | ""
  | "error"
  | "success"
  | "warning"
  | "validating"
  | undefined

export interface Options {
  label: React.ReactNode
  value: any
}

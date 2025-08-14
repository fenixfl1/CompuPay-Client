import React from "react"
import { Table } from "antd"
import { ColumnType } from "antd/es/table"
import { TableProps } from "antd/lib/table"
import { defaultTheme } from "@/styles/themes"
import ExportOptions from "../ExportOptions"
import ConditionalComponent from "../ConditionalComponent"
import { Metadata } from "@/services/interfaces"

export interface CustomColumnType<T> extends ColumnType<T> {
  editable?: boolean
}

interface ExportableProps {
  open?: boolean
  onClose?: () => void
  columnsMap?: Record<string, string>
  getData?:
    | ((tData: any) => Record<string, unknown>[])
    | Record<string, unknown>[]
}

export interface CustomTableProps<T> extends TableProps<T> {
  exportable?: ExportableProps
  metadata?: Metadata
}

const CustomTable = React.forwardRef<any, CustomTableProps<any>>(
  (
    {
      dataSource = [],
      expandable,
      bordered = false,
      size = defaultTheme.size,
      exportable,
      metadata,
      ...props
    },
    ref
  ) => {
    const {
      open = false,
      onClose,
      columnsMap = {},
      getData = dataSource,
    } = exportable || {}

    return (
      <>
        <Table
          dataSource={dataSource}
          bordered={bordered}
          size={size}
          ref={ref}
          expandable={{ indentSize: 25, ...expandable }}
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: [15, 20, 25, 50, 75, 100, 200],
            pageSize: metadata?.page_size,
            current: metadata?.page,
            total: metadata?.total,
          }}
          {...props}
        />

        <ConditionalComponent condition={open}>
          <ExportOptions
            columnsMap={columnsMap}
            onCancel={onClose}
            open={open}
            ref={ref}
            dataSource={
              typeof getData === "function" ? getData(dataSource) : getData
            }
          />
        </ConditionalComponent>
      </>
    )
  }
)

export default CustomTable

import React from "react"
import { Table } from "antd"
import { ColumnType } from "antd/es/table"
import { TableProps } from "antd/lib/table"
import { defaultTheme } from "@/styles/themes"

export interface CustomColumnType<T> extends ColumnType<T> {
  editable?: boolean
}

const CustomTable = React.forwardRef<any, TableProps<any>>(
  ({ bordered = false, size = defaultTheme.size, ...props }, ref) => {
    return (
      <Table
        bordered={bordered}
        size={size}
        ref={ref}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "15", "20"],
          ...props.pagination,
        }}
        {...props}
      />
    )
  }
)

export default CustomTable

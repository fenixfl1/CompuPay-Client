import React from "react"
import { List, ListProps } from "antd"

interface CustomListProps<T> extends ListProps<T> {
  pageSizeOptions?: string[]
}

const CustomList: React.FC<CustomListProps<any>> = ({
  size = "small",
  pagination,
  pageSizeOptions = ["5", "10", "20", "50", "100"],
  ...props
}) => {
  return (
    <List
      size={size}
      pagination={{ ...pagination, pageSizeOptions }}
      {...props}
    />
  )
}

export default CustomList

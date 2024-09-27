import { Metadata } from "@/services/interfaces"
import { TablePaginationConfig } from "antd"

function makePagination(metadata: Metadata): TablePaginationConfig {
  return {
    showSizeChanger: true,
    pageSize: metadata?.page_size,
    total: metadata?.total,
    current: metadata?.page,
  }
}

export default makePagination

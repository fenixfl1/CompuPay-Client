interface Activity {
  ID: number
  DESC_ACTION_FLAG: string
  VERBOSE_NAME: string
  ACTION_TIME: string
  OBJECT_ID: string
  OBJECT_REPR: string
  ACTION_FLAG: number
  CHANGE_MESSAGE: string
  USERNAME: string
  CONTENT_TYPE: number
}

interface ChartRecord {
  name: string
  value: number
  fill: string
}

interface TaskPerformance {
  performance: Record<string, string>[]
  departments: {
    name: string
    color: string
  }[]
}

interface UserStatistics {
  total_registered: number
  total_inters: number
  new_employees: number
  total_employees: number
  line_chart: {
    month: string
    value: number
  }[]
}

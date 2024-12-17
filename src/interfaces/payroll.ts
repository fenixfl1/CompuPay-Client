export interface PayrollParameters {
  OPERATION_ID_CREATE_ADJUSTMENTS: string
  OPERATION_ID_PROCESS_PAYROLL: string
  ID_OPERACION_CREAR_NOMINA: string
  OPERATION_ID_REMOVE_PAYROLL_ENTRY: string
}

export interface Payroll {
  PAYROLL_ID?: number
  PAYROLL_PERIOD?: string
  PERIOD_START: string
  PERIOD_END: string
  PAYMENT_DATE: string
  STATE: string
  CREATED_AT?: string
  CREATED_BY?: string
}

export interface PayrollEntry {
  AFP: number
  AVATAR?: string
  BONUS: number
  CREATED_AT: string
  CREATED_BY: string
  CURRENCY: string
  DEDUCTIONS: number
  DESC_STATUS: string
  DISCOUNT: number
  FULL_NAME: string
  ISR: number
  NET_SALARY: number
  PAYROLL: number
  PAYROLL_ENTRY_ID: number
  SALARY: number
  SFS: number
  STATE: string
  STATUS: string
  UPDATED_AT: string
  UPDATED_BY: string
  USER: string
  OVERTIMES: number
  VACATIONS: number
  OTHER_DISCOUNT: number
}

export interface Adjustment {
  ADJUSTMENT_ID?: number
  AMOUNT: number
  CREATED_AT?: string
  CREATED_BY?: string
  DESCRIPTION: string
  DESC_CONCEPT: string
  PAYROLL: number
  PAYROLL_ENTRY_ID: number
  PAYROLL_ID: number
  STATE: string
  TYPE: "B" | "D"
  USER: string
  USERNAME: string
}

export interface Deduction {
  DEDUCTION_ID: number
  LABEL: string
  STATE: string
  CREATED_AT: string
  UPDATED_AT?: string
  NAME: string
  PERCENTAGE: string
  DESCRIPTION: string
  CREATED_BY: string
  UPDATED_BY?: string
}

export interface PayrollConfig {
  ID: number
  DESC_PERIOD: string
  STATE: string
  CREATED_AT: string
  UPDATED_AT?: string
  PERIODS: number
  AUTOPAY: boolean
  DEDUCTION_PERIOD: number
  CREATED_BY: string
  UPDATED_BY?: string
}

export interface PayrollInfo {
  PAYROLL_ID: number
  LABEL: string
  NEXT_PAYMENT: string
  CURRENT_PERIOD: number
  PAYROLL_CONFIG: PayrollConfig
  PERIOD_START: string
  PERIOD_END: string
  INCLUDES_OVERTIME: boolean
  INCLUDES_LEAVES: boolean
}

export interface PayrollHistory extends Payroll {
  CALC_DEDUCTIONS: boolean
  STATUS: string
  ENTRIES: PayrollEntry &
    {
      PAYMENT_DETAILS: PaymentDetail
    }[]
}

export interface PaymentDetail {
  ID: number
  STATE: string
  CREATED_AT: string
  UPDATED_AT: string
  PERIOD: number
  CONCEPT_AMOUNT: string
  GROSS_SALARY: string
  COMMENT?: string
  CREATED_BY: string
  UPDATED_BY: string
  PAYROLL: number
  PAYROLL_ENTRY: number
  CONCEPT: number
  DESC_CONCEPT: string
  OPERATOR: "-" | "+"
}

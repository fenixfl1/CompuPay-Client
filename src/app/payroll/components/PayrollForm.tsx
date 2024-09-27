import ConditionalComponent from "@/components/ConditionalComponent"
import {
  CustomCheckboxGroup,
  CustomCol,
  CustomDivider,
  CustomForm,
  CustomFormItem,
  CustomModal,
  CustomRadioGroup,
  CustomRangePicker,
  CustomRow,
  CustomSpin,
  CustomText,
} from "@/components/custom"
import { customNotification } from "@/components/custom/customNotification"
import { assert } from "@/helpers/assert"
import errorHandler from "@/helpers/errorHandler"
import useCreatePayroll from "@/services/hooks/payroll/useCreatePayroll"
import useGetPayrollInfo from "@/services/hooks/payroll/useGetPayrollInfo"
import { useGetUserLIst } from "@/services/hooks/user/useGetUserList"
import { AdvancedCondition } from "@/services/interfaces"
import useModalStore from "@/stores/modalStore"
import usePayrollStore from "@/stores/payrollStore"
import useUserStore from "@/stores/userStore"
import { formItemLayout, labelColFullWidth } from "@/styles/breakpoints"
import { Form } from "antd"
import dayjs, { Dayjs } from "dayjs"
import React, { useCallback, useEffect, useMemo } from "react"

interface PayrollFormProps {
  onFinish?: () => void
}

const PayrollForm: React.FC<PayrollFormProps> = ({ onFinish }) => {
  const [form] = Form.useForm()
  const employeeSelection = Form.useWatch("EMPLOYEE_SELECTION", form)

  const { payrollInfo } = usePayrollStore()
  const { visible, setVisible } = useModalStore()
  const { users } = useUserStore()

  const { mutateAsync: createPayroll, isPending: isCreatePayrollPending } =
    useCreatePayroll()
  const { mutateAsync: getUserList, isPending: isEmployeesPending } =
    useGetUserLIst()

  const dateRange = useMemo(() => {
    let minDate = dayjs()
    let maxDate = dayjs()

    if (payrollInfo.PAYROLL_CONFIG && payrollInfo.CURRENT_PERIOD) {
      const daysInMonth = dayjs().daysInMonth()
      const periods = payrollInfo.PAYROLL_CONFIG.PERIODS
      const daysPerPeriod = Math.floor(daysInMonth / periods)
      const currentPeriod = payrollInfo.CURRENT_PERIOD
      let nextPeriod = currentPeriod + 1

      if (nextPeriod > periods) {
        nextPeriod = 1

        const startOfNextMonth = dayjs().add(1, "month").startOf("month")
        minDate = startOfNextMonth
        maxDate = minDate.add(daysPerPeriod - 1, "day")
      } else {
        const startOfMonth = dayjs().startOf("month")

        minDate = startOfMonth.add(currentPeriod * daysPerPeriod, "day")

        if (currentPeriod === periods) {
          minDate = dayjs().add(1, "month").startOf("month")
        }

        maxDate = minDate.add(daysPerPeriod - 1, "day")
      }
    }

    return { minDate, maxDate }
  }, [payrollInfo])

  const options = useMemo(() => {
    if (!users) return []

    return users.map((item) => ({
      label: `${item.NAME} ${item.LAST_NAME}  | @${item.USERNAME}`,
      value: item.USERNAME,
      style: { width: "100%" },
    }))
  }, [users])

  const handleGetEmployees = useCallback(() => {
    const condition: AdvancedCondition[] = [
      {
        condition: "A",
        dataType: "str",
        field: "STATE",
        operator: "=",
      },
      {
        condition: true,
        dataType: "bool",
        field: "IS_STAFF",
        operator: "=",
      },
      {
        condition: 0,
        dataType: "int",
        field: "SALARY",
        operator: ">",
      },
    ]

    getUserList({ page: 1, size: 200, condition })
  }, [])

  useEffect(handleGetEmployees, [handleGetEmployees])

  useEffect(() => {
    !visible && form.resetFields()
  }, [visible])

  const handleCreatePayroll = async () => {
    const { FECHAS, ...data } = await form.validateFields()

    assert<Dayjs[]>(FECHAS)

    try {
      const message = await createPayroll({
        EMPLOYEES: data.EMPLOYEES ?? data.EMPLOYEE_SELECTION,
        PERIOD_END: FECHAS[1]?.format("YYYY-MM-DD"),
        PERIOD_START: FECHAS[0]?.format("YYYY-MM-DD"),
        STATE: "A",
      })

      customNotification({
        message,
        description: "Operación exitosa",
        type: "success",
      })

      setVisible(false)
      onFinish?.()
    } catch (error) {
      errorHandler(error)
    }
  }

  return (
    <CustomModal
      open={visible}
      onCancel={() => setVisible(false)}
      onOk={handleCreatePayroll}
      title={"Iniciar Nómina"}
    >
      <CustomDivider />
      <CustomSpin spinning={isCreatePayrollPending || isEmployeesPending}>
        <CustomForm form={form} {...formItemLayout}>
          <CustomRow align={"top"}>
            <CustomCol xs={24}>
              <CustomFormItem
                label="Fechas"
                name="FECHAS"
                rules={[{ required: true }]}
                {...labelColFullWidth}
              >
                <CustomRangePicker
                  minDate={dateRange.minDate}
                  maxDate={dateRange.maxDate}
                />
              </CustomFormItem>
            </CustomCol>
            <CustomDivider>
              <CustomText strong>Seleccionar empleados</CustomText>
            </CustomDivider>
            <CustomCol xs={24}>
              <CustomFormItem
                colon={false}
                label={" "}
                labelCol={{ span: 4 }}
                name={"EMPLOYEE_SELECTION"}
                required={false}
                rules={[
                  { required: true, message: "Debe seleccionar una opción" },
                ]}
              >
                <CustomRadioGroup
                  options={[
                    { label: "Todos Los Empleados", value: "__all__" },
                    { label: "Selección parcial", value: "P" },
                  ]}
                />
              </CustomFormItem>
            </CustomCol>
            <ConditionalComponent condition={employeeSelection === "P"}>
              <CustomCol xs={24}>
                <CustomDivider />
                <CustomFormItem
                  colon={false}
                  label={" "}
                  labelCol={{ span: 4 }}
                  layout={"horizontal"}
                  name={"EMPLOYEES"}
                  required={false}
                  rules={[
                    {
                      required: true,
                      message: "Debe seleccionar por lo menos a un empleado",
                    },
                  ]}
                >
                  <CustomCheckboxGroup options={options} />
                </CustomFormItem>
              </CustomCol>
            </ConditionalComponent>
          </CustomRow>
        </CustomForm>
      </CustomSpin>
    </CustomModal>
  )
}

export default PayrollForm

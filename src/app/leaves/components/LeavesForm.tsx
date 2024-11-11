import React, { useEffect, useMemo, useState } from "react"
import {
  CustomCheckbox,
  CustomCol,
  CustomDatePicker,
  CustomDivider,
  CustomForm,
  CustomFormItem,
  CustomInputNumber,
  CustomModal,
  CustomRow,
  CustomSelect,
  CustomSpin,
  CustomTextArea,
} from "@/components/custom"
import { customNotification } from "@/components/custom/customNotification"
import errorHandler from "@/helpers/errorHandler"
import { normalizeCheckBox } from "@/helpers/form-item-normalizers"
import formatter from "@/helpers/formatter"
import useDebounce from "@/hooks/useDebounce"
import useCreateLeave from "@/services/hooks/leaves/useCreateLeave"
import useUpdateLeave from "@/services/hooks/leaves/useUpdateLeave"
import { useGetUserLIst } from "@/services/hooks/user/useGetUserList"
import useLeaveStore from "@/stores/leaveStore"
import useModalStore from "@/stores/modalStore"
import {
  defaultBreakpoints,
  formItemLayout,
  labelColFullWidth,
} from "@/styles/breakpoints"
import { Form, FormInstance } from "antd"
import dayjs from "dayjs"

interface LeavesFormProps {
  form: FormInstance
}

const LeavesForm: React.FC<LeavesFormProps> = ({ form }) => {
  const startDate = Form.useWatch("START_DATE", form)
  const includeWeekend = Form.useWatch("INCLUDE_WEEKEND", form)
  const days = Form.useWatch("DAYS", form)
  const isPaid = Form.useWatch("IS_PAID", form)
  const [searchKey, setSearchKey] = useState("")
  const debounce = useDebounce(searchKey)
  const { visible, setVisible } = useModalStore()
  const { leave } = useLeaveStore()

  const { mutate: getUser, data } = useGetUserLIst()
  const { mutateAsync: updateLeave, isPending: isUpdatePending } =
    useUpdateLeave()
  const { mutateAsync: createLeave, isPending: isCreatePending } =
    useCreateLeave()

  const toggleVisibility = () => setVisible(!visible)

  const userOptions = data?.data?.map((user) => ({
    label: `${user?.NAME} ${user.LAST_NAME} - @${user.USERNAME} | ${formatter({ value: user.GROSS_SALARY ?? 0, format: "currency", prefix: "RD" })}`,
    value: user.USERNAME,
  }))

  useEffect(() => {
    if (leave?.LEAVE_ID) {
      form.setFieldsValue({
        ...leave,
        START_DATE: dayjs(leave.START_DATE),
        END_DATE: dayjs(leave.END_DATE),
      })
    }
  }, [leave])

  useEffect(() => {
    getUser({
      page: 1,
      size: 15,
      condition: [
        {
          condition: "A",
          field: "STATE",
          dataType: "str",
          operator: "=",
        },
        {
          condition: debounce,
          field: ["NAME", "LAST_NAME", "USERNAME"],
          dataType: "str",
          operator: "ILIKE",
        },
      ],
    })
  }, [debounce])

  const getEndDate = useMemo(() => {
    if (!startDate || !days) return
    let daysCount = 0
    let date = dayjs(startDate)

    while (daysCount < days) {
      date = date.add(1, "day")

      if (includeWeekend || (date.day() !== 0 && date.day() !== 6)) {
        daysCount++
      }
    }

    form.setFieldsValue({ END_DATE: date })

    return date
  }, [startDate, days, includeWeekend])

  const handleOnFinish = async () => {
    try {
      let response: string
      const data = await form.validateFields()

      data.START_DATE = data.START_DATE.format("YYYY-MM-DD")
      data.END_DATE = data.END_DATE.format("YYYY-MM-DD")

      if (!!leave.LEAVE_ID) {
        const newData = { ...leave, ...data }

        delete newData.CONCEPT
        delete newData.CONCEPT_ID
        delete newData.EMPLOYEE
        delete newData.CREATED_AT
        delete newData.UPDATED_AT
        delete newData.CREATED_BY
        delete newData.UPDATED_BY

        response = await updateLeave({ ...newData })
      } else {
        response = await createLeave({ ...data })
      }

      customNotification({
        message: "Operación exitosa",
        description: response,
      })
      setVisible(false)
    } catch (error) {
      errorHandler(error)
    }
  }

  return (
    <CustomModal
      closable={false}
      width={"45%"}
      open={visible}
      onCancel={toggleVisibility}
      onOk={handleOnFinish}
    >
      <CustomSpin spinning={isCreatePending}>
        <CustomForm form={form} {...formItemLayout}>
          <CustomRow justify={"start"}>
            <CustomDivider />
            <CustomCol xs={24}>
              <CustomFormItem
                label={"Empleado"}
                name={"EMPLOYEE"}
                rules={[{ required: true }]}
                {...labelColFullWidth}
              >
                <CustomSelect
                  disabled={!!leave?.LEAVE_ID}
                  options={userOptions}
                  placeholder={"Seleccionar empleado"}
                  onSearch={setSearchKey}
                />
              </CustomFormItem>
            </CustomCol>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem
                label={"Razón"}
                name={"CONCEPT_ID"}
                rules={[{ required: true }]}
              >
                <CustomSelect
                  disabled={!!leave?.LEAVE_ID}
                  options={[
                    {
                      label: "Vacaciones",
                      value: 7,
                    },
                    { label: "Salud", value: 8 },
                    { label: "Ausencia", value: 9 },
                    { label: "Otro", value: 10 },
                  ]}
                  placeholder={"Seleccionar la razón"}
                />
              </CustomFormItem>
            </CustomCol>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem
                label={" "}
                name={"IS_PAID"}
                colon={false}
                getValueFromEvent={normalizeCheckBox}
                valuePropName={"checked"}
                tooltip={
                  "Marca si el tipo de ausencia tendrá una remuneración adicional al salario. Al marcarlo el campo de monto será obligatorio."
                }
              >
                <CustomCheckbox>¿Será remunerado?</CustomCheckbox>
              </CustomFormItem>
            </CustomCol>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem
                label={"Días"}
                name={"DAYS"}
                rules={[{ required: true }]}
              >
                <CustomInputNumber
                  format={{ format: "range" }}
                  placeholder={"Días"}
                  min={1}
                />
              </CustomFormItem>
            </CustomCol>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem
                getValueFromEvent={normalizeCheckBox}
                label={" "}
                colon={false}
                name={"INCLUDE_WEEKEND"}
                valuePropName={"checked"}
              >
                <CustomCheckbox>Contar fines de semanas</CustomCheckbox>
              </CustomFormItem>
            </CustomCol>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem
                label={"Inicio"}
                name={"START_DATE"}
                rules={[{ required: true }]}
              >
                <CustomDatePicker
                  width={"100%"}
                  placeholder={"Fecha de inicio"}
                />
              </CustomFormItem>
            </CustomCol>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem
                label={"Fin"}
                name={"END_DATE"}
                rules={[{ required: true }]}
                initialValue={getEndDate}
              >
                <CustomDatePicker
                  minDate={getEndDate}
                  maxDate={getEndDate}
                  width={"100%"}
                  placeholder={"Fecha de final"}
                />
              </CustomFormItem>
            </CustomCol>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem
                label={"Monto"}
                name={"AMOUNT"}
                rules={[{ required: isPaid }]}
              >
                <CustomInputNumber
                  min={isPaid ? 1 : undefined}
                  width={"100%"}
                  format={{ format: "currency", currency: "RD" }}
                />
              </CustomFormItem>
            </CustomCol>
            <CustomCol xs={24}>
              <CustomFormItem
                label={"Comentario"}
                name={"COMMENT"}
                {...labelColFullWidth}
              >
                <CustomTextArea placeholder={"Escribe un comentario"} />
              </CustomFormItem>
            </CustomCol>
          </CustomRow>
        </CustomForm>
      </CustomSpin>
    </CustomModal>
  )
}

export default LeavesForm

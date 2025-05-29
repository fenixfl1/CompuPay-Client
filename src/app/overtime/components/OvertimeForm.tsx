import {
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
import { getTime, TIME_FORMAT } from "@/helpers/date-helpers"
import errorHandler from "@/helpers/errorHandler"
import useDebounce from "@/hooks/useDebounce"
import useCreateOvertime from "@/services/hooks/overtime/useCreateOvertime"
import useUpdateOvertime from "@/services/hooks/overtime/useUpdateOvertime"
import { useGetUserLIst } from "@/services/hooks/user/useGetUserList"
import useModalStore from "@/stores/modalStore"
import useOvertimeStore from "@/stores/overtimes"
import useMenuOptionStore from "@/stores/useMenuOptionStore"
import {
  defaultBreakpoints,
  formItemLayout,
  labelColFullWidth,
} from "@/styles/breakpoints"
import { Form } from "antd"
import dayjs from "dayjs"
import React, { useEffect, useState } from "react"

const OvertimeForm: React.FC = () => {
  const [form] = Form.useForm()
  const [searchKey, setSearchKey] = useState("")
  const debounce = useDebounce(searchKey)

  const { mutate: getUser, data } = useGetUserLIst()
  const { mutateAsync: createOvertime, isPending: isCreatePending } =
    useCreateOvertime()
  const { mutateAsync: updateOvertime, isPending: isUpdatePending } =
    useUpdateOvertime()

  const { parameters } = useMenuOptionStore<{
    ID_CONCEPTO_HORAS_EXTRAS: string
  }>()

  const { visible, setVisible } = useModalStore()
  const { overtime } = useOvertimeStore()

  const userOptions = data?.data?.map((user) => ({
    label: `${user?.NAME} ${user.LAST_NAME} - @${user.USERNAME}`,
    value: user.USERNAME,
  }))

  useEffect(() => {
    if (overtime?.OVERTIME_ID) {
      form.setFieldsValue({
        ...overtime,
        DATE: dayjs(overtime.DATE),
        HOURS: dayjs(overtime.TIME, TIME_FORMAT),
      })
    }
  }, [overtime])

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

  const toggleVisibility = () => setVisible(!visible)

  const handleOnFinish = async () => {
    try {
      let message: string
      const data = await form.validateFields()

      data.STATE = "A"
      data.HOURS = getTime(data.HOURS)
      data.CONCEPT_ID = Number(parameters?.ID_CONCEPTO_HORAS_EXTRAS)
      data.DATE = data.DATE.format("YYYY-MM-DD")

      if (overtime?.OVERTIME_ID) {
        const newData = { ...overtime, ...data }

        delete newData.CREATED_AT
        delete newData.CREATED_BY
        delete newData.UPDATED_AT
        delete newData.UPDATED_BY
        delete newData.CONCEPT
        delete newData.TIME
        delete newData.EMPLOYEE

        message = await updateOvertime(newData)
      } else {
        message = await createOvertime(data)
      }

      customNotification({
        message: "Operación exitosa",
        description: message,
      })
      toggleVisibility()
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
      title={`${overtime?.OVERTIME_ID ? "Editar" : "Registrar"} horas extra`}
    >
      <CustomSpin spinning={isCreatePending || isUpdatePending}>
        <CustomForm form={form} {...formItemLayout}>
          <CustomRow justify={"start"}>
            <CustomCol xs={24}>
              <CustomFormItem
                label={"Empleado..."}
                name={"EMPLOYEE"}
                rules={[{ required: true }]}
                {...labelColFullWidth}
              >
                <CustomSelect
                  options={userOptions}
                  placeholder={"Seleccionar empleado"}
                  onSearch={setSearchKey}
                />
              </CustomFormItem>
            </CustomCol>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem
                label={"Fecha"}
                name={"DATE"}
                rules={[{ required: true }]}
              >
                <CustomDatePicker maxDate={dayjs()} placeholder={"Fecha"} />
              </CustomFormItem>
            </CustomCol>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem
                label={"Horas"}
                name={"HOURS"}
                rules={[{ required: true }]}
              >
                <CustomDatePicker
                  width={null as never}
                  format={TIME_FORMAT}
                  picker={"time"}
                  placeholder={"Seleccionar horas"}
                />
              </CustomFormItem>
            </CustomCol>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem
                label={"Costo por horas"}
                name={"RATE"}
                rules={[{ required: true }]}
              >
                <CustomInputNumber
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

export default OvertimeForm

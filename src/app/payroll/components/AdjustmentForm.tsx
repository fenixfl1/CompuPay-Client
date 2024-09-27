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
  CustomTitle,
} from "@/components/custom"
import { customNotification } from "@/components/custom/customNotification"
import errorHandler from "@/helpers/errorHandler"
import useDebounce from "@/hooks/useDebounce"
import useResetFormOnCloseModal from "@/hooks/useResetFormOnCloseModal"
import { Adjustment } from "@/interfaces/payroll"
import useCreateAdjustment from "@/services/hooks/payroll/useCreateAjustment"
import { useGetUserLIst } from "@/services/hooks/user/useGetUserList"
import {
  defaultBreakpoints,
  formItemLayout,
  labelColFullWidth,
} from "@/styles/breakpoints"
import { FormInstance } from "antd"
import React, { useCallback, useEffect, useMemo, useState } from "react"

interface AdjustmentFormProps {
  form: FormInstance
  loading?: boolean
  onCancel?: () => void
  onFinish?: () => void
  open: boolean
  record?: Adjustment
}

const AdjustmentForm: React.FC<AdjustmentFormProps> = ({
  form,
  loading,
  onCancel,
  onFinish,
  open,
  record,
}) => {
  const [searchValue, setSearchValue] = useState("")
  const debounce = useDebounce(searchValue)
  const {
    mutateAsync: getUserList,
    isPending,
    data: { data: userList },
  } = useGetUserLIst()

  useResetFormOnCloseModal(form, open)

  const isEditing = !!record

  useEffect(() => {
    isEditing && form.setFieldsValue({ ...record })
  }, [record])

  const handleSearchEmployees = useCallback(() => {
    getUserList({
      page: 1,
      size: 10,
      fields: ["NAME", "LAST_NAME", "USERNAME"],
      condition: [
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
          condition: debounce,
          dataType: "str",
          field: ["NAME", "LAST_NAME", "USERNAME"],
          operator: "ILIKE",
        },
      ],
    })
  }, [debounce])

  useEffect(handleSearchEmployees, [handleSearchEmployees])

  const options = useMemo(() => {
    return userList?.map((user) => ({
      label: `${user.NAME} ${user.LAST_NAME} - @${user.USERNAME}`,
      value: user.USERNAME,
    }))
  }, [userList])

  return (
    <CustomModal
      width={"680px"}
      open={open}
      onCancel={onCancel}
      onOk={onFinish}
      title={"Nuevo Ajustamiento"}
      okText={isEditing ? "Actualizar" : undefined}
    >
      <CustomDivider />
      <CustomSpin spinning={loading}>
        <CustomForm form={form} {...formItemLayout}>
          <CustomRow justify={"start"}>
            <CustomCol xs={24}>
              <CustomFormItem
                label={"Empleado"}
                name={"USERNAME"}
                rules={[{ required: true }]}
                {...labelColFullWidth}
              >
                <CustomSelect
                  disabled={isEditing}
                  loading={isPending}
                  placeholder={"Seleccionar empleado"}
                  options={options}
                  onSearch={setSearchValue}
                />
              </CustomFormItem>
            </CustomCol>

            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem
                label={"Tipo"}
                name={"TYPE"}
                rules={[{ required: true }]}
              >
                <CustomSelect
                  allowClear
                  placeholder={"Seleccionar tipo de ajustamiento"}
                  options={[
                    { label: "Bono", value: "B" },
                    { label: "Descuento", value: "D" },
                  ]}
                />
              </CustomFormItem>
            </CustomCol>
            <CustomCol {...defaultBreakpoints}>
              <CustomFormItem
                label={"Monto"}
                name={"AMOUNT"}
                rules={[{ required: true }]}
              >
                <CustomInputNumber
                  width={"100%"}
                  format={{ format: "currency", currency: "RD" }}
                />
              </CustomFormItem>
            </CustomCol>
            <CustomCol xs={24}>
              <CustomFormItem
                label={"Comentario"}
                name={"DESCRIPTION"}
                rules={[{ required: true }]}
                {...labelColFullWidth}
              >
                <CustomTextArea placeholder={"Escriba un comentario..."} />
              </CustomFormItem>
            </CustomCol>
          </CustomRow>
        </CustomForm>
      </CustomSpin>
    </CustomModal>
  )
}

export default AdjustmentForm

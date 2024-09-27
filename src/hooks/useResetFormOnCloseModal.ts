import { FormInstance } from "antd"
import { useEffect, useRef } from "react"

const useResetFormOnCloseModal = (
  form: FormInstance,
  visible: boolean
): void => {
  const prevVisibleRef = useRef<boolean>(visible)

  useEffect(() => {
    prevVisibleRef.current = visible
  }, [visible])

  const prevVisible = prevVisibleRef.current

  useEffect(() => {
    if (!visible && prevVisible) {
      form.resetFields()
    }
  }, [visible, form, prevVisible])
}

export default useResetFormOnCloseModal

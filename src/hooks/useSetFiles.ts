import { FormInstance } from "antd"
import { useCallback, useEffect, useMemo, useRef } from "react"

export type FileType = {
  url: string
  name: string
}

interface ImagesFile {
  name: string
  type: string
  uid: string
  url: string
}

function useSetFiles(
  files: FileType[],
  form: FormInstance,
  name = "FILE"
): void {
  const urlRef = useRef<FileType[]>(files)
  const imagesRef = useRef<ImagesFile[]>([])

  useEffect(() => {
    urlRef.current = files
  }, [files])

  const urls = urlRef.current

  imagesRef.current = useMemo(() => {
    if (urls.length) {
      return urls.map(({ url, name }) => ({
        name,
        type: url?.split(",")[0]?.split(":")[1]?.split(";")[0],
        uid: `${Date.now()}`,
        url,
      }))
    }

    return []
  }, [urls])

  const images = imagesRef.current

  const handleSetFiles = useCallback(() => {
    if (images.length) {
      form.setFieldsValue({
        [name]: { fileList: images[0] },
      })
    }
  }, [images])

  useEffect(handleSetFiles, [handleSetFiles])
}

export default useSetFiles

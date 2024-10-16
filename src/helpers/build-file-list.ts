interface CreateObjectProps {
  base64OrUrl?: string
  name?: string
}

function createUploadObject({ base64OrUrl, name = "file" }: CreateObjectProps) {
  if (!base64OrUrl || base64OrUrl?.length <= 2) return

  const isBase64 = base64OrUrl?.startsWith("data:")

  let type = ""
  let url = ""

  if (isBase64) {
    type = base64OrUrl.split(",")[0].match(/:(.*?);/)?.[1] as string
    url = base64OrUrl
  } else {
    url = base64OrUrl
    type = `image/${base64OrUrl.split(".").pop()}`
  }

  return [
    {
      type,
      uid: `rc-upload-${Date.now()}`,
      name,
      status: "done",
      url,
    },
  ]
}

export default createUploadObject

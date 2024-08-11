import { User } from "@/interfaces/user"

function base64ToBlob(base64: string, mimeType: string) {
  if (!base64) return new Blob()
  const byteCharacters = atob(base64?.split(",")[1])
  const byteNumbers = new Array(byteCharacters.length)

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }

  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}

function createUploadObject(base64: string, user: User) {
  const fileName = `${user.USERNAME}_resume`
  const type = base64.split(",")[0].match(/:(.*?);/)?.[1] as string
  const blob = base64ToBlob(base64, type)
  const file = new File([blob], fileName, { type })

  return [
    {
      uid: `rc-upload-${Date.now()}`,
      name: file.name,
      status: "done",
      url: `/resume/${user.USERNAME}`,
    },
  ]
}

export default createUploadObject

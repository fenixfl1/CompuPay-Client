import errorHandler from "./errorHandler"

export async function openReport(
  stringFile: string,
  rp_name: string = "Reporte"
) {
  try {
    const bytesCharacter = atob(stringFile)
    const byteNumbers = Array.from(bytesCharacter, (char) => char.charCodeAt(0))
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: "application/pdf" })

    const pdfUrl = URL.createObjectURL(blob)
    const newWindow = window.open(pdfUrl)
    if (newWindow) {
      newWindow.document.title = rp_name
    }
  } catch (error) {
    errorHandler(error)
  }
}

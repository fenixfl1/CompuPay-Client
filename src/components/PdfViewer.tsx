import React, { useEffect, useState } from "react"
import errorHandler from "@/helpers/errorHandler"

interface PdfViewerProps {
  stringFile: string
}

const PdfViewer: React.FC<PdfViewerProps> = ({ stringFile }) => {
  const [pdfUrl, setPdfUrl] = useState("")

  useEffect(() => {
    const base64ToBlob = (base64: string) => {
      try {
        const byteCharacters = atob(base64.split(",")[1])
        const byteNumbers = new Array(byteCharacters.length)

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }

        const byteArray = new Uint8Array(byteNumbers)
        return new Blob([byteArray], { type: "application/pdf" })
      } catch (error) {
        errorHandler(error)
        return new Blob()
      }
    }

    const blob = base64ToBlob(stringFile)
    const url = URL.createObjectURL(blob)
    setPdfUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [stringFile])

  return (
    <div>
      <iframe src={pdfUrl} width="100%" height="750px"></iframe>
    </div>
  )
}

export default PdfViewer

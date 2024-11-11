import React from "react"
import { Worker, Viewer } from "@react-pdf-viewer/core"
import "@react-pdf-viewer/core/lib/styles/index.css" // Import the default styles
import { pdfjs } from "react-pdf"

interface PDFRenderProps {
  stringFile?: string
}

const PDFRender: React.FC<PDFRenderProps> = ({ stringFile }) => {
  const workerUrl =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js"
  return (
    <div>
      <Worker
        workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`}
      >
        <div>
          <Viewer fileUrl={`data:application/pdf;base64,${stringFile}`} />
        </div>
      </Worker>
    </div>
  )
}

export default PDFRender

import React from "react"

const textFormatter = (text: string) => {
  const regExpAt = /(@\w+)/g
  const regExpNum = /#([^#]+)#/g

  const parts = text.split(/(@\w+|#([^#]+)#)/g).filter(Boolean)

  return parts.map((part, index) => {
    if (regExpAt.test(part)) {
      return (
        <span key={index} style={{ color: "blue", fontWeight: "bold" }}>
          {part}
        </span>
      )
    }

    if (regExpNum.test(part)) {
      return <strong key={index}>{part.replace(/#/g, "")}</strong>
    }

    return part
  })
}

export default textFormatter

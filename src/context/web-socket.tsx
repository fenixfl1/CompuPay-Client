"use client"

import { SOCKET_NOTIFICATION_URL } from "@/constants/routes"
import { getSessionInfo, isLoggedIn } from "@/lib/session"
import React, { createContext, useContext, useEffect, useState } from "react"

const WebSocketContext = createContext<WebSocket | null>(null)

interface WebSocketProviderProps {
  children: React.ReactNode
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    if (!isLoggedIn()) return
    const ws = new WebSocket(
      `${SOCKET_NOTIFICATION_URL}/${getSessionInfo().USERNAME}/`
    )

    ws.onopen = () => {
      console.log("Connected")
    }

    ws.onclose = (e) => {
      // eslint-disable-next-line no-console
      console.log({ code: e.code })
    }

    setSocket(ws)

    return () => {
      ws.close()
    }
  }, [])

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = () => {
  return useContext(WebSocketContext)
}

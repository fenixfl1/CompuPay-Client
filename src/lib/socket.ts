// utils/socket.js
import { io, Socket } from "socket.io-client"
import { useEffect, useState } from "react"
import { DefaultEventsMap } from "@socket.io/component-emitter"

let socket: Socket | null

export const useSocket = (): Socket<
  DefaultEventsMap,
  DefaultEventsMap
> | null => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null)

  useEffect(() => {
    // Only initialize socket.io-client on the client-side
    if (!socket) {
      socket = io("ws://localhost:8000", {
        path: "/ws/notifications",
        transports: ["websocket"],
      })
      setSocketInstance(socket)
    }

    socket?.on("connect", () => {
      socket?.emit("join", "notifications")
    })

    // Cleanup the socket instance on component unmount
    return () => {
      if (socket) {
        socket.disconnect()
        socket = null
      }
    }
  }, [])

  return socketInstance
}

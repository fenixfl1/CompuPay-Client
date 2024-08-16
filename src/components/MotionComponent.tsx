import React from "react"
import { AnimatePresence, motion } from "framer-motion"

interface MotionComponentProps {
  children: React.ReactNode
  delay?: number
  mode?: "wait" | "sync" | "popLayout"
  key?: React.Key
}

const MotionComponent: React.FC<MotionComponentProps> = ({
  delay = 1,
  ...props
}) => {
  const transition = {
    duration: delay,
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={transition}
      {...props}
    >
      {props.children}
    </motion.div>
  )
}

export default MotionComponent

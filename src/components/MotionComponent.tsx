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
  mode = "sync",
  key,
  ...props
}) => {
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const pageTransition = {
    duration: delay,
  }

  return (
    <AnimatePresence initial presenceAffectsLayout mode={mode}>
      <motion.div
        key={key}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
      >
        {props.children}
      </motion.div>
    </AnimatePresence>
  )
}

export default MotionComponent

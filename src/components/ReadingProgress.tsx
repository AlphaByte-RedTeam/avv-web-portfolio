"use client"

import * as React from "react"
import { motion, useScroll } from "motion/react"

export function ReadingProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[100] print:hidden"
      style={{ scaleX: scrollYProgress }}
    />
  )
}

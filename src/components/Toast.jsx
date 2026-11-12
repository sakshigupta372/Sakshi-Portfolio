import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EVENTS } from '../lib/ui'

// Small confirmation pill ("Email copied", palette changes). Trigger with showToast().
const ToastHost = () => {
  const [message, setMessage] = useState('')
  useEffect(() => {
    let timer
    const onToast = (e) => {
      setMessage(e.detail?.message || '')
      clearTimeout(timer)
      timer = setTimeout(() => setMessage(''), 1800)
    }
    window.addEventListener(EVENTS.toast, onToast)
    return () => {
      window.removeEventListener(EVENTS.toast, onToast)
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[90] flex justify-center" role="status" aria-live="polite">
      <AnimatePresence>
        {message ? (
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper shadow-lg"
          >
            {message}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default ToastHost

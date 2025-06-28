'use client'

import { useEffect, useState } from 'react'
import { LoginModal } from '@/components/modals/login-modal'
import { useLoginModal } from '@/lib/hooks/use-login-modal'

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)
  const { isOpen, onClose } = useLoginModal()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <LoginModal isOpen={isOpen} onClose={onClose} />
    </>
  )
} 
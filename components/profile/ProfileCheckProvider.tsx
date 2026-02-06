"use client"

import { useState, useEffect, ReactNode } from "react"
import { ProfileCheckModal } from "./ProfileCheckModal"
import { getCompanyProfiles } from "@/lib/api/company-profiles"

interface ProfileCheckProviderProps {
  children: ReactNode
}

export function ProfileCheckProvider({ children }: ProfileCheckProviderProps) {
  const [showModal, setShowModal] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  const checkProfiles = async () => {
    try {
      const response = await getCompanyProfiles()
      if (response.items.length === 0) {
        setShowModal(true)
      }
    } catch (error) {
      // If error, don't block - might be auth issue
      console.error("Failed to check profiles:", error)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkProfiles()
  }, [])

  const handleProfileCreated = () => {
    setShowModal(false)
  }

  return (
    <>
      {children}
      <ProfileCheckModal
        open={showModal}
        onProfileCreated={handleProfileCreated}
      />
    </>
  )
}

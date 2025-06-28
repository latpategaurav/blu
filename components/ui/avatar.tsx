"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

// New UserAvatar component for showing last two digits
interface UserAvatarProps {
  phoneNumber?: string
  email?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function UserAvatar({ phoneNumber, email, size = 'md', className }: UserAvatarProps) {
  // Extract last two digits from phone number, or first two letters from email
  const getDisplayText = () => {
    if (phoneNumber && phoneNumber.length >= 2) {
      return phoneNumber.slice(-2)
    }
    if (email && email.length >= 2) {
      return email.slice(0, 2).toUpperCase()
    }
    return "US"
  }

  const sizeClasses = {
    sm: "size-8 text-xs",
    md: "size-10 text-sm", 
    lg: "size-12 text-base"
  }

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarFallback className="bg-[#081116] text-white font-medium">
        {getDisplayText()}
      </AvatarFallback>
    </Avatar>
  )
}

export { Avatar, AvatarImage, AvatarFallback, UserAvatar }

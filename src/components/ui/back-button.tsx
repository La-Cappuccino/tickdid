"use client"

import { ArrowLeftIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface BackButtonProps {
  className?: string
}

export function BackButton({ className }: BackButtonProps) {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "rounded-xl w-10 h-10",
        "hover:bg-violet-50 hover:text-violet-600",
        "transition-all duration-200",
        className
      )}
      onClick={() => router.back()}
    >
      <ArrowLeftIcon className="w-5 h-5" />
    </Button>
  )
} 
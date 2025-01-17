"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TimeAnalytics } from "./time-analytics"
import { BarChartIcon } from "@radix-ui/react-icons"

interface AnalyticsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AnalyticsDialog({ open, onOpenChange }: AnalyticsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto">
        <DialogHeader className="flex-row items-center gap-2 text-left border-b pb-4">
          <div className="p-2 rounded-xl bg-violet-100 w-fit">
            <BarChartIcon className="w-5 h-5 text-violet-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Time Analytics
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <TimeAnalytics />
        </div>
      </DialogContent>
    </Dialog>
  )
} 
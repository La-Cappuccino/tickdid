"use client"

import { TimeAnalytics } from "@/components/analytics/time-analytics"
import { BackButton } from "@/components/ui/back-button"

export default function AnalyticsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <BackButton />
        <h1 className="text-2xl font-bold text-gray-900">
          Time Analytics
        </h1>
      </div>
      <TimeAnalytics />
    </div>
  )
} 
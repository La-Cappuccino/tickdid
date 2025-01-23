"use client"

import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, startOfWeek, endOfWeek } from "date-fns"
import { cn } from "@/lib/utils"

const weekDays = [
  { key: "su", label: "Su" },
  { key: "mo", label: "Mo" },
  { key: "tu", label: "Tu" },
  { key: "we", label: "We" },
  { key: "th", label: "Th" },
  { key: "fr", label: "Fr" },
  { key: "sa", label: "Sa" }
]

export function MiniCalendar() {
  const currentDate = new Date()
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  
  const days = eachDayOfInterval({ 
    start: calendarStart,
    end: calendarEnd 
  })

  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="text-sm font-medium text-gray-600 mb-2">
        {format(currentDate, "MMMM yyyy")}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDays.map((day) => (
          <div key={day.key} className="text-xs text-gray-400">
            {day.label}
          </div>
        ))}
        {days.map((day, index) => (
          <div
            key={`${format(day, "yyyy-MM-dd")}-${index}`}
            className={cn(
              "text-xs rounded-md w-6 h-6 flex items-center justify-center",
              isToday(day) && "bg-violet-100 text-violet-600 font-medium",
              !isToday(day) && isSameMonth(day, currentDate) && "text-gray-600",
              !isSameMonth(day, currentDate) && "text-gray-300"
            )}
          >
            {format(day, "d")}
          </div>
        ))}
      </div>
    </div>
  )
} 
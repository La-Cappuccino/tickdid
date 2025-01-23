"use client"

import { useState, useEffect } from "react"
import { useTaskStore } from "@/lib/store/task-store"
import { Button } from "./button"
import { PlayIcon, StopIcon, TimerIcon } from "@radix-ui/react-icons"

interface TimeTrackerProps {
  taskId: string
}

export function TimeTracker({ taskId }: TimeTrackerProps) {
  const task = useTaskStore(state => state.tasks.find(t => t.id === taskId))
  const startTimeTracking = useTaskStore(state => state.startTimeTracking)
  const stopTimeTracking = useTaskStore(state => state.stopTimeTracking)
  const [elapsedTime, setElapsedTime] = useState(task?.timeTracking?.totalTime || 0)

  useEffect(() => {
    if (!task?.timeTracking?.isTracking) {
      setElapsedTime(task?.timeTracking?.totalTime || 0)
      return
    }

    const interval = setInterval(() => {
      const currentLog = task.timeTracking.logs[task.timeTracking.logs.length - 1]
      const elapsed = Math.round((new Date().getTime() - currentLog.startTime.getTime()) / 60000)
      setElapsedTime((task.timeTracking.totalTime || 0) + elapsed)
    }, 1000)

    return () => clearInterval(interval)
  }, [task?.timeTracking?.isTracking, task?.timeTracking?.totalTime, task?.timeTracking?.logs])

  if (!task) return null

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="flex items-center gap-2">
      <TimerIcon className="h-4 w-4 text-gray-500" />
      <span className="text-sm text-gray-600 min-w-[80px]">
        {formatTime(elapsedTime)}
      </span>
      <Button
        variant="ghost"
        size="sm"
        className={task.timeTracking?.isTracking ? "text-red-500" : "text-green-500"}
        onClick={() => {
          if (task.timeTracking?.isTracking) {
            stopTimeTracking(taskId)
          } else {
            startTimeTracking(taskId)
          }
        }}
      >
        {task.timeTracking?.isTracking ? (
          <StopIcon className="h-4 w-4" />
        ) : (
          <PlayIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
} 
"use client"

import { useState, useMemo } from "react"
import { Task, Priority, useTaskStore } from "@/lib/store/task-store"
import { Button } from "@/components/ui/button"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  DragHandleDots2Icon,
} from "@radix-ui/react-icons"
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  subWeeks,
  addWeeks,
  parseISO,
  startOfDay,
  endOfDay,
  isWithinInterval,
  differenceInDays,
} from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { TaskDialog } from "@/components/ui/task-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  DndContext, 
  DragEndEvent,
  DragOverlay,
  useDraggable,
  useDroppable,
  DragStartEvent,
  closestCenter,
} from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { restrictToWindowEdges } from '@dnd-kit/modifiers'

interface CalendarViewProps {
  tasks: Task[]
}

const priorityColors: Record<Priority, { bg: string, text: string }> = {
  p1: { bg: "bg-red-50", text: "text-red-600" },
  p2: { bg: "bg-orange-50", text: "text-orange-600" },
  p3: { bg: "bg-yellow-50", text: "text-yellow-600" },
  p4: { bg: "bg-blue-50", text: "text-blue-600" },
}

function getTaskSpan(task: Task, currentDay: Date): {
  isStart: boolean
  isEnd: boolean
  isMiddle: boolean
  spanDays: number
} {
  const start = task.dueDate ? startOfDay(new Date(task.dueDate)) : null
  const end = task.endDate ? startOfDay(new Date(task.endDate)) : start
  const current = startOfDay(currentDay)

  if (!start || !end) return { isStart: true, isEnd: true, isMiddle: false, spanDays: 1 }

  const spanDays = differenceInDays(end, start) + 1
  const isStart = isSameDay(start, current)
  const isEnd = isSameDay(end, current)
  const isMiddle = !isStart && !isEnd && isWithinInterval(current, { start, end })

  return { isStart, isEnd, isMiddle, spanDays }
}

export function CalendarView({ tasks }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [viewMode, setViewMode] = useState<"month" | "week">("month")
  const [activeId, setActiveId] = useState<string | null>(null)
  const updateTask = useTaskStore((state) => state.updateTask)

  // Calculate calendar days using useMemo
  const days = useMemo(() => {
    const start = viewMode === "week" ? startOfWeek(currentDate) : startOfWeek(startOfMonth(currentDate))
    const end = viewMode === "week" ? endOfWeek(currentDate) : endOfWeek(endOfMonth(currentDate))
    return eachDayOfInterval({ start, end })
  }, [currentDate, viewMode])

  // Memoize task filtering function
  const getTasksForDay = useMemo(() => (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false
      const start = startOfDay(new Date(task.dueDate))
      const end = task.endDate ? startOfDay(new Date(task.endDate)) : start
      const current = startOfDay(date)
      return isWithinInterval(current, { start, end })
    })
  }, [tasks])

  const handlePreviousPeriod = () => {
    setCurrentDate(viewMode === "week" ? subWeeks(currentDate, 1) : subMonths(currentDate, 1))
  }

  const handleNextPeriod = () => {
    setCurrentDate(viewMode === "week" ? addWeeks(currentDate, 1) : addMonths(currentDate, 1))
  }

  const handleToday = () => setCurrentDate(new Date())

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over) return

    const taskId = active.id as string
    const newDate = over.id as string
    const task = tasks.find(t => t.id === taskId)
    
    if (task) {
      updateTask(taskId, {
        ...task,
        dueDate: parseISO(newDate)
      })
    }
  }

  const activeTask = useMemo(() => 
    activeId ? tasks.find(task => task.id === activeId) : null
  , [activeId, tasks])

  const weekDays = useMemo(() => [
    { key: "sun", label: "Sun" },
    { key: "mon", label: "Mon" },
    { key: "tue", label: "Tue" },
    { key: "wed", label: "Wed" },
    { key: "thu", label: "Thu" },
    { key: "fri", label: "Fri" },
    { key: "sat", label: "Sat" }
  ], [])

  return (
    <div className="flex flex-col h-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">
            {viewMode === "week" 
              ? `Week of ${format(startOfWeek(currentDate), "MMM d")} - ${format(endOfWeek(currentDate), "MMM d, yyyy")}`
              : format(currentDate, "MMMM yyyy")
            }
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className={cn(
              "h-8 text-sm",
              "hover:bg-violet-50 hover:text-violet-600 hover:border-violet-500",
              "transition-all duration-300"
            )}
          >
            Today
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "month" ? "week" : "month")}
            className={cn(
              "h-8 text-sm",
              "hover:bg-violet-50 hover:text-violet-600 hover:border-violet-500",
              "transition-all duration-300"
            )}
          >
            {viewMode === "month" ? "Week View" : "Month View"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePreviousPeriod}
            className="h-8 w-8 rounded-lg hover:bg-gray-100"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextPeriod}
            className="h-8 w-8 rounded-lg hover:bg-gray-100"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
        modifiers={[restrictToWindowEdges]}
      >
        {/* Calendar Grid */}
        <div className="grid gap-px bg-gray-200 rounded-lg overflow-hidden flex-1">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 bg-gray-50">
            {weekDays.map((day) => (
              <div
                key={day.key}
                className="p-2 text-center text-sm font-medium text-gray-500"
              >
                {day.label}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className={cn(
            "grid grid-cols-7 auto-rows-fr bg-gray-200 gap-px flex-1",
            viewMode === "week" ? "grid-rows-1" : "grid-rows-6"
          )}>
            {days.map((day) => {
              const dayTasks = getTasksForDay(day)
              const isSelected = selectedDate && isSameDay(day, selectedDate)
              const droppableId = day.toISOString()
              const { isOver, setNodeRef: setDroppableRef } = useDroppable({
                id: droppableId,
              })

              return (
                <div
                  ref={setDroppableRef}
                  key={`day-${droppableId}`}
                  className={cn(
                    "bg-white p-2 min-h-[120px] relative",
                    "transition-colors duration-300",
                    isSelected && "bg-violet-50",
                    !isSameMonth(day, currentDate) && "bg-gray-50",
                    isOver && "bg-violet-100"
                  )}
                  onClick={() => {
                    setSelectedDate(day)
                    setTaskDialogOpen(true)
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isToday(day) && "text-violet-600",
                        isSelected && "text-violet-600",
                        !isSameMonth(day, currentDate) && "text-gray-400"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    {isToday(day) && (
                      <Badge
                        variant="secondary"
                        className="bg-violet-100 text-violet-600 text-xs"
                      >
                        Today
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    {dayTasks.map((task) => (
                      <DraggableTask key={`task-${task.id}`} task={task} day={day} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <DragOverlay>
          {activeTask && (
            <div
              className={cn(
                "text-xs p-1 rounded truncate shadow-lg",
                "flex items-center gap-1",
                "bg-white border border-gray-200",
                priorityColors[activeTask.priority]?.text
              )}
            >
              <DragHandleDots2Icon className="w-3 h-3" />
              <span className="flex-1 truncate">{activeTask.title}</span>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Task Dialog */}
      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        defaultDate={selectedDate}
      />
    </div>
  )
}

function DraggableTask({ task, day }: { task: Task; day: Date }) {
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
  })

  const { isStart, isEnd, isMiddle, spanDays } = getTaskSpan(task, day)
  const updateTask = useTaskStore((state) => state.updateTask)

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
    transition: 'transform 200ms ease',
  } : undefined

  const handleResizeEnd = (direction: 'start' | 'end') => (e: React.MouseEvent) => {
    e.stopPropagation()
    const newDate = day
    if (direction === 'start') {
      updateTask(task.id, { ...task, dueDate: newDate })
    } else {
      updateTask(task.id, { ...task, endDate: newDate })
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={setDraggableRef}
            {...listeners}
            {...attributes}
            style={style}
            className={cn(
              "text-xs p-1 rounded-sm cursor-move group relative",
              "flex items-center gap-1",
              "transform transition-all duration-200",
              task.completed
                ? "line-through text-gray-400 bg-gray-50"
                : cn(
                    priorityColors[task.priority]?.bg || priorityColors.p4.bg,
                    priorityColors[task.priority]?.text || priorityColors.p4.text,
                    isMiddle && "rounded-none",
                    !isStart && "rounded-l-none border-l border-white/50",
                    !isEnd && "rounded-r-none border-r border-white/50"
                  ),
              isDragging && "opacity-50 scale-95",
              spanDays > 1 && "font-medium"
            )}
          >
            {isStart && (
              <div
                key={`resize-start-${task.id}`}
                className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-violet-400 rounded-l"
                onClick={handleResizeEnd('start')}
              />
            )}
            {isEnd && (
              <div
                key={`resize-end-${task.id}`}
                className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-violet-400 rounded-r"
                onClick={handleResizeEnd('end')}
              />
            )}
            <DragHandleDots2Icon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="flex-1 truncate">{task.title}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-[300px]">
          <div className="space-y-1">
            <p className="font-medium">{task.title}</p>
            {task.description && (
              <p className="text-sm text-gray-500">{task.description}</p>
            )}
            <div className="flex items-center gap-2 text-xs">
              <Badge 
                variant="outline" 
                className={cn(
                  priorityColors[task.priority]?.text,
                  "border-current"
                )}
              >
                {task.priority.toUpperCase()}
              </Badge>
              {task.tags?.map(tag => (
                <Badge 
                  key={`task-tag-${tag.id}`} 
                  variant="secondary" 
                  className="bg-gray-100"
                >
                  {tag.name}
                </Badge>
              ))}
              {spanDays > 1 && (
                <Badge 
                  variant="outline" 
                  className="border-violet-500 text-violet-600"
                >
                  {spanDays} days
                </Badge>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
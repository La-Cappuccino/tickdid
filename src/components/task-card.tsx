"use client"

import { useState } from "react"
import { Task, useTaskStore } from "@/lib/store/task-store"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { 
  CalendarIcon, 
  Pencil1Icon, 
  TrashIcon, 
  CheckIcon, 
  Cross2Icon,
  DotsHorizontalIcon
} from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TagPicker } from "@/components/ui/tag-picker"

interface TaskCardProps {
  task: Task
}

const priorityColors = {
  p1: "text-red-500 border-red-500",
  p2: "text-orange-500 border-orange-500",
  p3: "text-yellow-500 border-yellow-500",
  p4: "text-blue-500 border-blue-500",
}

const priorityBgColors = {
  p1: "bg-red-50",
  p2: "bg-orange-50",
  p3: "bg-yellow-50",
  p4: "bg-blue-50",
}

const priorityBorderColors = {
  p1: "border-l-4 border-l-red-500",
  p2: "border-l-4 border-l-orange-500",
  p3: "border-l-4 border-l-yellow-500",
  p4: "border-l-4 border-l-blue-500",
}

const priorityLabels = {
  p1: "Urgent",
  p2: "High",
  p3: "Medium",
  p4: "Low",
}

export function TaskCard({ task }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)
  const [editedDescription, setEditedDescription] = useState(task.description)
  const [editedDueDate, setEditedDueDate] = useState<Date | undefined>(task.dueDate)
  const [editedPriority, setEditedPriority] = useState(task.priority)
  const [editedTags, setEditedTags] = useState(task.tags || [])
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const { toggleTask, deleteTask, updateTask } = useTaskStore()

  const handleSave = () => {
    updateTask(task.id, {
      title: editedTitle,
      description: editedDescription,
      dueDate: editedDueDate,
      priority: editedPriority,
      tags: editedTags,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedTitle(task.title)
    setEditedDescription(task.description)
    setEditedDueDate(task.dueDate)
    setEditedPriority(task.priority)
    setEditedTags(task.tags || [])
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition-all duration-200">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => toggleTask(task.id)}
              className="rounded-full"
            />
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Task title"
              className="flex-1 h-10 rounded-lg border-gray-200 focus:border-violet-500 focus:ring-violet-500 focus:ring-opacity-25"
            />
          </div>

          <Textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Task description"
            className="min-h-[100px] resize-none rounded-lg border-gray-200 focus:border-violet-500 focus:ring-violet-500 focus:ring-opacity-25"
          />

          <div className="flex flex-wrap gap-4">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editedDueDate ? format(editedDueDate, "EEE, MMM d, yyyy") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={editedDueDate}
                  onSelect={(date) => {
                    setEditedDueDate(date)
                    setCalendarOpen(false)
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Select value={editedPriority} onValueChange={setEditedPriority}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="p1">P1 - Urgent</SelectItem>
                <SelectItem value="p2">P2 - High</SelectItem>
                <SelectItem value="p3">P3 - Medium</SelectItem>
                <SelectItem value="p4">P4 - Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TagPicker selectedTags={editedTags} onTagsChange={setEditedTags} />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <Cross2Icon className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <CheckIcon className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={cn(
        "group p-4 rounded-xl border bg-white shadow-sm",
        "hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:shadow-sm",
        "transition-all duration-300 ease-in-out",
        priorityBorderColors[task.priority],
        task.completed && "bg-gray-50 hover:translate-y-0"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center gap-2">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => toggleTask(task.id)}
            className={cn(
              "mt-1 rounded-full transition-all duration-300",
              task.completed ? "bg-gray-400 text-white scale-105" : "border-gray-300 hover:border-violet-500",
              "focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
            )}
          />
          <div className="w-0.5 h-full bg-gray-100 rounded-full" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-medium text-gray-900 truncate group-hover:text-violet-600",
                "transition-colors duration-300",
                task.completed && "line-through text-gray-500"
              )}>
                {task.title}
              </h3>
              {task.description && (
                <p className={cn(
                  "mt-1 text-sm text-gray-500 line-clamp-2",
                  "transition-opacity duration-300",
                  task.completed && "line-through opacity-75"
                )}>
                  {task.description}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {task.dueDate && (
                  <div className={cn(
                    "flex items-center text-xs",
                    task.dueDate < new Date() && !task.completed ? "text-red-500" : "text-gray-500",
                    "transition-colors duration-300",
                    task.completed && "line-through opacity-75"
                  )}>
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {format(task.dueDate, "MMM d")}
                  </div>
                )}
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs font-medium",
                    priorityColors[task.priority],
                    priorityBgColors[task.priority],
                    "transition-all duration-300",
                    task.completed && "opacity-50"
                  )}
                >
                  {priorityLabels[task.priority]}
                </Badge>
                {(task.tags || []).length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {(task.tags || []).map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className={cn(
                          "text-xs transition-all duration-300",
                          tag.color.replace("bg-", "text-"),
                          task.completed && "opacity-50",
                          "hover:scale-105"
                        )}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <Popover open={showMenu} onOpenChange={setShowMenu}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "h-8 w-8 rounded-lg",
                    "opacity-0 group-hover:opacity-100",
                    "transition-opacity duration-300",
                    "hover:bg-gray-100"
                  )}
                >
                  <DotsHorizontalIcon className="h-4 w-4 text-gray-500" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-1" align="end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm font-normal hover:text-violet-600 hover:bg-violet-50"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil1Icon className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm font-normal text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => deleteTask(task.id)}
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  )
} 
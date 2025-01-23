"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "./textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, PlusIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { useTaskStore, type Priority, type Tag } from "@/lib/store/task-store"
import { cn } from "@/lib/utils"
import { TagPicker } from "@/components/ui/tag-picker"

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultDate?: Date
}

export function TaskDialog({ open, onOpenChange, defaultDate }: TaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date | undefined>(defaultDate)
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [endCalendarOpen, setEndCalendarOpen] = useState(false)
  const [priority, setPriority] = useState<Priority>("p4")
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])

  const addTask = useTaskStore((state) => state.addTask)

  // Update date when defaultDate changes
  useEffect(() => {
    setDate(defaultDate)
  }, [defaultDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    addTask({
      title: title.trim(),
      description: description.trim(),
      dueDate: date,
      endDate: endDate && endDate >= (date || new Date()) ? endDate : undefined,
      priority,
      tags: selectedTags,
    })

    setTitle("")
    setDescription("")
    setDate(undefined)
    setEndDate(undefined)
    setPriority("p4")
    setSelectedTags([])
    onOpenChange(false)
  }

  const priorityOptions = [
    { value: "p1", label: "P1 - Urgent", color: "text-red-500", bgColor: "hover:bg-red-50" },
    { value: "p2", label: "P2 - High", color: "text-orange-500", bgColor: "hover:bg-orange-50" },
    { value: "p3", label: "P3 - Medium", color: "text-yellow-500", bgColor: "hover:bg-yellow-50" },
    { value: "p4", label: "P4 - Low", color: "text-blue-500", bgColor: "hover:bg-blue-50" },
  ]

  useEffect(() => {
    if (!open) return

    function handleKeyDown(event: KeyboardEvent) {
      // Save with Command/Ctrl + Enter
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault()
        event.stopPropagation()
        if (title.trim()) {
          handleSubmit(event as any)
        }
        return
      }

      // Close with Escape
      if (event.key === "Escape") {
        event.preventDefault()
        event.stopPropagation()
        onOpenChange(false)
        return
      }

      // Only handle shortcuts if no input/textarea is focused
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return
      }

      // Focus title input with Command/Ctrl + T
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "t") {
        event.preventDefault()
        event.stopPropagation()
        const titleInput = document.querySelector('input[placeholder="What needs to be done?"]')
        if (titleInput instanceof HTMLInputElement) {
          titleInput.focus()
        }
        return
      }

      // Focus description with Command/Ctrl + D
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "d") {
        event.preventDefault()
        event.stopPropagation()
        const descInput = document.querySelector('textarea[placeholder="Add more details about this task..."]')
        if (descInput instanceof HTMLTextAreaElement) {
          descInput.focus()
        }
        return
      }
    }

    window.addEventListener("keydown", handleKeyDown, { capture: true })
    return () => window.removeEventListener("keydown", handleKeyDown, { capture: true })
  }, [open, title, onOpenChange, handleSubmit])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button 
          className={cn(
            "w-full flex items-center justify-center h-10",
            "bg-violet-600 hover:bg-violet-700 active:bg-violet-800",
            "text-white rounded-xl",
            "transition-all duration-300",
            "hover:shadow-lg hover:-translate-y-0.5",
            "active:translate-y-0 active:shadow-md"
          )}
        >
          <PlusIcon className="w-5 h-5" />
          <span className="ml-2">Add Task</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 gap-0 rounded-xl overflow-hidden">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-6 py-4 border-b border-gray-100">
            <DialogTitle className="text-xl font-semibold text-gray-900">New TickDid Task</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2">
                <p className="text-sm text-gray-500 mt-1">
                  Add a new task to your list. Fill in the details and click save when you're done.
                </p>
                <div className="text-xs space-x-4 text-gray-500">
                  <span>⌘+Enter to save</span>
                  <span>⌘+T to focus title</span>
                  <span>⌘+D to focus description</span>
                  <span>Esc to cancel</span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4 space-y-4">
            <div>
              <Input
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={cn(
                  "h-10 rounded-lg border-gray-200",
                  "focus:border-violet-500 focus:ring-violet-500 focus:ring-opacity-25",
                  "placeholder:text-gray-400",
                  "transition-all duration-300"
                )}
              />
            </div>
            <div>
              <Textarea
                placeholder="Add more details about this task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={cn(
                  "min-h-[100px] resize-none rounded-lg border-gray-200",
                  "focus:border-violet-500 focus:ring-violet-500 focus:ring-opacity-25",
                  "placeholder:text-gray-400",
                  "transition-all duration-300"
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-10 rounded-lg border-gray-200",
                      "hover:border-violet-500 hover:bg-violet-50",
                      "transition-all duration-300",
                      !date && "text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "MMM d, yyyy") : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <div className="bg-white rounded-lg shadow-lg">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => {
                        setDate(date)
                        setCalendarOpen(false)
                        if (endDate && date && endDate < date) {
                          setEndDate(date)
                        }
                      }}
                      initialFocus
                      className="rounded-lg border-none shadow-none"
                    />
                  </div>
                </PopoverContent>
              </Popover>

              <Popover open={endCalendarOpen} onOpenChange={setEndCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-10 rounded-lg border-gray-200",
                      "hover:border-violet-500 hover:bg-violet-50",
                      "transition-all duration-300",
                      !endDate && "text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "MMM d, yyyy") : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <div className="bg-white rounded-lg shadow-lg">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date)
                        setEndCalendarOpen(false)
                      }}
                      disabled={(calendarDay) => 
                        calendarDay < (date || new Date())
                      }
                      initialFocus
                      className="rounded-lg border-none shadow-none"
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
                <SelectTrigger className={cn(
                  "h-10 rounded-lg border-gray-200",
                  "hover:border-violet-500 hover:bg-violet-50",
                  "transition-all duration-300"
                )}>
                  <SelectValue placeholder="How important is this?" className="text-gray-400" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className={cn(
                        "flex items-center",
                        option.color,
                        option.bgColor,
                        "transition-colors duration-300"
                      )}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <TagPicker selectedTags={selectedTags} onTagsChange={setSelectedTags} />
            </div>
          </div>
          <DialogFooter className="px-6 py-4 border-t border-gray-100">
            <Button
              type="submit"
              disabled={!title.trim()}
              className={cn(
                "w-full h-10 rounded-xl font-medium",
                "bg-violet-600 hover:bg-violet-700 active:bg-violet-800",
                "transition-all duration-300",
                "hover:shadow-lg hover:-translate-y-0.5",
                "active:translate-y-0 active:shadow-md",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              )}
            >
              Save Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
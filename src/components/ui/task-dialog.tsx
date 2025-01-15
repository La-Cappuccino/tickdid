"use client"

import { useState } from "react"
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

export function TaskDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date>()
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [priority, setPriority] = useState<Priority>("p4")
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])

  const addTask = useTaskStore((state) => state.addTask)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    addTask({
      title: title.trim(),
      description: description.trim(),
      dueDate: date,
      priority,
      tags: selectedTags,
    })

    setTitle("")
    setDescription("")
    setDate(undefined)
    setPriority("p4")
    setSelectedTags([])
    setOpen(false)
  }

  const priorityOptions = [
    { value: "p1", label: "P1 - Urgent", color: "text-red-500" },
    { value: "p2", label: "P2 - High", color: "text-orange-500" },
    { value: "p3", label: "P3 - Medium", color: "text-yellow-500" },
    { value: "p4", label: "P4 - Low", color: "text-blue-500" },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full flex items-center justify-center h-10 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-all duration-150">
          <PlusIcon className="w-5 h-5" />
          <span className="ml-2">Add Task</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 gap-0 rounded-xl overflow-hidden">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-6 py-4 border-b border-gray-100">
            <DialogTitle className="text-xl font-semibold text-gray-900">New TickDid Task</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-1">
              Add a new task to your list. Fill in the details and click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4 space-y-4">
            <div>
              <Input
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 rounded-lg border-gray-200 focus:border-violet-500 focus:ring-violet-500 focus:ring-opacity-25 placeholder:text-gray-400"
              />
            </div>
            <div>
              <Textarea
                placeholder="Add more details about this task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] resize-none rounded-lg border-gray-200 focus:border-violet-500 focus:ring-violet-500 focus:ring-opacity-25 placeholder:text-gray-400"
              />
            </div>
            <div>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-10 rounded-lg border-gray-200",
                      !date && "text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "EEE, MMM d, yyyy") : "When should this be done?"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <div className="bg-white rounded-lg shadow-lg">
                    <div className="p-3">
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-base font-medium">
                            {format(date || new Date(), "MMMM yyyy")}
                          </div>
                        </div>
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(date) => {
                            setDate(date)
                            setCalendarOpen(false)
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </div>
                    </div>
                    <div className="border-t px-3 py-2 flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        {date ? format(date, "EEE, MMM d, yyyy") : "No date selected"}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDate(new Date())
                          setCalendarOpen(false)
                        }}
                        className="h-8 text-sm"
                      >
                        Today
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
                <SelectTrigger className="h-10 rounded-lg border-gray-200">
                  <SelectValue placeholder="How important is this?" className="text-gray-400" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className={cn("flex items-center", option.color)}
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
              className="w-full h-10 bg-violet-600 hover:bg-violet-700 rounded-xl font-medium"
            >
              Save Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
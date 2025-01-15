"use client"

import { useState } from "react"
import { useTaskStore, type Task, type TaskView } from "@/lib/store/task-store"
import { TaskDialog } from "@/components/ui/task-dialog"
import { TaskCard } from "@/components/task-card"
import { Button } from "@/components/ui/button"
import {
  HamburgerMenuIcon,
  MagnifyingGlassIcon,
  BellIcon,
  LayoutIcon,
  ClockIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  TargetIcon,
  PlusIcon,
} from "@radix-ui/react-icons"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { KeyboardShortcutsDialog } from "@/components/ui/keyboard-shortcuts-dialog"
import { isToday, isAfter, format, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, isSameMonth } from "date-fns"
import { cn } from "@/lib/utils"
import { TagFilter } from "@/components/ui/tag-filter"
import { CalendarView } from "@/components/calendar-view"

interface FilterItem {
  id: TaskView;
  name: string;
  count: number;
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [selectedView, setSelectedView] = useState<TaskView>("all")
  const tasks = useTaskStore((state) => state.tasks)
  const selectedTags = useTaskStore((state) => state.selectedTags)
  const [currentLayout, setCurrentLayout] = useState<"list" | "calendar">("list")

  // Add keyboard shortcuts
  useKeyboardShortcuts({
    onNewTask: () => setTaskDialogOpen(true),
    onToggleSidebar: () => setSidebarOpen(!sidebarOpen),
  })

  const filters: FilterItem[] = [
    { id: "all", name: "All Tasks", count: tasks.filter(t => !t.completed).length },
    { id: "today", name: "Today", count: tasks.filter(t => !t.completed && t.dueDate && isToday(t.dueDate)).length },
    { id: "upcoming", name: "Upcoming", count: tasks.filter(t => !t.completed && t.dueDate && isAfter(t.dueDate, new Date())).length },
    { id: "completed", name: "Completed", count: tasks.filter(t => t.completed).length },
  ]

  const filteredTasks = tasks.filter(task => {
    // First filter by view
    const matchesView = (() => {
      switch (selectedView) {
        case "today":
          return !task.completed && task.dueDate && isToday(task.dueDate)
        case "upcoming":
          return !task.completed && task.dueDate && isAfter(task.dueDate, new Date())
        case "completed":
          return task.completed
        default:
          return !task.completed
      }
    })()

    // Then filter by selected tags
    const matchesTags = selectedTags.length === 0 || 
      task.tags?.some(tag => selectedTags.includes(tag.id))

    return matchesView && matchesTags
  })

  const stats = [
    {
      title: "Tasks Due",
      value: tasks.filter(t => t.dueDate && isToday(t.dueDate)).length,
      icon: ClockIcon,
      gradient: "from-violet-500 to-violet-600"
    },
    {
      title: "High Priority",
      value: tasks.filter(t => t.priority === "p1" && !t.completed).length,
      icon: ArrowUpIcon,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Completed Today",
      value: tasks.filter(t => t.completed && t.updatedAt && isToday(new Date(t.updatedAt))).length,
      icon: CheckCircledIcon,
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Weekly Progress",
      value: `${Math.round((tasks.filter(t => t.completed).length / Math.max(tasks.length, 1)) * 100)}%`,
      icon: TargetIcon,
      gradient: "from-amber-500 to-amber-600"
    }
  ]

  return (
    <div className="h-screen flex bg-[#FAFAFA]">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-72" : "w-16"} bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col`}>
        {/* Sidebar Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <HamburgerMenuIcon className="w-5 h-5 text-gray-600" />
          </button>
          <div className={`flex items-center gap-2 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
              <span className="text-sm font-medium text-violet-600">TD</span>
            </div>
            <KeyboardShortcutsDialog />
          </div>
        </div>

        {/* Quick Add */}
        <div className={`p-4 ${!sidebarOpen && "flex justify-center"}`}>
          {sidebarOpen ? (
            <TaskDialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen} />
          ) : (
            <Button
              size="icon"
              className="rounded-xl w-8 h-8 p-0"
              onClick={() => setTaskDialogOpen(true)}
            >
              <PlusIcon className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          {/* Mini Calendar */}
          <div className={cn(
            "mb-4 transition-all duration-300",
            !sidebarOpen && "hidden"
          )}>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm font-medium text-gray-600 mb-2">
                {format(new Date(), "MMMM yyyy")}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                  <div key={day} className="text-xs text-gray-400">
                    {day}
                  </div>
                ))}
                {eachDayOfInterval({
                  start: startOfMonth(new Date()),
                  end: endOfMonth(new Date())
                }).map((day) => {
                  const hasTask = tasks.some(
                    task => task.dueDate && isSameDay(new Date(task.dueDate), day)
                  )
                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "text-xs aspect-square flex items-center justify-center rounded",
                        isToday(day) && "bg-violet-100 text-violet-600 font-medium",
                        hasTask && !isToday(day) && "bg-violet-50 text-violet-600",
                        !isSameMonth(day, new Date()) && "text-gray-300"
                      )}
                    >
                      {format(day, "d")}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedView(filter.id)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                "transition-colors duration-300",
                selectedView === filter.id
                  ? "bg-violet-50 text-violet-600"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              {sidebarOpen ? (
                <>
                  <span className="flex-1 text-left">{filter.name}</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white">
                    {filter.count}
                  </span>
                </>
              ) : (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white">
                  {filter.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <header className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-gray-900">
              {filters.find(f => f.id === selectedView)?.name}
            </h1>
            <span className="text-sm text-gray-500">
              {filteredTasks.length} tasks
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-lg",
                "hover:bg-gray-100",
                "transition-colors duration-300",
                currentLayout === "calendar" && "text-violet-600 bg-violet-50 hover:bg-violet-100"
              )}
              onClick={() => setCurrentLayout(currentLayout === "list" ? "calendar" : "list")}
            >
              <LayoutIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-gray-100"
            >
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-gray-100"
            >
              <BellIcon className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
        </header>

        {currentLayout === "list" ? (
          <>
            {/* Stats Tiles */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={cn(
                    "bg-gradient-to-br rounded-xl p-4 text-white shadow-sm",
                    "hover:shadow-md hover:-translate-y-0.5",
                    "transition-all duration-300",
                    stat.gradient
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
                      {stat.title}
                    </span>
                  </div>
                  <div className="mt-3">
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <p className="text-sm text-white/80">{stat.title}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="max-w-3xl mx-auto">
                <TagFilter />
                <div className="space-y-4">
                  {filteredTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  {filteredTasks.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No tasks found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-5xl mx-auto">
              <CalendarView tasks={filteredTasks} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

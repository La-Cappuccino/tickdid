"use client"

import { useState, useEffect } from "react"
import { useTaskStore, type Task, type TaskView } from "@/lib/store/task-store"
import { TaskCard } from "@/components/task-card"
import { Button } from "@/components/ui/button"
import {
  MagnifyingGlassIcon,
  BellIcon,
  LayoutIcon,
  ClockIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  TargetIcon,
} from "@radix-ui/react-icons"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { isToday, isAfter } from "date-fns"
import { cn } from "@/lib/utils"
import { TagFilter } from "@/components/ui/tag-filter"
import { CalendarView } from "@/components/calendar-view"
import { Sidebar } from "@/components/sidebar"
import { ProjectOverview } from "@/components/project-overview"

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentLayout, setCurrentLayout] = useState<"list" | "calendar" | "overview">("overview")
  const tasks = useTaskStore((state) => state.tasks)
  const selectedView = useTaskStore((state) => state.currentView)
  const selectedTags = useTaskStore((state) => state.selectedTags)

  // Handle keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Don't handle shortcuts if we're in an input field or if a dialog is open
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLButtonElement ||
        document.querySelector('[role="dialog"]')
      ) {
        return
      }

      // Toggle sidebar with Command/Ctrl + B
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
        event.preventDefault()
        event.stopPropagation()
        setSidebarOpen(!sidebarOpen)
        return
      }
    }

    window.addEventListener("keydown", handleKeyDown, { capture: true })
    return () => window.removeEventListener("keydown", handleKeyDown, { capture: true })
  }, [sidebarOpen])

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

  const filters = [
    { id: "all", name: "All Tasks" },
    { id: "today", name: "Today" },
    { id: "upcoming", name: "Upcoming" },
    { id: "completed", name: "Completed" },
  ]

  return (
    <div className="h-screen flex bg-[#FAFAFA]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

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
              onClick={() => setCurrentLayout(
                currentLayout === "list" ? "calendar" : 
                currentLayout === "calendar" ? "overview" : "list"
              )}
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

        {currentLayout === "overview" ? (
          <div className="flex-1 overflow-y-auto">
            <ProjectOverview />
          </div>
        ) : currentLayout === "list" ? (
          <>
            {/* Stats Tiles */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={`stat-${index}`}
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
                    <TaskCard key={`task-${task.id}`} task={task} />
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

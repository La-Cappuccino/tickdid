"use client"

import { useState } from "react"
import { useTaskStore, type TaskView } from "@/lib/store/task-store"
import { Button } from "@/components/ui/button"
import { 
  HamburgerMenuIcon, 
  PlusIcon, 
  CheckCircledIcon, 
  CalendarIcon, 
  ClockIcon, 
  ListBulletIcon,
  QuestionMarkCircledIcon,
  BarChartIcon
} from "@radix-ui/react-icons"
import { KeyboardShortcutsDialog } from "@/components/ui/keyboard-shortcuts-dialog"
import { TaskDialog } from "@/components/ui/task-dialog"
import { MiniCalendar } from "@/components/mini-calendar"
import { cn } from "@/lib/utils"
import { isToday, isAfter } from "date-fns"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnalyticsDialog } from "@/components/analytics/analytics-dialog"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

interface FilterItem {
  id: TaskView
  name: string
  count: number
  icon: React.ReactNode
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false)
  const tasks = useTaskStore((state) => state.tasks)
  const selectedView = useTaskStore((state) => state.currentView)
  const setView = useTaskStore((state) => state.setView)
  const pathname = usePathname()

  const filters: FilterItem[] = [
    { 
      id: "all", 
      name: "All Tasks", 
      count: tasks.filter(t => !t.completed).length,
      icon: <ListBulletIcon className="w-5 h-5 stroke-[1.5]" />
    },
    { 
      id: "today", 
      name: "Today", 
      count: tasks.filter(t => !t.completed && t.dueDate && isToday(t.dueDate)).length,
      icon: <CalendarIcon className="w-5 h-5 stroke-[1.5]" />
    },
    { 
      id: "upcoming", 
      name: "Upcoming", 
      count: tasks.filter(t => !t.completed && t.dueDate && isAfter(t.dueDate, new Date())).length,
      icon: <ClockIcon className="w-5 h-5 stroke-[1.5]" />
    },
    { 
      id: "completed", 
      name: "Completed", 
      count: tasks.filter(t => t.completed).length,
      icon: <CheckCircledIcon className="w-5 h-5 stroke-[1.5]" />
    },
  ]

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col shadow-sm",
      isOpen ? "w-72" : "w-16"
    )}>
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200 bg-gradient-to-r from-violet-50/50 to-white">
        <button
          onClick={onToggle}
          className="p-2.5 hover:bg-violet-100 rounded-xl transition-all duration-300 hover:shadow-sm active:scale-95"
          title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <HamburgerMenuIcon className="w-5 h-5 text-violet-700 stroke-[1.5]" />
        </button>
        {isOpen && (
          <div className="flex items-center gap-3 ml-auto">
            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center shadow-sm">
              <span className="text-sm font-bold text-violet-700">TD</span>
            </div>
            <KeyboardShortcutsDialog />
          </div>
        )}
      </div>

      {/* Quick Add */}
      <div className="p-4 flex justify-center">
        {isOpen ? (
          <TaskDialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen} />
        ) : (
          <Button
            size="icon"
            className="rounded-xl w-10 h-10 p-0 bg-violet-600 hover:bg-violet-700 shadow-md hover:shadow-lg transition-all active:scale-95"
            onClick={() => setTaskDialogOpen(true)}
            title="Add new task"
          >
            <PlusIcon className="w-5 h-5 text-white stroke-[1.5]" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 overflow-y-auto",
        isOpen ? "px-2 py-3" : "p-2"
      )}>
        {/* Mini Calendar */}
        {isOpen && (
          <div className="mb-6 px-2">
            <MiniCalendar />
          </div>
        )}

        {/* Filters */}
        <div className={cn(
          "space-y-1.5",
          isOpen ? "px-2" : "flex flex-col items-center"
        )}>
          {filters.map((filter) => (
            <button
              key={`filter-${filter.id}`}
              onClick={() => setView(filter.id)}
              className={cn(
                "flex items-center gap-3 transition-all duration-300 group hover:shadow-sm active:scale-98",
                isOpen 
                  ? "w-full px-4 py-2.5 rounded-xl text-sm"
                  : "w-10 h-10 justify-center rounded-xl",
                selectedView === filter.id
                  ? "bg-violet-100 text-violet-700 font-semibold shadow-sm"
                  : "text-gray-600 hover:bg-violet-50 hover:text-violet-600"
              )}
              title={!isOpen ? filter.name : undefined}
            >
              <div className={cn(
                "flex-shrink-0 transition-colors duration-300",
                selectedView === filter.id 
                  ? "text-violet-700" 
                  : "text-violet-500 group-hover:text-violet-600"
              )}>
                {filter.icon}
              </div>
              {isOpen && (
                <>
                  <span className="flex-1 text-left font-medium">{filter.name}</span>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors duration-300",
                    selectedView === filter.id
                      ? "bg-violet-200 text-violet-700"
                      : "bg-violet-50 text-violet-600"
                  )}>
                    {filter.count}
                  </span>
                </>
              )}
              {!isOpen && filter.count > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-600 text-white min-w-[18px]">
                  {filter.count}
                </span>
              )}
            </button>
          ))}

          {/* Analytics Link */}
          <button
            onClick={() => setAnalyticsDialogOpen(true)}
            className={cn(
              "flex items-center gap-3 transition-all duration-300 group hover:shadow-sm active:scale-98",
              isOpen 
                ? "w-full px-4 py-2.5 rounded-xl text-sm"
                : "w-10 h-10 justify-center rounded-xl",
              "text-gray-600 hover:bg-violet-50 hover:text-violet-600"
            )}
            title={!isOpen ? "Analytics" : undefined}
          >
            <div className={cn(
              "flex-shrink-0 transition-colors duration-300",
              "text-violet-500 group-hover:text-violet-600"
            )}>
              <BarChartIcon className="w-5 h-5 stroke-[1.5]" />
            </div>
            {isOpen && (
              <span className="flex-1 text-left font-medium">Analytics</span>
            )}
          </button>

          <AnalyticsDialog 
            open={analyticsDialogOpen}
            onOpenChange={setAnalyticsDialogOpen}
          />
        </div>
      </nav>
    </div>
  )
} 
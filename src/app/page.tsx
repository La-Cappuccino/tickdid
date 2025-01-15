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

interface FilterItem {
  id: TaskView;
  name: string;
  count: number;
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const store = useTaskStore()
  const tasks = store.tasks
  const currentView = store.currentView
  const setView = store.setView
  const filteredTasks = store.getFilteredTasks()

  const filters: readonly FilterItem[] = [
    { id: "all", name: "All Tasks", count: tasks.filter(t => !t.completed).length },
    { id: "today", name: "Today", count: tasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString() && !t.completed).length },
    { id: "upcoming", name: "Upcoming", count: tasks.filter(t => t.dueDate && new Date(t.dueDate) > new Date() && !t.completed).length },
    { id: "completed", name: "Completed", count: tasks.filter(t => t.completed).length },
  ] as const;

  const handleViewChange = (view: TaskView) => {
    setView(view)
  }

  const stats = [
    {
      title: "Tasks Due",
      value: tasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString()).length,
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
      value: tasks.filter(t => t.completed && new Date(t.updatedAt).toDateString() === new Date().toDateString()).length,
      icon: CheckCircledIcon,
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Weekly Progress",
      value: "85%",
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
          <div className={`flex items-center transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
              <span className="text-sm font-medium text-violet-600">TD</span>
            </div>
          </div>
        </div>

        {/* Quick Add */}
        <div className={`p-4 ${!sidebarOpen && "flex justify-center"}`}>
          {sidebarOpen ? (
            <TaskDialog />
          ) : (
            <Button
              size="icon"
              className="rounded-xl w-8 h-8 p-0"
              onClick={() => setSidebarOpen(true)}
            >
              <PlusIcon className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <div className="px-3 flex-1 overflow-y-auto">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => handleViewChange(filter.id as TaskView)}
              className={`
                w-full flex items-center px-3 h-10 rounded-xl mb-1
                ${currentView === filter.id 
                  ? "bg-violet-50 text-violet-600" 
                  : "hover:bg-gray-100 text-gray-700"}
                transition-all duration-150
              `}
            >
              {!sidebarOpen ? (
                <div className="relative flex items-center justify-center w-full">
                  <span className="text-sm font-medium">{filter.name[0]}</span>
                  {filter.count > 0 && (
                    <div className="absolute -top-1 -right-1">
                      <span className="flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <span className="text-sm">{filter.name}</span>
                  {filter.count > 0 && (
                    <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {filter.count}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-6 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              {filters.find(f => f.id === currentView)?.name}
            </h1>
            <span className="ml-3 text-sm text-gray-500">
              {filteredTasks.length} tasks
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <LayoutIcon className="w-5 h-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <BellIcon className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Stats Tiles */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300`}
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
        <div className="px-6 flex-1 overflow-y-auto">
          <div className="space-y-4 pb-6">
            {filteredTasks.map((task: Task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

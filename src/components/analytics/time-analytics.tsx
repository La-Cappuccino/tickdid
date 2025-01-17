"use client"

import { useMemo } from "react"
import { useTaskStore } from "@/lib/store/task-store"
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isWithinInterval, startOfMonth, endOfMonth, isSameMonth } from "date-fns"
import { Card } from "@/components/ui/card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  Legend
} from "recharts"
import { 
  ClockIcon, 
  CheckCircledIcon, 
  CrossCircledIcon,
  LightningBoltIcon,
  TargetIcon
} from "@radix-ui/react-icons"

const COLORS = {
  p1: "#ef4444", // red
  p2: "#f97316", // orange
  p3: "#eab308", // yellow
  p4: "#3b82f6", // blue
}

const priorityLabels = {
  p1: "Urgent",
  p2: "High",
  p3: "Medium",
  p4: "Low",
}

export function TimeAnalytics() {
  const tasks = useTaskStore(state => state.tasks)

  const stats = useMemo(() => {
    const totalTrackedTime = tasks.reduce((acc, task) => 
      acc + (task.timeTracking?.totalTime || 0), 0
    )

    const completedTasks = tasks.filter(task => task.completed)
    const averageTimePerTask = completedTasks.length > 0
      ? completedTasks.reduce((acc, task) => 
          acc + (task.timeTracking?.totalTime || 0), 0) / completedTasks.length
      : 0

    // Weekly time distribution
    const now = new Date()
    const weekStart = startOfWeek(now)
    const weekEnd = endOfWeek(now)
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

    const dailyData = weekDays.map(day => {
      const dayTotal = tasks.reduce((acc, task) => {
        const dayLogs = task.timeTracking?.logs.filter(log => 
          log.endTime && isWithinInterval(log.endTime, {
            start: day,
            end: new Date(day.getTime() + 24 * 60 * 60 * 1000)
          })
        ) || []
        
        return acc + dayLogs.reduce((sum, log) => sum + (log.duration || 0), 0)
      }, 0)

      return {
        day: format(day, "EEE"),
        minutes: dayTotal
      }
    })

    // Priority distribution
    const priorityData = Object.entries(COLORS).map(([priority]) => {
      const tasksWithPriority = tasks.filter(t => t.priority === priority)
      const timeSpent = tasksWithPriority.reduce((acc, task) => 
        acc + (task.timeTracking?.totalTime || 0), 0
      )
      
      return {
        priority: priorityLabels[priority],
        minutes: timeSpent,
        color: COLORS[priority]
      }
    })

    // Monthly trend
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)
    const monthlyCompletionRate = tasks
      .filter(task => task.completed && task.updatedAt && isSameMonth(task.updatedAt, now))
      .length

    // Productivity score (0-100)
    const productivityScore = Math.min(100, Math.round(
      (completedTasks.length / Math.max(tasks.length, 1)) * 100 +
      (totalTrackedTime > 0 ? 20 : 0) +
      (monthlyCompletionRate > 5 ? 20 : monthlyCompletionRate * 4)
    ))

    return {
      totalTrackedTime,
      averageTimePerTask,
      dailyData,
      priorityData,
      completedCount: completedTasks.length,
      totalCount: tasks.length,
      productivityScore,
      monthlyCompletionRate
    }
  }, [tasks])

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-violet-100">
              <ClockIcon className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Time</h3>
              <p className="text-2xl font-bold text-violet-600">
                {formatTime(stats.totalTrackedTime)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-100">
              <CheckCircledIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Completed Tasks</h3>
              <p className="text-2xl font-bold text-emerald-600">
                {stats.completedCount} / {stats.totalCount}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-100">
              <LightningBoltIcon className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Avg. Time per Task</h3>
              <p className="text-2xl font-bold text-amber-600">
                {formatTime(stats.averageTimePerTask)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <TargetIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Productivity Score</h3>
              <p className="text-2xl font-bold text-blue-600">
                {stats.productivityScore}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Weekly Time Distribution
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dailyData}>
                <XAxis dataKey="day" />
                <YAxis 
                  tickFormatter={(value) => `${Math.round(value / 60)}h`}
                  width={40}
                />
                <Tooltip 
                  formatter={(value: number) => formatTime(value)}
                  labelStyle={{ color: "#111827" }}
                  contentStyle={{ 
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem"
                  }}
                />
                <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                  {stats.dailyData.map((entry, index) => (
                    <Cell 
                      key={index}
                      fill={entry.minutes > 0 ? "#8B5CF6" : "#E5E7EB"}
                      fillOpacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Priority Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Time by Priority
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.priorityData}
                  dataKey="minutes"
                  nameKey="priority"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ priority, minutes }) => 
                    minutes > 0 ? `${priority}: ${formatTime(minutes)}` : ''
                  }
                >
                  {stats.priorityData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      fillOpacity={0.8}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatTime(value)}
                  contentStyle={{ 
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem"
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
} 
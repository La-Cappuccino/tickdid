"use client"

import { useMemo, useState } from "react"
import { useTaskStore } from "@/lib/store/task-store"
import { 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isWithinInterval, 
  startOfMonth, 
  endOfMonth, 
  isSameMonth,
  getHours,
  subDays,
  eachDayOfMonth,
  addDays,
  isFuture
} from "date-fns"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  Legend,
  AreaChart,
  Area,
  CartesianGrid
} from "recharts"
import { 
  ClockIcon, 
  CheckCircledIcon, 
  CrossCircledIcon,
  LightningBoltIcon,
  TargetIcon,
  DownloadIcon,
  MixIcon,
  CalendarIcon,
  TimerIcon,
  BarChartIcon,
  ChevronDownIcon,
  InfoCircledIcon
} from "@radix-ui/react-icons"
import {
  Tooltip as TooltipPrimitive,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const COLORS = {
  p1: "#ef4444", // red
  p2: "#f97316", // orange
  p3: "#eab308", // yellow
  p4: "#3b82f6", // blue
  forecast: "#14b8a6", // teal
  prediction: "#8b5cf6", // violet
}

const priorityLabels = {
  p1: "Urgent",
  p2: "High",
  p3: "Medium",
  p4: "Low",
}

const chartTheme = {
  background: "transparent",
  axis: {
    domain: {
      line: {
        stroke: "#E5E7EB",
        strokeWidth: 1,
      },
    },
    ticks: {
      line: {
        stroke: "#E5E7EB",
        strokeWidth: 1,
      },
      text: {
        fill: "#6B7280",
        fontSize: 12,
      },
    },
  },
  grid: {
    line: {
      stroke: "#F3F4F6",
      strokeWidth: 1,
    },
  },
}

export function TimeAnalytics() {
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [activeCard, setActiveCard] = useState<string | null>(null)

  const tasks = useTaskStore(state => state.tasks)
  const tags = useTaskStore(state => state.tags)

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

    // Time of day distribution
    const hourlyData = Array.from({ length: 24 }, (_, hour) => {
      const timeSpent = tasks.reduce((acc, task) => {
        const hoursLogs = task.timeTracking?.logs.filter(log => {
          if (!log.startTime || !log.endTime) return false
          const logHour = getHours(log.startTime)
          return logHour === hour
        }) || []
        
        return acc + hoursLogs.reduce((sum, log) => sum + (log.duration || 0), 0)
      }, 0)

      return {
        hour: format(new Date().setHours(hour), 'ha'),
        minutes: timeSpent
      }
    })

    // Task completion trend (last 30 days)
    const last30Days = Array.from({ length: 30 }, (_, i) => subDays(new Date(), i))
      .reverse()
    
    const completionTrend = last30Days.map(day => {
      const completedOnDay = tasks.filter(task => 
        task.completed && 
        task.updatedAt && 
        isWithinInterval(task.updatedAt, {
          start: new Date(day.setHours(0, 0, 0, 0)),
          end: new Date(day.setHours(23, 59, 59, 999))
        })
      ).length

      return {
        date: format(day, 'MMM d'),
        completed: completedOnDay
      }
    })

    // Tag-based analysis
    const tagStats = tags.map(tag => {
      const tasksWithTag = tasks.filter(task => 
        task.tags?.some(t => t.id === tag.id)
      )

      const timeSpent = tasksWithTag.reduce((acc, task) => 
        acc + (task.timeTracking?.totalTime || 0), 0
      )

      const completionRate = tasksWithTag.length > 0
        ? (tasksWithTag.filter(t => t.completed).length / tasksWithTag.length) * 100
        : 0

      return {
        tag: tag.name,
        minutes: timeSpent,
        tasks: tasksWithTag.length,
        completionRate,
        color: tag.color.replace('bg-', 'text-').replace('text-', '#')
      }
    }).sort((a, b) => b.minutes - a.minutes)

    // Task Duration Predictions
    const completedTasksByPriority = tasks
      .filter(task => task.completed && task.timeTracking?.totalTime)
      .reduce((acc, task) => {
        const priority = task.priority || 'p4'
        if (!acc[priority]) {
          acc[priority] = []
        }
        acc[priority].push(task.timeTracking.totalTime)
        return acc
      }, {} as Record<string, number[]>)

    const durationPredictions = Object.entries(completedTasksByPriority).map(([priority, times]) => {
      const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length
      const stdDev = Math.sqrt(
        times.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / times.length
      )
      
      return {
        priority: priorityLabels[priority],
        predicted: Math.round(avgTime),
        min: Math.max(0, Math.round(avgTime - stdDev)),
        max: Math.round(avgTime + stdDev),
        confidence: times.length >= 5 ? 'High' : times.length >= 3 ? 'Medium' : 'Low',
        color: COLORS[priority]
      }
    }).sort((a, b) => b.predicted - a.predicted)

    // Workload Forecasting
    const incompleteTasks = tasks.filter(task => !task.completed)
    const next14Days = Array.from({ length: 14 }, (_, i) => addDays(now, i))
    
    const workloadForecast = next14Days.map(day => {
      const dayTasks = incompleteTasks.filter(task => {
        if (!task.dueDate) return false
        const dueDate = new Date(task.dueDate)
        return isSameMonth(dueDate, day) && dueDate.getDate() === day.getDate()
      })

      const estimatedTime = dayTasks.reduce((acc, task) => {
        const priority = task.priority || 'p4'
        const prediction = durationPredictions.find(p => p.priority === priorityLabels[priority])
        return acc + (prediction?.predicted || 0)
      }, 0)

      return {
        date: format(day, 'MMM d'),
        tasks: dayTasks.length,
        estimatedMinutes: estimatedTime,
        isOverloaded: estimatedTime > 480 // More than 8 hours
      }
    })

    return {
      totalTrackedTime,
      averageTimePerTask,
      dailyData,
      priorityData,
      completedCount: completedTasks.length,
      totalCount: tasks.length,
      productivityScore,
      monthlyCompletionRate,
      hourlyData,
      completionTrend,
      tagStats,
      durationPredictions,
      workloadForecast,
    }
  }, [tasks, tags])

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const handleExport = () => {
    const data = {
      overview: {
        totalTime: stats.totalTrackedTime,
        completedTasks: stats.completedCount,
        totalTasks: stats.totalCount,
        averageTime: stats.averageTimePerTask,
        productivityScore: stats.productivityScore
      },
      weeklyDistribution: stats.dailyData,
      priorityDistribution: stats.priorityData,
      timeOfDay: stats.hourlyData,
      completionTrend: stats.completionTrend,
      tagAnalysis: stats.tagStats
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tickdid-analytics-${format(new Date(), 'yyyy-MM-dd')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
          <p className="text-gray-500 mt-1">Track your productivity and task management metrics</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 hover:bg-gray-100 transition-colors"
          onClick={handleExport}
        >
          <DownloadIcon className="w-4 h-4" />
          Export Data
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card 
                className={`p-6 transition-all duration-300 cursor-default
                  ${activeCard === 'time' 
                    ? 'ring-2 ring-violet-500 shadow-lg scale-[1.02]' 
                    : 'hover:shadow-lg hover:scale-[1.02]'}`}
                onMouseEnter={() => setActiveCard('time')}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-violet-100 ring-8 ring-violet-50">
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
            </TooltipTrigger>
            <TooltipContent side="bottom" className="p-4 max-w-xs">
              <p className="text-sm">Total time tracked across all tasks</p>
              <p className="text-xs text-gray-500 mt-1">
                This week: {formatTime(stats.dailyData.reduce((acc, day) => acc + day.minutes, 0))}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-default">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-100 ring-8 ring-emerald-50">
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

        <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-default">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-100 ring-8 ring-amber-50">
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

        <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-default">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100 ring-8 ring-blue-50">
              <TargetIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Productivity Score</h3>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-blue-600">
                  {stats.productivityScore}%
                </p>
                <span className="text-sm text-blue-400">
                  {stats.productivityScore >= 80 ? 'Excellent' : 
                   stats.productivityScore >= 60 ? 'Good' : 
                   stats.productivityScore >= 40 ? 'Fair' : 'Needs Improvement'}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="space-y-8">
        {/* Time Distribution Section */}
        <Collapsible 
          open={expandedSections.includes('time')}
          onOpenChange={() => toggleSection('time')}
          className="space-y-4"
        >
          <CollapsibleTrigger className="flex items-center gap-2 w-full group">
            <div className="flex items-center gap-2 flex-1">
              <TimerIcon className="w-5 h-5 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900">Time Distribution</h3>
            </div>
            <ChevronDownIcon 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200
                ${expandedSections.includes('time') ? 'transform rotate-180' : ''}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Distribution */}
              <Card className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-medium text-gray-700">Weekly Overview</h4>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoCircledIcon className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p className="text-sm">Time spent on tasks each day this week</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={stats.dailyData}
                      margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                    >
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
                          <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.6} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                      />
                      <YAxis 
                        tickFormatter={(value) => `${Math.round(value / 60)}h`}
                        width={40}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                      />
                      <Tooltip 
                        formatter={(value: number) => formatTime(value)}
                        labelStyle={{ color: "#111827" }}
                        contentStyle={{ 
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "0.5rem",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                        }}
                      />
                      <Bar 
                        dataKey="minutes" 
                        radius={[4, 4, 0, 0]}
                        fill="url(#barGradient)"
                      >
                        {stats.dailyData.map((entry, index) => (
                          <Cell 
                            key={index}
                            fillOpacity={entry.minutes > 0 ? 1 : 0.2}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Priority Distribution */}
              <Card className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-medium text-gray-700">Priority Distribution</h4>
                  <MixIcon className="w-4 h-4 text-gray-400" />
                </div>
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
          </CollapsibleContent>
        </Collapsible>

        {/* Activity Patterns Section */}
        <Collapsible 
          open={expandedSections.includes('activity')}
          onOpenChange={() => toggleSection('activity')}
          className="space-y-4"
        >
          <CollapsibleTrigger className="flex items-center gap-2 w-full group">
            <div className="flex items-center gap-2 flex-1">
              <BarChartIcon className="w-5 h-5 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900">Activity Patterns</h3>
            </div>
            <ChevronDownIcon 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200
                ${expandedSections.includes('activity') ? 'transform rotate-180' : ''}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Time of Day Activity */}
              <Card className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-medium text-gray-700">Daily Activity Pattern</h4>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoCircledIcon className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p className="text-sm">Time spent on tasks each day this week</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.hourlyData}>
                      <XAxis dataKey="hour" />
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
                          borderRadius: "0.5rem",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="minutes" 
                        stroke="#8B5CF6"
                        fill="#8B5CF6"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Completion Trend */}
              <Card className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-medium text-gray-700">Completion Trend</h4>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoCircledIcon className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p className="text-sm">Completion trend over the last 30 days</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.completionTrend}>
                      <XAxis 
                        dataKey="date" 
                        interval={6}
                        angle={-45}
                        textAnchor="end"
                        height={50}
                      />
                      <YAxis />
                      <Tooltip
                        labelStyle={{ color: "#111827" }}
                        contentStyle={{ 
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "0.5rem",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="completed" 
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Tag Analysis Section */}
        <Collapsible 
          open={expandedSections.includes('tag')}
          onOpenChange={() => toggleSection('tag')}
          className="space-y-4"
        >
          <CollapsibleTrigger className="flex items-center gap-2 w-full group">
            <div className="flex items-center gap-2 flex-1">
              <BarChartIcon className="w-5 h-5 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900">Tag Analysis</h3>
            </div>
            <ChevronDownIcon 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200
                ${expandedSections.includes('tag') ? 'transform rotate-180' : ''}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-6">
            <Card className="p-6 col-span-full hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-medium text-gray-700">Time by Tag</h4>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>Total Tags: {stats.tagStats.length}</span>
                  <span>•</span>
                  <span>Active Tags: {stats.tagStats.filter(t => t.minutes > 0).length}</span>
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={stats.tagStats}
                    layout="vertical"
                    margin={{ left: 100 }}
                  >
                    <XAxis type="number" tickFormatter={(value) => `${Math.round(value / 60)}h`} />
                    <YAxis type="category" dataKey="tag" width={100} />
                    <Tooltip
                      formatter={(value: number) => formatTime(value)}
                      labelStyle={{ color: "#111827" }}
                      contentStyle={{ 
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                      }}
                    />
                    <Bar dataKey="minutes" radius={[0, 4, 4, 0]}>
                      {stats.tagStats.map((entry, index) => (
                        <Cell 
                          key={index}
                          fill={entry.color}
                          fillOpacity={0.8}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {stats.tagStats.map(tag => (
                  <div 
                    key={tag.tag}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-3 h-3 rounded-full ${tag.color.replace('#', 'bg-')}`}
                        style={{ boxShadow: `0 0 0 2px ${tag.color}22` }}
                      />
                      <span className="font-medium">{tag.tag}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-900 font-medium">{Math.round(tag.completionRate)}%</span>
                      <span className="text-gray-500 ml-1">completed</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Predictions Section */}
        <Collapsible 
          open={expandedSections.includes('prediction')}
          onOpenChange={() => toggleSection('prediction')}
          className="space-y-4"
        >
          <CollapsibleTrigger className="flex items-center gap-2 w-full group">
            <div className="flex items-center gap-2 flex-1">
              <TargetIcon className="w-5 h-5 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900">Predictions & Forecasting</h3>
            </div>
            <ChevronDownIcon 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200
                ${expandedSections.includes('prediction') ? 'transform rotate-180' : ''}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Task Duration Predictions */}
              <Card className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-medium text-gray-700">Duration Predictions</h4>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoCircledIcon className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p className="text-sm">Predicted task duration based on historical data</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="space-y-4">
                  {stats.durationPredictions.map(prediction => (
                    <div 
                      key={prediction.priority}
                      className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{prediction.priority}</span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          prediction.confidence === 'High' 
                            ? 'bg-green-100 text-green-800'
                            : prediction.confidence === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {prediction.confidence} Confidence
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-2 rounded-full flex-1"
                          style={{
                            background: `linear-gradient(to right, 
                              ${prediction.color}22, 
                              ${prediction.color} 50%, 
                              ${prediction.color}22
                            )`
                          }}
                        />
                        <div className="text-sm text-gray-600 w-32 text-right">
                          {formatTime(prediction.min)} - {formatTime(prediction.max)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Workload Forecast */}
              <Card className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-medium text-gray-700">Workload Forecast</h4>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoCircledIcon className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p className="text-sm">Predicted workload for the next 14 days</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.workloadForecast}>
                      <XAxis 
                        dataKey="date"
                        interval={2}
                        angle={-45}
                        textAnchor="end"
                        height={50}
                      />
                      <YAxis 
                        yAxisId="left"
                        tickFormatter={(value) => `${Math.round(value / 60)}h`}
                        orientation="left"
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        dataKey="tasks"
                      />
                      <Tooltip
                        formatter={(value: number, name: string) => {
                          if (name === 'estimatedMinutes') return formatTime(value)
                          return value
                        }}
                        labelStyle={{ color: "#111827" }}
                        contentStyle={{ 
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "0.5rem",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                        }}
                      />
                      <Bar 
                        dataKey="estimatedMinutes" 
                        yAxisId="left"
                        radius={[4, 4, 0, 0]}
                      >
                        {stats.workloadForecast.map((entry, index) => (
                          <Cell 
                            key={index}
                            fill={entry.isOverloaded ? COLORS.p1 : COLORS.forecast}
                            fillOpacity={0.8}
                          />
                        ))}
                      </Bar>
                      <Line
                        type="monotone"
                        dataKey="tasks"
                        yAxisId="right"
                        stroke={COLORS.prediction}
                        strokeWidth={2}
                        dot={false}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.forecast }} />
                    <span>Estimated Hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.prediction }} />
                    <span>Task Count</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.p1 }} />
                    <span>Overloaded</span>
                  </div>
                </div>
              </Card>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
} 
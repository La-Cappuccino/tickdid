import { useMemo } from "react"
import { useTaskStore } from "@/lib/store/task-store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell 
} from "recharts"
import { 
  RocketIcon, 
  TimerIcon, 
  CheckCircledIcon, 
  CrossCircledIcon,
  CalendarIcon,
  TargetIcon,
  PlusIcon,
  ArrowRightIcon
} from "@radix-ui/react-icons"
import { format, isToday, isTomorrow, isThisWeek, addDays } from "date-fns"
import Link from "next/link"

export function ProjectOverview() {
  const tasks = useTaskStore(state => state.tasks)

  const stats = useMemo(() => {
    const now = new Date()
    const todaysTasks = tasks.filter(task => {
      if (!task.dueDate) return false
      return isToday(new Date(task.dueDate))
    })

    const tomorrowsTasks = tasks.filter(task => {
      if (!task.dueDate) return false
      return isTomorrow(new Date(task.dueDate))
    })

    const thisWeeksTasks = tasks.filter(task => {
      if (!task.dueDate) return false
      const dueDate = new Date(task.dueDate)
      return isThisWeek(dueDate) && !isToday(dueDate) && !isTomorrow(dueDate)
    })

    const urgentTasks = tasks.filter(task => 
      !task.completed && task.priority === 'p1'
    )

    const completedToday = tasks.filter(task => 
      task.completed && 
      task.updatedAt && 
      isToday(task.updatedAt)
    )

    const next7Days = Array.from({ length: 7 }, (_, i) => addDays(now, i))
    const upcomingWorkload = next7Days.map(day => {
      const dayTasks = tasks.filter(task => {
        if (!task.dueDate || task.completed) return false
        const dueDate = new Date(task.dueDate)
        return format(dueDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      })

      return {
        date: format(day, 'EEE'),
        tasks: dayTasks.length,
        isToday: isToday(day)
      }
    })

    return {
      today: {
        total: todaysTasks.length,
        completed: todaysTasks.filter(t => t.completed).length
      },
      tomorrow: {
        total: tomorrowsTasks.length,
        completed: tomorrowsTasks.filter(t => t.completed).length
      },
      thisWeek: {
        total: thisWeeksTasks.length,
        completed: thisWeeksTasks.filter(t => t.completed).length
      },
      urgent: urgentTasks.length,
      completedToday: completedToday.length,
      upcomingWorkload
    }
  }, [tasks])

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="flex items-center justify-between bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Overview</h2>
          <p className="text-gray-500 mt-1">Quick insights and actions</p>
        </div>
        <div className="flex items-center gap-6">
          {/* Quick Stats */}
          <div className="flex items-center gap-6 pr-6 border-r border-gray-200">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-emerald-50">
              <div className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-100" />
              <span className="text-sm text-emerald-700">
                <span className="font-semibold">{stats.completedToday}</span> completed today
              </span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-red-50">
              <div className="w-2 h-2 rounded-full bg-red-400 ring-4 ring-red-100" />
              <span className="text-sm text-red-700">
                <span className="font-semibold">{stats.urgent}</span> urgent
              </span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg px-4 h-9 font-medium"
              asChild
            >
              <Link href="/analytics" className="flex items-center">
                <TargetIcon className="w-4 h-4" />
                <span>View Analytics</span>
                <ArrowRightIcon className="w-4 h-4 ml-1.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Today's Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <RocketIcon className="w-5 h-5 text-violet-500" />
            <h3 className="font-semibold text-gray-900">Today's Progress</h3>
          </div>
          <div className="text-sm text-gray-500">
            {stats.today.completed} of {stats.today.total} tasks completed
          </div>
        </div>
        <Progress 
          value={(stats.today.completed / Math.max(stats.today.total, 1)) * 100} 
          className="h-2"
        />
        <div className="mt-4 flex gap-4">
          <div className="flex-1 rounded-lg bg-violet-50 p-4">
            <div className="flex items-center gap-2 text-violet-600 mb-1">
              <TimerIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Due Today</span>
            </div>
            <p className="text-2xl font-bold text-violet-700">
              {stats.today.total - stats.today.completed}
            </p>
            <p className="text-sm text-violet-600 mt-1">remaining tasks</p>
          </div>
          <div className="flex-1 rounded-lg bg-emerald-50 p-4">
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <CheckCircledIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <p className="text-2xl font-bold text-emerald-700">
              {stats.completedToday}
            </p>
            <p className="text-sm text-emerald-600 mt-1">tasks today</p>
          </div>
          <div className="flex-1 rounded-lg bg-red-50 p-4">
            <div className="flex items-center gap-2 text-red-600 mb-1">
              <CrossCircledIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Urgent</span>
            </div>
            <p className="text-2xl font-bold text-red-700">
              {stats.urgent}
            </p>
            <p className="text-sm text-red-600 mt-1">tasks pending</p>
          </div>
        </div>
      </Card>

      {/* Upcoming Workload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <h3 className="font-semibold text-gray-900">Upcoming Workload</h3>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.upcomingWorkload}>
                <XAxis 
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => [`${value} tasks`, 'Tasks']}
                  contentStyle={{ 
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                  }}
                />
                <Bar dataKey="tasks" radius={[4, 4, 0, 0]}>
                  {stats.upcomingWorkload.map((entry, index) => (
                    <Cell 
                      key={index}
                      fill={entry.isToday ? "#8B5CF6" : "#E5E7EB"}
                      fillOpacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TargetIcon className="w-5 h-5 text-gray-400" />
              <h3 className="font-semibold text-gray-900">Week at a Glance</h3>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-gray-500">Today</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-gray-700">
                    {stats.today.total} tasks
                  </div>
                  <div className="text-sm text-gray-500">
                    {Math.round((stats.today.completed / Math.max(stats.today.total, 1)) * 100)}%
                  </div>
                </div>
                <Progress 
                  value={(stats.today.completed / Math.max(stats.today.total, 1)) * 100}
                  className="h-2"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-gray-500">Tomorrow</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-gray-700">
                    {stats.tomorrow.total} tasks
                  </div>
                  <div className="text-sm text-gray-500">
                    {Math.round((stats.tomorrow.completed / Math.max(stats.tomorrow.total, 1)) * 100)}%
                  </div>
                </div>
                <Progress 
                  value={(stats.tomorrow.completed / Math.max(stats.tomorrow.total, 1)) * 100}
                  className="h-2"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-gray-500">This Week</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-gray-700">
                    {stats.thisWeek.total} tasks
                  </div>
                  <div className="text-sm text-gray-500">
                    {Math.round((stats.thisWeek.completed / Math.max(stats.thisWeek.total, 1)) * 100)}%
                  </div>
                </div>
                <Progress 
                  value={(stats.thisWeek.completed / Math.max(stats.thisWeek.total, 1)) * 100}
                  className="h-2"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 
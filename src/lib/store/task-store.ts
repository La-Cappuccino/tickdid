"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { startOfDay, endOfDay, addDays, isWithinInterval } from 'date-fns'

export type Priority = 'p1' | 'p2' | 'p3' | 'p4'
export type TaskView = 'all' | 'today' | 'upcoming' | 'completed'

export interface Tag {
  id: string
  name: string
  color: string
}

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  createdAt: Date
  updatedAt?: Date
  dueDate?: Date
  endDate?: Date
  priority: Priority
  tags?: Tag[]
}

interface TaskState {
  tasks: Task[]
  tags: Tag[]
  currentView: TaskView
  selectedTags: string[]
  addTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt' | 'updatedAt'>) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'completed' | 'createdAt' | 'updatedAt'>>) => void
  addTag: (name: string, color: string) => void
  deleteTag: (id: string) => void
  updateTag: (id: string, updates: Partial<Omit<Tag, 'id'>>) => void
  setView: (view: TaskView) => void
  setSelectedTags: (tagIds: string[]) => void
  getFilteredTasks: () => Task[]
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      tags: [],
      currentView: 'all',
      selectedTags: [],

      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: Math.random().toString(36).substring(2),
              completed: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date() } : task
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  ...updates,
                  updatedAt: new Date(),
                }
              : task
          ),
        })),

      addTag: (name, color) =>
        set((state) => ({
          tags: [
            ...state.tags,
            {
              id: Math.random().toString(36).substring(2),
              name,
              color,
            },
          ],
        })),

      deleteTag: (id) =>
        set((state) => ({
          tags: state.tags.filter((tag) => tag.id !== id),
          tasks: state.tasks.map((task) => ({
            ...task,
            tags: task.tags?.filter((tag) => tag.id !== id),
          })),
        })),

      updateTag: (id, updates) =>
        set((state) => ({
          tags: state.tags.map((tag) =>
            tag.id === id ? { ...tag, ...updates } : tag
          ),
          tasks: state.tasks.map((task) => ({
            ...task,
            tags: task.tags?.map((tag) =>
              tag.id === id ? { ...tag, ...updates } : tag
            ),
          })),
        })),

      setView: (view) => set({ currentView: view }),
      
      setSelectedTags: (tagIds) => set({ selectedTags: tagIds }),

      getFilteredTasks: () => {
        const state = get()
        let filteredTasks = state.tasks

        // Filter by view
        switch (state.currentView) {
          case "completed":
            filteredTasks = filteredTasks.filter((task) => task.completed)
            break
          case "today":
            filteredTasks = filteredTasks.filter(
              (task) =>
                !task.completed &&
                task.dueDate &&
                isWithinInterval(task.dueDate, {
                  start: startOfDay(new Date()),
                  end: endOfDay(new Date()),
                })
            )
            break
          case "upcoming":
            const today = new Date()
            const nextWeek = addDays(today, 7)
            filteredTasks = filteredTasks.filter(
              (task) =>
                !task.completed &&
                task.dueDate &&
                isWithinInterval(task.dueDate, {
                  start: startOfDay(today),
                  end: endOfDay(nextWeek),
                })
            )
            break
          default:
            filteredTasks = filteredTasks.filter((task) => !task.completed)
        }

        // Filter by selected tags
        if (state.selectedTags.length > 0) {
          filteredTasks = filteredTasks.filter((task) =>
            task.tags?.some((tag) => state.selectedTags.includes(tag.id))
          )
        }

        // Sort tasks by priority and due date
        return filteredTasks.sort((a, b) => {
          // First sort by priority
          const priorityOrder = { p1: 0, p2: 1, p3: 2, p4: 3 }
          const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
          if (priorityDiff !== 0) return priorityDiff

          // Then sort by due date (tasks with due dates come first)
          if (a.dueDate && !b.dueDate) return -1
          if (!a.dueDate && b.dueDate) return 1
          if (a.dueDate && b.dueDate) {
            return a.dueDate.getTime() - b.dueDate.getTime()
          }

          // Finally sort by creation date
          return b.createdAt.getTime() - a.createdAt.getTime()
        })
      },
    }),
    {
      name: 'task-store',
    }
  )
) 
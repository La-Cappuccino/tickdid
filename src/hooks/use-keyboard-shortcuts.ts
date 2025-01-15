import { useEffect } from "react"
import { useTaskStore } from "@/lib/store/task-store"

interface ShortcutHandlers {
  onNewTask?: () => void
  onToggleSidebar?: () => void
}

export function useKeyboardShortcuts({ onNewTask, onToggleSidebar }: ShortcutHandlers) {
  const { toggleTask, deleteTask } = useTaskStore()

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Check if we're in an input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      // Command/Ctrl + K to open new task dialog
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault()
        onNewTask?.()
      }

      // Command/Ctrl + B to toggle sidebar
      if ((event.metaKey || event.ctrlKey) && event.key === "b") {
        event.preventDefault()
        onToggleSidebar?.()
      }

      // Command/Ctrl + / to show keyboard shortcuts help (we'll implement this later)
      if ((event.metaKey || event.ctrlKey) && event.key === "/") {
        event.preventDefault()
        // TODO: Show keyboard shortcuts help dialog
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onNewTask, onToggleSidebar])
} 
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
      // Don't handle shortcuts if we're in an input field or if a dialog is open
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLButtonElement ||
        document.querySelector('[role="dialog"]')
      ) {
        return
      }

      // Command/Ctrl + K to open new task dialog
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        event.stopPropagation()
        onNewTask?.()
        return
      }

      // Command/Ctrl + B to toggle sidebar
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
        event.preventDefault()
        event.stopPropagation()
        onToggleSidebar?.()
        return
      }

      // Command/Ctrl + / to show keyboard shortcuts help (we'll implement this later)
      if ((event.metaKey || event.ctrlKey) && event.key === "/") {
        event.preventDefault()
        event.stopPropagation()
        // TODO: Show keyboard shortcuts help dialog
        return
      }
    }

    window.addEventListener("keydown", handleKeyDown, { capture: true })
    return () => window.removeEventListener("keydown", handleKeyDown, { capture: true })
  }, [onNewTask, onToggleSidebar])
} 
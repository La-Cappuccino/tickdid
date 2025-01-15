import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { KeyboardIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"

interface ShortcutItemProps {
  keys: string[]
  description: string
}

function ShortcutItem({ keys, description }: ShortcutItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-600">{description}</span>
      <div className="flex items-center gap-1">
        {keys.map((key, index) => (
          <>
            <kbd
              key={key}
              className={cn(
                "px-2 py-1 text-xs font-semibold text-gray-800",
                "bg-gray-100 rounded-lg shadow-sm",
                "border border-gray-200",
                "min-w-[24px] text-center"
              )}
            >
              {key}
            </kbd>
            {index < keys.length - 1 && <span className="text-gray-400">+</span>}
          </>
        ))}
      </div>
    </div>
  )
}

export function KeyboardShortcutsDialog() {
  const [open, setOpen] = useState(false)

  const shortcuts = [
    { keys: ["⌘", "K"], description: "Create new task" },
    { keys: ["⌘", "B"], description: "Toggle sidebar" },
    { keys: ["⌘", "/"], description: "Show keyboard shortcuts" },
    { keys: ["⌘", "F"], description: "Search tasks (coming soon)" },
    { keys: ["⌘", "S"], description: "Save changes (when editing)" },
    { keys: ["Esc"], description: "Close dialog / Cancel edit" },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 rounded-lg",
            "hover:bg-gray-100",
            "transition-colors duration-300"
          )}
        >
          <KeyboardIcon className="h-4 w-4 text-gray-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 gap-0 rounded-xl overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-gray-100">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mt-1">
            Boost your productivity with these keyboard shortcuts.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4 space-y-1 max-h-[60vh] overflow-y-auto">
          {shortcuts.map((shortcut) => (
            <ShortcutItem
              key={shortcut.description}
              keys={shortcut.keys}
              description={shortcut.description}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
} 
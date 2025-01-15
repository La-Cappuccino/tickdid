"use client"

import { useState } from "react"
import { Tag, useTaskStore } from "@/lib/store/task-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PlusIcon, Cross2Icon, TextIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"

interface TagPickerProps {
  selectedTags: Tag[]
  onTagsChange: (tags: Tag[]) => void
}

const tagColors = [
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-yellow-500",
  "bg-lime-500",
  "bg-green-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-sky-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-fuchsia-500",
  "bg-pink-500",
  "bg-rose-500",
]

export function TagPicker({ selectedTags, onTagsChange }: TagPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const [selectedColor, setSelectedColor] = useState(tagColors[0])
  const tags = useTaskStore((state) => state.tags)
  const addTag = useTaskStore((state) => state.addTag)

  const handleAddTag = () => {
    if (newTagName.trim()) {
      addTag(newTagName.trim(), selectedColor)
      setNewTagName("")
      setSelectedColor(tagColors[0])
    }
  }

  const toggleTag = (tag: Tag) => {
    const isSelected = selectedTags.some((t) => t.id === tag.id)
    if (isSelected) {
      onTagsChange(selectedTags.filter((t) => t.id !== tag.id))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "h-10 justify-start font-normal",
            "hover:border-violet-500 hover:bg-violet-50",
            "transition-all duration-300",
            "rounded-lg border-gray-200"
          )}
        >
          <TextIcon className="mr-2 h-4 w-4" />
          {selectedTags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className={cn(
                    "rounded-sm px-1 font-normal",
                    "transition-all duration-300",
                    "hover:scale-105"
                  )}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-gray-400">Add tags</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none text-gray-900">Add New Tag</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className={cn(
                  "h-8",
                  "focus:border-violet-500 focus:ring-violet-500 focus:ring-opacity-25",
                  "transition-all duration-300",
                  "rounded-lg border-gray-200"
                )}
              />
              <Button
                size="sm"
                className={cn(
                  "h-8 px-2",
                  "bg-violet-600 hover:bg-violet-700 active:bg-violet-800",
                  "transition-all duration-300",
                  "hover:shadow-md",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                onClick={handleAddTag}
                disabled={!newTagName.trim()}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 pt-2">
              {tagColors.map((color) => (
                <button
                  key={color}
                  className={cn(
                    "h-6 w-6 rounded-full",
                    color,
                    "transition-all duration-300",
                    "hover:scale-110 hover:shadow-md",
                    selectedColor === color && "ring-2 ring-violet-500 ring-offset-2 scale-110"
                  )}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium leading-none text-gray-900">Available Tags</h4>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.some((t) => t.id === tag.id) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all duration-300",
                    selectedTags.some((t) => t.id === tag.id) ? tag.color : "hover:border-violet-500",
                    "hover:scale-105 hover:shadow-sm",
                    "active:scale-95"
                  )}
                  onClick={() => toggleTag(tag)}
                >
                  {tag.name}
                </Badge>
              ))}
              {tags.length === 0 && (
                <p className="text-sm text-gray-500 italic">No tags created yet</p>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 
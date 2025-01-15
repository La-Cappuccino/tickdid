"use client"

import { useTaskStore } from "@/lib/store/task-store"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function TagFilter() {
  const store = useTaskStore()
  const tags = store.tags
  const selectedTags = store.selectedTags
  const setSelectedTags = store.setSelectedTags

  const handleTagClick = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId))
    } else {
      setSelectedTags([...selectedTags, tagId])
    }
  }

  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="text-sm font-medium text-gray-500">Filter by tags:</div>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant="secondary"
            className={cn(
              "cursor-pointer transition-all duration-200 hover:opacity-80",
              tag.color,
              selectedTags.includes(tag.id)
                ? "ring-2 ring-violet-500 ring-offset-2"
                : "opacity-40 hover:opacity-100"
            )}
            onClick={() => handleTagClick(tag.id)}
          >
            {tag.name}
          </Badge>
        ))}
      </div>
    </div>
  )
} 
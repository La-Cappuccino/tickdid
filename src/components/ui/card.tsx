import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white shadow-sm",
        "transition-all duration-200",
        "hover:shadow-md",
        className
      )}
      {...props}
    />
  )
} 
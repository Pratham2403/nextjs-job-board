import { effect } from "zod"

interface BadgeProps {
  //This defines how Badge component should take which props will be passed to it
  children: React.ReactNode
}

export default function Badge({ children }: BadgeProps) {
  return (
    <span className="rounded border bg-muted px-2 py-0.5 text-sm font-medium text-muted-foreground">
      {children};
    </span>
  )
}

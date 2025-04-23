import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      user: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JD",
      },
      action: "resolved",
      bug: "Login page crash on mobile devices",
      project: "E-commerce Platform",
      time: "2 hours ago",
      status: "resolved",
    },
    {
      id: 2,
      user: {
        name: "Sarah Kim",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SK",
      },
      action: "assigned",
      bug: "Payment processing error",
      project: "E-commerce Platform",
      time: "4 hours ago",
      status: "in-progress",
    },
    {
      id: 3,
      user: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MJ",
      },
      action: "commented on",
      bug: "Navigation menu bug",
      project: "Admin Dashboard",
      time: "Yesterday at 4:30 PM",
      status: "open",
    },
    {
      id: 4,
      user: {
        name: "Emily Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "EC",
      },
      action: "created",
      bug: "API timeout issue",
      project: "API Gateway",
      time: "2 days ago",
      status: "critical",
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <p className="text-sm">
              <span className="font-medium">{activity.user.name}</span> {activity.action}{" "}
              <span className="font-medium">{activity.bug}</span> in{" "}
              <span className="text-muted-foreground">{activity.project}</span>
            </p>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">{activity.time}</p>
              <Badge
                variant={
                  activity.status === "resolved"
                    ? "success"
                    : activity.status === "in-progress"
                      ? "default"
                      : activity.status === "open"
                        ? "secondary"
                        : "destructive"
                }
                className="text-[10px] px-1 py-0"
              >
                {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

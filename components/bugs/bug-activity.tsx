import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Activity = {
  id: string
  action: string
  details: string
  created_at: string
  users: {
    id: string
    first_name: string
    last_name: string
    avatar_url: string | null
  }
}

export function BugActivity({ activities }: { activities: Activity[] }) {
  if (!activities || activities.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No activity recorded yet.</div>
  }

  return (
    <div className="space-y-4">
      <div className="relative pl-6 border-l">
        {activities.map((activity) => (
          <div key={activity.id} className="mb-4 last:mb-0">
            <div className="absolute -left-1.5">
              <Avatar className="h-3 w-3 border border-background">
                <AvatarImage
                  src={activity.users.avatar_url || "/placeholder.svg"}
                  alt={`${activity.users.first_name} ${activity.users.last_name}`}
                />
                <AvatarFallback className="text-[8px]">{`${activity.users.first_name[0]}${activity.users.last_name[0]}`}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm">
                <span className="font-medium">{`${activity.users.first_name} ${activity.users.last_name}`}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>{" "}
                <span className="font-medium">{activity.details}</span>
              </p>
              <p className="text-xs text-muted-foreground">{new Date(activity.created_at).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

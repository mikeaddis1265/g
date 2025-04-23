import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, ThumbsUp } from "lucide-react"

type Comment = {
  id: string
  content: string
  created_at: string
  users: {
    id: string
    first_name: string
    last_name: string
    avatar_url: string | null
  }
}

export function BugComments({ comments }: { comments: Comment[] }) {
  if (!comments || comments.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-4 text-muted-foreground">No comments yet. Be the first to comment!</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id}>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Avatar>
                <AvatarImage
                  src={comment.users.avatar_url || "/placeholder.svg"}
                  alt={`${comment.users.first_name} ${comment.users.last_name}`}
                />
                <AvatarFallback>{`${comment.users.first_name[0]}${comment.users.last_name[0]}`}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{`${comment.users.first_name} ${comment.users.last_name}`}</p>
                    <p className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleString()}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Comment actions</span>
                  </Button>
                </div>
                <p className="text-sm whitespace-pre-line">{comment.content}</p>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 gap-1 text-muted-foreground">
                    <ThumbsUp className="h-4 w-4" />
                    <span>0</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 text-muted-foreground">
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

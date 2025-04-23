import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase/client"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const bugId = params.id

  try {
    const { data: comments, error } = await supabase
      .from("bug_comments")
      .select(`
        *,
        users(id, first_name, last_name, avatar_url)
      `)
      .eq("bug_id", bugId)
      .order("created_at", { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json({ comments })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const bugId = params.id

  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 })
    }

    // Create the comment
    const { data: comment, error: commentError } = await supabase
      .from("bug_comments")
      .insert({
        bug_id: bugId,
        user_id: session.user.id,
        content,
      })
      .select(`
        *,
        users(id, first_name, last_name, avatar_url)
      `)
      .single()

    if (commentError) {
      throw commentError
    }

    // Record the activity
    const { error: activityError } = await supabase.from("bug_activity").insert({
      bug_id: bugId,
      user_id: session.user.id,
      action: "added comment",
      details: content.substring(0, 50) + (content.length > 50 ? "..." : ""),
    })

    if (activityError) {
      throw activityError
    }

    return NextResponse.json({ comment })
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}

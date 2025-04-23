// This file represents the database schema for reference
// The actual schema is created in Supabase

/*
Tables:
- users
- projects
- project_members
- bugs
- bug_comments
- bug_activity
- bug_attachments
*/

export type User = {
  id: string
  email: string
  first_name: string
  last_name: string
  avatar_url: string | null
  role: "admin" | "developer" | "tester" | "manager"
  created_at: string
}

export type Project = {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
  created_by: string
}

export type ProjectMember = {
  id: string
  project_id: string
  user_id: string
  role: "owner" | "member"
  created_at: string
}

export type Bug = {
  id: string
  title: string
  description: string
  steps_to_reproduce: string | null
  project_id: string
  status: "open" | "in_progress" | "testing" | "resolved" | "closed"
  priority: "critical" | "high" | "medium" | "low"
  severity: "critical" | "major" | "minor" | "trivial"
  reporter_id: string
  assignee_id: string | null
  created_at: string
  updated_at: string
  tags: string[]
}

export type BugComment = {
  id: string
  bug_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
}

export type BugActivity = {
  id: string
  bug_id: string
  user_id: string
  action: string
  details: string
  created_at: string
}

export type BugAttachment = {
  id: string
  bug_id: string
  user_id: string
  file_name: string
  file_size: number
  file_type: string
  file_url: string
  created_at: string
}

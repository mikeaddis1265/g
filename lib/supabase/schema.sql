-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'developer', 'tester', 'manager')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Create project_members table
CREATE TABLE IF NOT EXISTS project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, user_id)
);

-- Create bugs table
CREATE TABLE IF NOT EXISTS bugs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  steps_to_reproduce TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'testing', 'resolved', 'closed')),
  priority TEXT NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'major', 'minor', 'trivial')),
  reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  tags TEXT[] DEFAULT '{}'
);

-- Create bug_comments table
CREATE TABLE IF NOT EXISTS bug_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bug_id UUID REFERENCES bugs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create bug_activity table
CREATE TABLE IF NOT EXISTS bug_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bug_id UUID REFERENCES bugs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create bug_attachments table
CREATE TABLE IF NOT EXISTS bug_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bug_id UUID REFERENCES bugs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_projects_modtime
BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_bugs_modtime
BEFORE UPDATE ON bugs
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_bug_comments_modtime
BEFORE UPDATE ON bug_comments
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

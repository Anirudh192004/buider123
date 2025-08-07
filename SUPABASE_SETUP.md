# Supabase Integration Setup

This application now uses Supabase for authentication and email verification instead of the previous JavaScript file-based system.

## Quick Setup

### Option 1: Use MCP Integration (Recommended)
1. Click [Open MCP popover](#open-mcp-popover) in the Builder.io interface
2. Connect to **Supabase** from the available integrations
3. This will automatically configure your Supabase project and database

### Option 2: Manual Setup

## 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key from Settings > API

## 2. Update Environment Variables
Replace the placeholder values in your environment:

```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Create Database Table
Run this SQL in your Supabase SQL editor:

```sql
-- Create faculty_profiles table
CREATE TABLE faculty_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  faculty_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE faculty_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON faculty_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON faculty_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON faculty_profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

## 4. Configure Email Settings
1. Go to Authentication > Settings in your Supabase dashboard
2. Configure your email provider (SMTP or built-in)
3. Customize email templates if needed

## Features Enabled

✅ **Real Email Verification**: Users receive actual verification emails
✅ **Secure Authentication**: Passwords are hashed and stored securely
✅ **Faculty Code Generation**: Automatic unique code generation (CS + 3 digits)
✅ **Profile Management**: Faculty profiles linked to auth users
✅ **Email Resend**: Users can request new verification emails

## Migration from JavaScript Files

The application now uses:
- **Supabase Auth** instead of `server/db/faculty.js`
- **Real email verification** instead of console.log simulation
- **PostgreSQL database** instead of in-memory storage
- **Secure password hashing** instead of plain text passwords

## Testing

1. Sign up with a real email address
2. Check your email for verification link
3. Click the verification link
4. Return to the app and log in

The demo credentials are no longer needed as you'll be creating real accounts!

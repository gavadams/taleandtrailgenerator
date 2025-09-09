# Setup Guide

This guide will help you set up the Tale and Trail Generator application.

## 1. Supabase Setup

### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Wait for the project to be ready (usually 2-3 minutes)

### Get Your Supabase Credentials
1. Go to Settings → API
2. Copy the following values:
   - Project URL
   - Anon public key
   - Service role key (keep this secret!)

### Set Up the Database
1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `src/lib/database/schema.sql`
3. Paste and run the SQL to create the necessary tables

## 2. AI API Setup

Choose one or more AI providers:

### OpenAI (Recommended)
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account and add billing information
3. Go to API Keys and create a new key
4. Copy the key (starts with `sk-`)

### Anthropic Claude
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account and add billing information
3. Go to API Keys and create a new key
4. Copy the key

### Google AI (Gemini)
1. Go to [makersuite.google.com](https://makersuite.google.com)
2. Create an account
3. Go to API Keys and create a new key
4. Copy the key

## 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# AI API Keys (choose one or more)
OPENAI_API_KEY=sk-your-openai-key-here
ANTHROPIC_API_KEY=your-anthropic-key-here
GOOGLE_AI_API_KEY=your-google-ai-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 4. Install and Run

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## 5. First Use

1. Open [http://localhost:3000](http://localhost:3000)
2. Sign up for a new account
3. Create your first game!

## Troubleshooting

### Common Issues

**"Invalid API key" errors:**
- Check that your API keys are correctly copied
- Ensure billing is set up for paid APIs (OpenAI, Anthropic)
- Verify the keys have the correct permissions

**Database connection errors:**
- Verify your Supabase URL and keys are correct
- Check that the database schema was applied successfully
- Ensure RLS (Row Level Security) is enabled

**Authentication issues:**
- Clear your browser cache and cookies
- Check that your Supabase project is active
- Verify the auth settings in Supabase dashboard

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Check the terminal for server errors
3. Verify all environment variables are set correctly
4. Open an issue on GitHub with error details

## Production Deployment

For production deployment:

1. **Set up production Supabase project**
2. **Configure production environment variables**
3. **Deploy to Vercel, Netlify, or your preferred platform**
4. **Update `NEXT_PUBLIC_APP_URL` to your production URL**

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

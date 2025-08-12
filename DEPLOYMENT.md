# 🚀 Deployment Guide - HotelOps

## Prerequisites

- Vercel account
- Supabase account (or any PostgreSQL database)
- GitHub repository

## 1. Supabase Setup

1. **Create a new Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization and create the project

2. **Get your database URL:**
   - Go to Settings → Database
   - Copy the connection string under "Connection string" → "URI"
   - It should look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-REF].supabase.co:5432/postgres`

## 2. Vercel Deployment

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/bofletcher/hotelops)

### Option 2: Manual Deploy

1. **Connect GitHub to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables:**
   - In Vercel project settings, go to "Environment Variables"
   - Add the following:
     ```
     DATABASE_URL=your_supabase_connection_string_here
     ```

3. **Deploy:**
   - Vercel will automatically deploy when you push to main branch
   - The build process will:
     - Generate Prisma client
     - Push database schema to Supabase
     - Build the Next.js application

## 3. Database Migration

The deployment process automatically handles database migrations using `prisma db push`. This will:

- Create all tables defined in your Prisma schema
- Apply any schema changes
- Generate the Prisma client

## 4. Environment Variables

### Required:
- `DATABASE_URL` - Your PostgreSQL connection string

### Optional:
- `NEXTAUTH_SECRET` - If you plan to add authentication
- `NEXTAUTH_URL` - Your deployment URL
- `NEXT_PUBLIC_VERCEL_URL` - For client-side API calls

## 5. Troubleshooting

### Build Issues:
- Ensure `DATABASE_URL` is set correctly
- Check that your database is accessible from Vercel
- Verify Prisma schema syntax

### Database Issues:
- Make sure Supabase project is active
- Check connection string format
- Ensure database user has proper permissions

### Common Commands:
```bash
# Local development
npm run dev

# Build for production
npm run build

# Deploy database schema
npm run db:push

# Test database connection
npm run migrate
```

## 6. Post-Deployment

1. **Verify deployment:**
   - Visit your Vercel URL
   - Check that the application loads correctly
   - Test adding/editing properties

2. **Monitor logs:**
   - Check Vercel function logs for any errors
   - Monitor Supabase dashboard for database activity

3. **Set up custom domain (optional):**
   - In Vercel project settings, go to "Domains"
   - Add your custom domain

## 7. Continuous Deployment

Your app is now set up for continuous deployment:
- Push to `main` branch → Automatic deployment
- Database schema changes → Automatically applied
- Environment variables → Managed through Vercel dashboard

## Support

If you encounter issues:
1. Check Vercel build logs
2. Verify environment variables
3. Test database connection locally
4. Review this deployment guide

Happy deploying! 🎉

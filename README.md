# 🏨 HotelOps - Property Management System

A beautiful, modern hotel property management application built with Next.js, shadcn/ui, and Prisma.

## ✨ Features

- **🏢 Property Management** - Add, edit, and delete hotel properties
- **📊 Key Metrics** - Track ADR, Occupancy, RevPAR, and room counts
- **🎨 Beautiful UI** - Modern design with shadcn/ui components
- **📱 Responsive** - Works perfectly on desktop and mobile
- **🔔 Toast Notifications** - Real-time feedback for all actions
- **⚡ Real-time Updates** - React Query for instant cache updates

## 🚀 Tech Stack

- **Framework:** Next.js 15 with App Router
- **Database:** Prisma with PostgreSQL (production) / SQLite (development)
- **UI Components:** shadcn/ui + Tailwind CSS v4
- **State Management:** React Query (TanStack Query)
- **Icons:** Lucide React
- **Notifications:** Sonner (Toast)
- **Deployment:** Vercel

## 🛠 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bofletcher/hotelops.git
   cd hotelops
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the database:**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations (creates SQLite database locally)
   npx prisma db push
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 🌐 Deploy to Vercel

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/bofletcher/hotelops)

### Option 2: Manual Deploy

1. **Connect your GitHub repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Set up Vercel Postgres database:**
   - In your Vercel dashboard, go to your project
   - Click on "Storage" tab
   - Click "Create Database" → "Postgres"
   - Copy the `DATABASE_URL` from the `.env.local` tab

3. **Configure environment variables:**
   - In Vercel project settings, go to "Environment Variables"
   - Add: `DATABASE_URL` with your Postgres connection string

4. **Deploy:**
   - Vercel will automatically deploy when you push to main branch
   - Database migrations will run automatically on first deploy

## 📦 Database Schema

```prisma
model Property {
  id        String   @id @default(cuid())
  name      String
  city      String
  state     String
  rooms     Int
  adr       Float    // Average Daily Rate
  occupancy Float    // Occupancy rate (0.0 to 1.0)
  revpar    Float    // Revenue Per Available Room
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🎨 UI Components

Built with [shadcn/ui](https://ui.shadcn.com/) for a consistent, accessible design system:
- Cards with hover effects and animations
- Form inputs with validation styling
- Toast notifications for user feedback
- Responsive navigation with mobile menu
- Alert dialogs for confirmations

## 📱 Mobile-First Design

- Responsive grid layouts
- Touch-friendly buttons and inputs
- Hamburger menu navigation
- Optimized for all screen sizes

## 🔧 Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes
npx prisma studio    # Open Prisma Studio
```

## 📄 License

MIT License - feel free to use this project for your own hotel management needs!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

Built with ❤️ using Next.js and shadcn/ui

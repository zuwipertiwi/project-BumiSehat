# BumiSehat - Next.js Application

A modern Next.js application for BumiSehat project with MongoDB integration and REST API endpoints.

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or later
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env.local

# 3. Update MONGODB_URI in .env.local with your MongoDB connection string
# Example: MONGODB_URI=mongodb://127.0.0.1:27017/bumisehat
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
project-BumiSehat/
├── app/
│   ├── api/                    # API Routes
│   │   └── admin/tips/        # Tips management endpoints
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── lib/
│   ├── db/                    # MongoDB connection
│   └── models/                # Mongoose schemas
├── components/                # React components
├── public/                    # Static assets
└── package.json
```

## 🔌 API Endpoints

### Tips Management
- `GET /api/admin/tips` - Get all tips with pagination & filters
- `POST /api/admin/tips` - Create new tip
- `GET /api/admin/tips/[id]` - Get single tip
- `PUT /api/admin/tips/[id]` - Update tip
- `DELETE /api/admin/tips/[id]` - Delete tip
- `PATCH /api/admin/tips/[id]` - Toggle tip status

## 📚 Database

This project uses MongoDB with Mongoose for data modeling.

### Models
- `User` - User accounts
- `Tips` - Tips content
- `Kategori` - Categories
- `Aktivitas` - Activities

## 🌐 Deployment

### Vercel (Recommended)

```bash
# 1. Push code to GitHub
git push origin main

# 2. Connect repository to Vercel
# Visit https://vercel.com and import your repository

# 3. Set environment variables in Vercel dashboard
# Add MONGODB_URI to Environment Variables

# 4. Deploy
# Vercel will auto-deploy on push
```

### Environment Variables for Production
```
MONGODB_URI=your-production-mongodb-uri
NEXTAUTH_SECRET=generate-random-secret
NEXTAUTH_URL=https://your-domain.com
```

## 📦 Tech Stack

- **Next.js 16** - React framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## 🔐 Security Notes

- Keep `.env.local` out of version control (in `.gitignore`)
- Use environment variables for sensitive data
- Validate all user inputs in API routes
- Implement authentication middleware for protected routes

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Mongoose Documentation](https://mongoosejs.com)
- [Vercel Deployment Guide](https://vercel.com/docs)


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

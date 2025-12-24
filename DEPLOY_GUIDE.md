# BumiSehat - Aplikasi Edukatif dan Pencatatan Aktivitas Lingkungan

Platform web untuk pendokumentasian dan monitoring aktivitas ramah lingkungan dengan fokus pada pelestarian tanah dan tumbuhan.

## 🚀 Fitur Utama

- **Autentikasi**: Login/Register dengan JWT
- **Pencatatan Aktivitas**: Catat aktivitas lingkungan dengan kategori
- **Dashboard**: Monitoring progress dan statistics
- **Tips & Edukasi**: Artikel edukatif tentang lingkungan
- **Admin Panel**: Manajemen konten dan aktivitas user

## 🏗️ Tech Stack

### Backend
- **Framework**: AdonisJS 5 (TypeScript)
- **Database**: MongoDB dengan Mongoose
- **Authentication**: JWT + Bcrypt
- **Validation**: AdonisJS Validator

### Frontend
- **Templating**: Edge.js (AdonisJS view engine)
- **Styling**: Webpack Encore
- **Assets**: CSS & JavaScript bundling

## 📋 Prerequisites

- Node.js >= 18
- MongoDB Atlas Account (or local MongoDB)
- npm atau yarn

## 🔧 Setup Lokal

### 1. Clone Repository
```bash
git clone <repository-url>
cd UAS-PPL-BumiSehat-main
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` dan set:
```
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bumisehat
```

### 4. Run Development Server
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3333`

### 5. Build untuk Production
```bash
npm run build
```

## 📦 Deploy ke Vercel

### Prerequisites
- Vercel Account
- Git Repository (GitHub/GitLab)
- MongoDB Atlas URL

### Langkah Deploy

1. **Push ke GitHub**
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

2. **Connect ke Vercel**
   - Buka https://vercel.com/new
   - Import Git Repository
   - Pilih project folder

3. **Set Environment Variables di Vercel**
   - Masuk ke Project Settings → Environment Variables
   - Tambahkan:
     ```
     MONGODB_URI = your_mongodb_atlas_uri
     NODE_ENV = production
     APP_KEY = your_app_key
     ```

4. **Deploy**
   - Vercel akan automatically build dan deploy
   - URL akan tersedia setelah deploy selesai

## 📚 API Routes

### Authentication
- `POST /login` - Login user
- `POST /register` - Register user baru
- `GET /logout` - Logout

### User
- `GET /dashboard` - Dashboard user
- `GET /profil` - Lihat profil
- `GET /edit-profil` - Edit profil form
- `POST /edit-profil` - Update profil

### Aktivitas
- `GET /aktivitas` - Halaman aktivitas
- `POST /aktivitas` - Buat aktivitas baru
- `GET /api/aktivitas` - Get aktivitas (JSON)
- `PUT /api/aktivitas/:id` - Update aktivitas
- `DELETE /api/aktivitas/:id` - Delete aktivitas

### Content
- `GET /tips` - Lihat tips lingkungan
- `GET /tips/:id` - Detail tips
- `GET /edukasi` - Lihat artikel edukasi
- `GET /edukasi/:id` - Detail artikel

### Admin
- `GET /admin` - Admin dashboard
- `GET /admin/aktivitas` - Kelola aktivitas
- `GET /admin/tips` - Kelola tips
- `GET /admin/edukasi` - Kelola edukasi

## 🗄️ Database Schema

### Collections
- **users** - Data pengguna
- **aktivitas** - Pencatatan aktivitas user
- **kategoris** - Kategori aktivitas
- **tips** - Tips lingkungan
- **edukasis** - Artikel edukatif
- **kategoriTips** - Kategori tips

## 👤 Testing Credentials

### Admin
- Email: `admin@gmail.com`
- Password: `admin123`

## 🤝 Kontribusi

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📧 Support

Untuk pertanyaan atau masalah, silakan buat issue di repository ini.

---

**Built with ❤️ for environmental conservation**

# Deploy dengan MongoDB Atlas + Vercel

## Step 1: Setup MongoDB Atlas

### 1.1 Whitelist IP untuk Development & Production
1. Buka [MongoDB Atlas](https://cloud.mongodb.com)
2. Login ke akun Anda
3. Pilih Project → **Network Access** (di sidebar kiri)
4. Klik **Add IP Address**
5. Pilih **Allow access from anywhere** (0.0.0.0/0)
6. Klik **Confirm**

### 1.2 Dapatkan Connection String
1. Di MongoDB Atlas, klik **Database** (di sidebar)
2. Cari cluster Anda, klik **Connect**
3. Pilih **Drivers** → **Node.js**
4. Copy connection string yang muncul:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>?retryWrites=true&w=majority
   ```
5. Ganti `<username>`, `<password>`, dan `<database>` dengan data Anda

---

## Step 2: Update Environment Variables

### Development (.env.local)
```
MONGODB_URI=mongodb+srv://bumisehat:YOUR_PASSWORD@cluster0.sivprf6.mongodb.net/bumisehat?appName=Cluster0&retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-this-in-production-environment-please
NODE_ENV=development
```

Ganti `YOUR_PASSWORD` dengan password database user.

---

## Step 3: Deploy ke Vercel

### 3.1 Siapkan GitHub
```bash
git init
git add .
git commit -m "Initial commit - BumiSehat"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/project-BumiSehat.git
git push -u origin main
```

### 3.2 Deploy di Vercel
1. Buka [Vercel.com](https://vercel.com)
2. Login dengan GitHub
3. Klik **Add New...** → **Project**
4. Pilih repository `project-BumiSehat`
5. Vercel auto-detect Next.js → klik **Deploy**

### 3.3 Setup Environment Variables di Vercel
1. Di Vercel dashboard, pilih project → **Settings**
2. Klik **Environment Variables** (di sidebar)
3. Tambahkan:
   - **MONGODB_URI**: `mongodb+srv://bumisehat:PASSWORD@cluster0.sivprf6.mongodb.net/bumisehat?...`
   - **JWT_SECRET**: `your-production-secret-key-change-this`
   - **NODE_ENV**: `production`
4. Klik **Save**

### 3.4 Trigger Redeploy
1. Di tab **Deployments**, klik **Redeploy** untuk apply environment variables

---

## Step 4: Test Production

Setelah deployed, test di:
```
https://your-project.vercel.app/register
https://your-project.vercel.app/login
```

---

## Troubleshooting

### MongoDB Connection Error di Production
**Kemungkinan penyebab:**
- IP belum di-whitelist → whitelist `0.0.0.0/0`
- Connection string salah → copy ulang dari Atlas
- Password salah → reset password di MongoDB Atlas

### Redeploy Otomatis
Setiap push ke `main` akan auto-deploy di Vercel.

### View Logs
Di Vercel dashboard → **Deployments** → pilih deployment → **Logs**

---

## Checklist Sebelum Deploy

- [ ] IP 0.0.0.0/0 sudah di-whitelist di MongoDB Atlas
- [ ] Connection string sudah diupdate di `.env.local`
- [ ] Tested lokal sebelum push ke GitHub
- [ ] Code sudah di-push ke GitHub
- [ ] Environment variables sudah di-set di Vercel
- [ ] Redeploy sudah triggered di Vercel

---

## Kontak Support
Jika ada error saat deploy, check:
- Vercel logs: https://vercel.com/YOUR_USERNAME/project-bumisehat/logs
- MongoDB Atlas Network Access: Pastikan 0.0.0.0/0 sudah ada

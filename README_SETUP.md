# Setup MongoDB Lokal untuk BumiSehat

## Prasyarat
- Docker installed (download dari https://www.docker.com/products/docker-desktop)

## Langkah-langkah

### 1. Mulai MongoDB dengan Docker Compose
```bash
docker-compose up -d
```

Atau jika menggunakan Docker Desktop, buka terminal dan jalankan:
```bash
docker-compose up -d
```

### 2. Verifikasi MongoDB Running
```bash
docker ps
```

Cek apakah ada container `bumisehat-mongodb` dengan status "Up".

### 3. Install Dependencies (jika belum)
```bash
npm install
```

### 4. Jalankan Dev Server
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

### 5. Test Registration
- Buka `http://localhost:3000/register`
- Isi form dengan data test
- Klik "Daftar"
- Seharusnya berhasil tanpa error MongoDB connection

## Troubleshooting

### MongoDB tidak konek
```bash
# Cek status
docker ps

# Lihat logs
docker logs bumisehat-mongodb

# Restart
docker-compose down
docker-compose up -d
```

### Port 27017 sudah terpakai
Edit `docker-compose.yml`:
```yaml
ports:
  - "27018:27017"  # ubah ke port lain
```

Lalu update `.env.local`:
```
MONGODB_URI=mongodb://127.0.0.1:27018/bumisehat
```

### Bersihkan data MongoDB
```bash
docker-compose down -v
```

Ini akan hapus semua data dan mulai fresh.

## Production (MongoDB Atlas)

Untuk production, gunakan MongoDB Atlas:
1. Buat cluster di https://www.mongodb.com/cloud/atlas
2. Whitelist IP address (atau 0.0.0.0/0)
3. Update `.env.local` atau `.env.production`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bumisehat
```

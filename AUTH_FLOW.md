# 🔐 Registrasi & Login Flow

## Alur Registrasi

### 1. User Klik "Mulai Perjalanan Hijau" di Homepage
- Redirect ke `/register`

### 2. User Isi Form Registrasi
```
Nama Lengkap: [input]
Email: [input]
Password: [input]
Konfirmasi Password: [input]
```

### 3. Submit Form
**Client-side validation:**
- Nama: tidak boleh kosong
- Email: format valid
- Password: minimal 6 karakter
- Konfirmasi Password: harus sama dengan password

**Server-side (POST /api/auth/register):**
1. Validasi ulang semua input
2. Cek email apakah sudah terdaftar
3. Hash password dengan bcryptjs (10 salt rounds)
4. Simpan user ke MongoDB dengan model `User`
5. Return success message

### 4. Respons Registrasi
**Success (201):**
```json
{
  "message": "Registrasi berhasil! Silakan login.",
  "user": {
    "id": "userid123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error (400/500):**
```json
{
  "message": "Email sudah terdaftar"
}
```

### 5. User Redirect ke Login
Otomatis redirect ke `/login` setelah 2 detik

---

## Alur Login

### 1. User Klik "Masuk ke Akun" di Homepage
- Redirect ke `/login`

### 2. User Isi Form Login
```
Email: [input]
Password: [input]
```

### 3. Submit Form
**Client-side validation:**
- Email: tidak boleh kosong
- Password: tidak boleh kosong

**Server-side (POST /api/auth/login):**
1. Cari user berdasarkan email (case-insensitive)
2. Compare password dengan bcrypt
3. Jika match, generate JWT token (7 hari expiry)
4. Return token dan user data

### 4. Respons Login
**Success (200):**
```json
{
  "message": "Login berhasil!",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "userid123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error (401):**
```json
{
  "message": "Email atau password salah"
}
```

### 5. Token Disimpan
```javascript
localStorage.setItem('token', response.token)
```

### 6. Redirect ke Dashboard
Otomatis redirect ke `/dashboard` setelah 1.5 detik

---

## Database Schema (MongoDB)

### User Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  foto: String (optional),
  nomor_telepon: String (optional),
  lokasi: String (optional),
  tanggal_lahir: Date (optional),
  jenis_kelamin: String (optional),
  bio: String (optional),
  profil_publik: Boolean (default: true),
  share_aktivitas: Boolean (default: true),
  notifikasi_email: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## Environment Variables yang Diperlukan

```env
# Database
MONGODB_URI=mongodb://127.0.0.1:27017/bumisehat

# JWT Secret (untuk production)
JWT_SECRET=your-super-secret-key-here
```

---

## Keamanan

✅ **Implementasi:**
- Password di-hash dengan bcryptjs (10 rounds)
- JWT token dengan expiry 7 hari
- Email validation sebelum registrasi
- Case-insensitive email lookup
- HTTP-only cookie recommended untuk production

⚠️ **TODO untuk Production:**
- Implementasi refresh token
- Email verification sebelum aktivasi account
- Rate limiting untuk login/register attempts
- CORS configuration
- HTTPS mandatory
- Environment variable validation

---

## Testing

### Test Registrasi
```bash
# Registrasi baru
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Login
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## Troubleshooting

| Error | Penyebab | Solusi |
|-------|---------|--------|
| "Email sudah terdaftar" | Email sudah digunakan | Gunakan email berbeda atau reset password |
| "Email atau password salah" | Password tidak cocok | Cek password atau reset |
| "MONGODB_URI not set" | Environment variable hilang | Set MONGODB_URI di .env.local |
| "Connection refused" | MongoDB server offline | Pastikan MongoDB running |


# 🧪 Testing Auth Flow - Panduan Lengkap

## ✅ Perbaikan yang Dilakukan

### 1. **Password Handling**
- ❌ **Sebelumnya**: Hash password di register API + pre-save hook = double hash
- ✅ **Sekarang**: Hanya pre-save hook yang hash password, register API kirim plain password

### 2. **Login Verification**
- ❌ **Sebelumnya**: Manual bcrypt.compare() di login API
- ✅ **Sekarang**: Gunakan `user.comparePassword()` method dari model

### 3. **Error Handling & Logging**
- ✅ Logging di setiap step registrasi dan login
- ✅ Email validation dengan regex
- ✅ Password length validation
- ✅ Better error messages untuk user

### 4. **Database Connection**
- ✅ Improved MongoDB connection dengan timeout settings
- ✅ Connection logging untuk debugging

---

## 🚀 Cara Test Auth Flow

### **Opsi 1: Test via Browser (RECOMMENDED)**

#### Step 1: Start Dev Server
```bash
npm run dev
# http://localhost:3000
```

#### Step 2: Register User Baru
1. Buka http://localhost:3000
2. Klik "🚀 Mulai Perjalanan Hijau"
3. Isi form:
   - Nama: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Konfirmasi: `password123`
4. Klik "Daftar Sekarang"
5. Tunggu redirect ke `/login`

#### Step 3: Login dengan Akun yang Baru Didaftarkan
1. Isi form login:
   - Email: `test@example.com`
   - Password: `password123`
2. Klik "Masuk Sekarang"
3. Tunggu redirect ke `/dashboard`
4. ✅ Success! Token tersimpan di localStorage

---

### **Opsi 2: Test via cURL (Command Line)**

#### Register:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Registrasi berhasil! Silakan login.",
  "user": {
    "id": "user_id_here",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

#### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login berhasil!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id_here",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

---

## 🔍 Debugging Tips

### Lihat Console Logs

Saat dev server running, perhatikan logs:

```
📝 Register attempt: { name: 'Test User', email: 'test@example.com' }
🔌 Connecting to MongoDB...
✅ Connected to MongoDB
🔍 Checking if email exists...
✅ Email not registered, proceeding...
💾 Creating new user...
✅ User saved successfully: 507f1f77bcf4a...
✅ Registration successful for: test@example.com
```

### Jika Password Salah Saat Login:

```
🔐 Login attempt: { email: 'test@example.com' }
🔌 Connecting to MongoDB...
✅ Connected to MongoDB
🔍 Finding user by email: test@example.com
✅ User found: 507f1f77bcf4a...
🔐 Verifying password...
⚠️ Password mismatch for user: test@example.com
```

### Jika Email Tidak Ditemukan:

```
🔐 Login attempt: { email: 'wrong@example.com' }
🔌 Connecting to MongoDB...
✅ Connected to MongoDB
🔍 Finding user by email: wrong@example.com
⚠️ User not found: wrong@example.com
```

---

## ⚙️ Troubleshooting

| Masalah | Solusi |
|---------|--------|
| **"MongoDB connection failed"** | Pastikan MongoDB running (`mongod`) atau set MONGODB_URI yang benar di .env.local |
| **"Email atau password salah"** | Cek apakah email dan password sudah benar, case-sensitive password |
| **"Email sudah terdaftar"** | Gunakan email yang belum pernah terdaftar sebelumnya |
| **401 Unauthorized saat login** | Clear localStorage dan coba register/login lagi |
| **Token not in localStorage** | Cek console browser > Application > Local Storage |

---

## 📊 API Endpoints Summary

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/auth/register` | Register user baru |
| `POST` | `/api/auth/login` | Login dan dapatkan token |

---

## 🔐 Token Storage

Setelah login berhasil:

```javascript
// Browser Console
localStorage.getItem('token')
// Output: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// User data juga tersimpan
localStorage.getItem('user')
// Output: '{"id":"...","name":"Test User","email":"test@example.com"}'
```

---

## ✨ Fitur yang Sudah Working

✅ **Register**
- Validasi input (nama, email, password)
- Email format validation
- Check duplicate email
- Password hashing dengan bcryptjs
- Save user ke MongoDB

✅ **Login**
- Email lookup (case-insensitive)
- Password verification
- JWT token generation (7 days expiry)
- Return token & user data
- localStorage storage

✅ **Dashboard**
- Check token exists
- Redirect ke login jika tidak ada token
- Show user info
- Logout functionality

---

## 🎯 Next Steps untuk Production

1. ✅ Set `JWT_SECRET` di environment variables
2. ✅ Set `MONGODB_URI` untuk production database
3. ⏳ Implement refresh token untuk better security
4. ⏳ Add email verification sebelum aktivasi
5. ⏳ Add rate limiting untuk login attempts
6. ⏳ Add forgot password functionality
7. ⏳ Add password reset email flow

---

## 📝 Catatan

- Default JWT expiry: **7 hari**
- Default bcrypt salt rounds: **10**
- Password minimum length: **6 karakter**
- Email harus unique dan case-insensitive

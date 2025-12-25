'use client'

import Link from 'next/link'
import { useState } from 'react'
import { setAuthToken } from '@/lib/auth'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email.trim()) {
      setMessage('❌ Email tidak boleh kosong')
      return
    }

    if (!formData.password) {
      setMessage('❌ Password tidak boleh kosong')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      console.log('📤 Sending login request...')
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      })

      const data = await response.json()
      console.log('📥 Login response:', { status: response.status, data })

      if (response.ok && data.success && data.token) {
        setMessage('✅ Login berhasil! Mengalihkan ke dashboard...')
        // Simpan token menggunakan helper
        setAuthToken(data.token, data.user)

        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1500)
      } else {
        setMessage(`❌ ${data.message || 'Login gagal'}`)
      }
    } catch (error: any) {
      console.error('❌ Login error:', error)
      setMessage('❌ Terjadi kesalahan koneksi. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">🌱</span>
            </div>
            <span className="text-2xl font-bold text-emerald-700">BumiSehat</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Masuk Akun</h1>
          <p className="text-gray-600 mt-2">Lanjutkan perjalanan hijau Anda</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan email Anda"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password Anda"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-lg ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Sedang Masuk...' : '📱 Masuk Sekarang'}
            </button>
          </form>

          {/* Forgot Password */}
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              Lupa password?
            </a>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Belum punya akun?{' '}
            <Link href="/register" className="text-emerald-600 font-semibold hover:text-emerald-700">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

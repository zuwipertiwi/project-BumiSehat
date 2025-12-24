'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Cek token dan user dari localStorage
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token) {
      router.push('/login')
      return
    }

    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">🌱</span>
            </div>
            <span className="text-xl font-bold text-emerald-700">BumiSehat</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/profil" className="text-gray-700 hover:text-emerald-600 font-medium">
              👤 {user?.name || 'User'}
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Selamat Datang di Dashboard 👋</h1>
          <p className="text-gray-600 text-lg">Halo {user?.name || 'Pengguna'}! Kelola aktivitas ramah lingkunganmu dan track dampak positifmu</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="text-4xl font-bold text-emerald-600 mb-2">12</div>
            <p className="text-gray-600 font-medium">Aktivitas Tercatat</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">8</div>
            <p className="text-gray-600 font-medium">Tips Dibaca</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="text-4xl font-bold text-green-600 mb-2">24</div>
            <p className="text-gray-600 font-medium">Pohon Ditanam</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="text-4xl font-bold text-yellow-600 mb-2">156</div>
            <p className="text-gray-600 font-medium">Poin Keberlanjutan</p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Aktivitas */}
          <Link href="/aktivitas">
            <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-all cursor-pointer group">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-emerald-600">Aktivitas</h3>
              <p className="text-gray-600 mb-4">Catat aktivitas ramah lingkunganmu sehari-hari</p>
              <p className="text-emerald-600 font-semibold">Lihat Selengkapnya →</p>
            </div>
          </Link>

          {/* Tips */}
          <Link href="/tips">
            <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-all cursor-pointer group">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-emerald-600">Tips Konservasi</h3>
              <p className="text-gray-600 mb-4">Pelajari tips dan trik untuk menjaga lingkungan</p>
              <p className="text-emerald-600 font-semibold">Lihat Selengkapnya →</p>
            </div>
          </Link>

          {/* Profil */}
          <Link href="/profil">
            <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-all cursor-pointer group">
              <div className="text-5xl mb-4">👤</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-emerald-600">Profil</h3>
              <p className="text-gray-600 mb-4">Kelola profil dan preferensi akun Anda</p>
              <p className="text-emerald-600 font-semibold">Lihat Selengkapnya →</p>
            </div>
          </Link>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Aktivitas Terbaru</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4 py-3">
              <p className="font-semibold text-gray-800">Menanam 5 pohon di taman lokal</p>
              <p className="text-gray-600 text-sm">2 hari yang lalu</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 py-3">
              <p className="font-semibold text-gray-800">Membaca tips: "Cara Membuat Kompos"</p>
              <p className="text-gray-600 text-sm">5 hari yang lalu</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4 py-3">
              <p className="font-semibold text-gray-800">Mengurangi plastik sekali pakai</p>
              <p className="text-gray-600 text-sm">1 minggu yang lalu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

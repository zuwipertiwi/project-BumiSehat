'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUser, getAuthToken, clearAuth } from '@/lib/auth'

interface Aktivitas {
  _id: string
  judul: string
  deskripsi: string
  createdAt: string
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [aktivitasCount, setAktivitasCount] = useState(0)
  const [pohonDitanam, setPohonDitanam] = useState(0)
  const [recentAktivitas, setRecentAktivitas] = useState<Aktivitas[]>([])
  const router = useRouter()

  useEffect(() => {
    // Cek token dan user dari localStorage
    const token = getAuthToken()
    const userData = getUser()

    if (!token || !userData) {
      console.log('No token or user data found, redirecting to login')
      router.push('/login')
      return
    }

    setUser(userData)

    // Fetch aktivitas dan tips data
    const fetchData = async () => {
      try {
        console.log('📥 Fetching dashboard data...')

        // Fetch aktivitas
        const aktivitasResponse = await fetch('/api/aktivitas')
        const aktivitasData = await aktivitasResponse.json()

        if (aktivitasData.success) {
          console.log('✅ Aktivitas fetched:', aktivitasData.data.length)
          setAktivitasCount(aktivitasData.data.length)

          // Calculate total pohon ditanam
          const totalPohon = aktivitasData.data.reduce((sum: number, a: any) => {
            return sum + (a.pohon_ditanam || 0)
          }, 0)
          setPohonDitanam(totalPohon)
          console.log('🌳 Total pohon ditanam:', totalPohon)

          // Get last 3 aktivitas
          const recent = aktivitasData.data.slice(0, 3)
          setRecentAktivitas(recent)
        }
      } catch (error) {
        console.error('❌ Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = async () => {
    try {
      // Call logout API to clear cookies
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        clearAuth()
        router.push('/')
      } else {
        // Fallback: clear localStorage anyway
        clearAuth()
        router.push('/')
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback: clear localStorage anyway
      clearAuth()
      router.push('/')
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
          </div>
          <p className="text-gray-600">Loading dashboard...</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="text-4xl font-bold text-emerald-600 mb-2">{aktivitasCount}</div>
            <p className="text-gray-600 font-medium">Aktivitas Tercatat</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="text-4xl font-bold text-green-700 mb-2">🌳 {pohonDitanam}</div>
            <p className="text-gray-600 font-medium">Pohon Ditanam</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="text-4xl font-bold text-yellow-600 mb-2">156</div>
            <p className="text-gray-600 font-medium">Poin Keberlanjutan</p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Aktivitas */}
          <Link href="/aktivitas">
            <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-all cursor-pointer group">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-emerald-600">Aktivitas</h3>
              <p className="text-gray-600 mb-4">Catat aktivitas ramah lingkunganmu sehari-hari</p>
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
          {recentAktivitas.length > 0 ? (
            <div className="space-y-4">
              {recentAktivitas.map((aktivitas, index) => (
                <div key={aktivitas._id} className="border-l-4 border-green-500 pl-4 py-3">
                  <p className="font-semibold text-gray-800">{aktivitas.judul}</p>
                  <p className="text-gray-600 text-sm">
                    {new Date(aktivitas.createdAt).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Belum ada aktivitas. Mulai dengan menambahkan aktivitas Anda!</p>
              <Link href="/aktivitas" className="text-emerald-600 font-semibold hover:text-emerald-700 mt-4 inline-block">
                Tambah Aktivitas →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

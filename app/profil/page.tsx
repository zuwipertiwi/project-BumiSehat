'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUser } from '@/lib/auth'

export default function Profil() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [aktivitasCount, setAktivitasCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    // Get user data
    const userData = getUser()
    if (!userData) {
      router.push('/login')
      return
    }

    setUser(userData)

    // Fetch aktivitas count
    const fetchData = async () => {
      try {
        const response = await fetch('/api/aktivitas')
        const data = await response.json()
        if (data.success) {
          setAktivitasCount(data.data.length)
        }
      } catch (error) {
        console.error('Error fetching aktivitas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">🌱</span>
            </div>
            <span className="text-xl font-bold text-emerald-700">BumiSehat</span>
          </Link>
          <Link href="/dashboard" className="text-emerald-600 font-semibold hover:text-emerald-700">
            ← Kembali
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="text-center md:text-left">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4">
                <span className="text-5xl">👤</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{user?.name || 'Loading...'}</h1>
              <p className="text-gray-600 mb-2">📧 {user?.email || 'Loading...'}</p>
              <p className="text-gray-600 mb-2">📍 {user?.lokasi || 'Belum diisi'}</p>
              <p className="text-gray-700 mb-6">{user?.bio || 'Pecinta lingkungan dan aktivis keberlanjutan'}</p>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700"
              >
                {isEditing ? '✓ Selesai' : '✏️ Edit Profil'}
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-emerald-600 mb-2">156</div>
            <p className="text-gray-600 font-medium">Poin Keberlanjutan</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{aktivitasCount}</div>
            <p className="text-gray-600 font-medium">Aktivitas Tercatat</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">15</div>
            <p className="text-gray-600 font-medium">Hari Berturut-turut</p>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">⚙️ Pengaturan</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-800">Notifikasi Email</p>
                <p className="text-gray-600 text-sm">Terima update tentang tips dan aktivitas</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-800">Profil Publik</p>
                <p className="text-gray-600 text-sm">Bagikan profil dan aktivitasmu dengan komunitas</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-800">Berbagi Dampak</p>
                <p className="text-gray-600 text-sm">Izinkan orang lain melihat dampak positifmu</p>
              </div>
              <input type="checkbox" className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-red-800 mb-6">⚠️ Zona Berbahaya</h2>
          <button
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.')) {
                localStorage.removeItem('token')
                window.location.href = '/'
              }
            }}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
          >
            🗑️ Hapus Akun
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Aktivitas() {
  const [aktivitas, setAktivitas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ judul: '', deskripsi: '', dampak: '', kategori: '', pohon_ditanam: 0 })
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // Fetch aktivitas from API
    const fetchAktivitas = async () => {
      try {
        console.log('📥 Fetching aktivitas...')
        const response = await fetch('/api/aktivitas')
        const result = await response.json()

        if (result.success) {
          console.log('✅ Aktivitas fetched:', result.data.length)
          setAktivitas(result.data)
        } else {
          console.error('❌ Failed to fetch:', result.message)
        }
      } catch (error) {
        console.error('❌ Error fetching aktivitas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAktivitas()
  }, [router])

  const handleAddAktivitas = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validasi form
    if (!formData.judul.trim()) {
      alert('❌ Judul tidak boleh kosong')
      return
    }
    if (!formData.deskripsi.trim()) {
      alert('❌ Deskripsi tidak boleh kosong')
      return
    }
    if (!formData.kategori.trim()) {
      alert('❌ Kategori harus dipilih')
      return
    }

    const user = localStorage.getItem('user')
    if (!user) {
      alert('❌ User tidak ditemukan. Silakan login ulang.')
      return
    }

    let userData
    try {
      userData = JSON.parse(user)
    } catch (e) {
      console.error('Error parsing user data:', e)
      alert('❌ Data user tidak valid. Silakan login ulang.')
      return
    }

    if (!userData.id) {
      alert('❌ UserId tidak ditemukan. Silakan login ulang.')
      return
    }

    try {
      console.log('📝 Creating aktivitas...', { ...formData, userId: userData.id })
      const response = await fetch('/api/aktivitas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          judul: formData.judul.trim(),
          deskripsi: formData.deskripsi.trim(),
          dampak: formData.dampak.trim(),
          kategori: formData.kategori.trim(),
          pohon_ditanam: formData.kategori.trim().toLowerCase() === 'penanaman' ? formData.pohon_ditanam : 0,
          userId: userData.id
        })
      })

      const result = await response.json()
      console.log('📥 API Response:', { status: response.status, result })

      if (result.success) {
        console.log('✅ Aktivitas created')
        alert('✅ Aktivitas berhasil ditambahkan!')
        setAktivitas([result.data, ...aktivitas])
        setFormData({ judul: '', deskripsi: '', dampak: '', kategori: '', pohon_ditanam: 0 })
        setShowForm(false)
      } else {
        console.warn('⚠️ API returned error:', result.message)
        alert('❌ ' + (result.message || 'Gagal membuat aktivitas'))
      }
    } catch (error: any) {
      console.error('❌ Error creating aktivitas:', error.message || error)
      alert('❌ Terjadi kesalahan koneksi. Silakan coba lagi.')
    }
  }

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
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 Aktivitas Saya</h1>
          <p className="text-gray-600 text-lg">Catat dan pantau aktivitas ramah lingkunganmu</p>
        </div>

        {/* Add Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          {showForm ? '✕ Batal' : '+ Tambah Aktivitas Baru'}
        </button>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Tambah Aktivitas Baru</h3>
            <form onSubmit={handleAddAktivitas} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Judul</label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Contoh: Menanam pohon di taman lokal"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Kategori</label>
                <select
                  required
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Pilih Kategori</option>
                  <option value="Penanaman">Penanaman</option>
                  <option value="Pertanian">Pertanian</option>
                  <option value="Daur Ulang">Daur Ulang</option>
                  <option value="Hemat Energi">Hemat Energi</option>
                  <option value="Konservasi Air">Konservasi Air</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Deskripsi</label>
                <textarea
                  required
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Jelaskan aktivitas yang Anda lakukan"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Dampak Positif</label>
                <textarea
                  value={formData.dampak}
                  onChange={(e) => setFormData({ ...formData, dampak: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Apa dampak positif dari aktivitas ini?"
                  rows={2}
                />
              </div>
              {formData.kategori.toLowerCase() === 'penanaman' && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">🌳 Jumlah Pohon Ditanam</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.pohon_ditanam}
                    onChange={(e) => setFormData({ ...formData, pohon_ditanam: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Berapa pohon yang ditanam?"
                  />
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                💾 Simpan Aktivitas
              </button>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <p className="text-gray-600">Memuat aktivitas...</p>
          </div>
        )}

        {/* Aktivitas List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!loading && aktivitas.map((item: any) => (
            <div key={item._id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{item.judul}</h3>
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {item.kategori}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{item.deskripsi}</p>
              {item.dampak && (
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-600">✨ Dampak Positif:</p>
                  <p className="font-semibold text-green-700">{item.dampak}</p>
                </div>
              )}
              <p className="text-gray-500 text-sm">📅 {new Date(item.createdAt).toLocaleDateString('id-ID')}</p>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && aktivitas.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-gray-600 text-lg">Belum ada aktivitas tercatat</p>
            <p className="text-gray-500 mb-6">Mulai catat aktivitas ramah lingkunganmu sekarang!</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700"
            >
              Tambah Aktivitas Pertama
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

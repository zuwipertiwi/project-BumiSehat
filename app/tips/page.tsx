'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Tips() {
  const [tips, setTips] = useState<any[]>([])
  const [filteredTips, setFilteredTips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // Fetch tips from API
    const fetchTips = async () => {
      try {
        console.log('📥 Fetching tips...')
        const response = await fetch('/api/tips')
        const result = await response.json()

        if (result.success) {
          console.log('✅ Tips fetched:', result.data.length)
          setTips(result.data)
          setFilteredTips(result.data)
        } else {
          console.error('❌ Failed to fetch:', result.message)
        }
      } catch (error) {
        console.error('❌ Error fetching tips:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTips()
  }, [router])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const filtered = tips.filter(tip =>
      tip.judul.toLowerCase().includes(query.toLowerCase()) ||
      tip.deskripsi.toLowerCase().includes(query.toLowerCase()) ||
      tip.kategori.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredTips(filtered)
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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">💡 Tips Konservasi</h1>
          <p className="text-gray-600 text-lg">Pelajari tips dan trik untuk menjaga kelestarian lingkungan</p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 flex gap-4">
          <input
            type="text"
            placeholder="Cari tips..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700">
            🔍 Cari
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <p className="text-gray-600">Memuat tips...</p>
          </div>
        )}

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && filteredTips.map((tip: any) => (
            <Link key={tip._id} href={`/tips/${tip._id}`}>
              <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all cursor-pointer group h-full">
                <div className="mb-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {tip.kategori}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-emerald-600">
                  {tip.judul}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{tip.deskripsi}</p>
                <div className="pt-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
                  <span>👁️ {tip.views || 0} views</span>
                  <span className="text-emerald-600 font-semibold group-hover:text-emerald-700">Baca →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {!loading && filteredTips.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="text-5xl mb-4">💡</div>
            <p className="text-gray-600 text-lg">
              {searchQuery ? `Tidak ada tips yang sesuai dengan "${searchQuery}"` : 'Belum ada tips tersedia'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

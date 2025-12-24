'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Tips() {
  const [tips] = useState([
    {
      id: 1,
      judul: 'Cara Membuat Kompos Rumahan',
      kategori: 'Pertanian',
      deskripsi: 'Pelajari cara membuat kompos organik dari sisa makanan dan dedaunan',
      konten: 'Kompos adalah pupuk alami yang kaya nutrisi untuk tanaman Anda...',
      views: 234
    },
    {
      id: 2,
      judul: 'Tips Menanam Pohon yang Benar',
      kategori: 'Penanaman',
      deskripsi: 'Panduan lengkap untuk menanam pohon agar dapat tumbuh dengan optimal',
      konten: 'Menanam pohon adalah kontribusi nyata untuk lingkungan...',
      views: 456
    },
    {
      id: 3,
      judul: 'Mengurangi Plastik Sekali Pakai',
      kategori: 'Gaya Hidup Hijau',
      deskripsi: 'Cara praktis mengurangi penggunaan plastik dalam kehidupan sehari-hari',
      konten: 'Plastik sekali pakai adalah salah satu penyebab utama pencemaran...',
      views: 345
    }
  ])

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
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700">
            🔍 Cari
          </button>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip) => (
            <Link key={tip.id} href={`/tips/${tip.id}`}>
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
                  <span>👁️ {tip.views} views</span>
                  <span className="text-emerald-600 font-semibold group-hover:text-emerald-700">Baca →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-white border-2 border-emerald-600 text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-all">
            Muat Lebih Banyak Tips
          </button>
        </div>
      </div>
    </div>
  )
}

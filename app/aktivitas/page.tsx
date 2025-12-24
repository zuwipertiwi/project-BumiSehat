'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Aktivitas() {
  const [aktivitas, setAktivitas] = useState([
    {
      id: 1,
      judul: 'Menanam pohon',
      deskripsi: 'Menanam 5 pohon di taman lokal',
      dampak: 'Mengurangi CO2 hingga 100kg/tahun',
      tanggal: '2025-12-24',
      kategori: 'Penanaman'
    },
    {
      id: 2,
      judul: 'Berkebun organik',
      deskripsi: 'Memulai kebun organik di rumah',
      dampak: 'Mengurangi pestisida sintetis',
      tanggal: '2025-12-22',
      kategori: 'Pertanian'
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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 Aktivitas Saya</h1>
          <p className="text-gray-600 text-lg">Catat dan pantau aktivitas ramah lingkunganmu</p>
        </div>

        {/* Add Button */}
        <button className="mb-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
          + Tambah Aktivitas Baru
        </button>

        {/* Aktivitas List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aktivitas.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{item.judul}</h3>
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {item.kategori}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{item.deskripsi}</p>
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600">✨ Dampak Positif:</p>
                <p className="font-semibold text-green-700">{item.dampak}</p>
              </div>
              <p className="text-gray-500 text-sm">📅 {new Date(item.tanggal).toLocaleDateString('id-ID')}</p>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {aktivitas.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-gray-600 text-lg">Belum ada aktivitas tercatat</p>
            <p className="text-gray-500 mb-6">Mulai catat aktivitas ramah lingkunganmu sekarang!</p>
            <button className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700">
              Tambah Aktivitas Pertama
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

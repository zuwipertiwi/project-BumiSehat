'use client'

import Link from 'next/link'

export default function Welcome() {
  return (
    <div className="hero-gradient min-h-screen overflow-x-hidden relative">
      <style>{`
        body {
          font-family: 'Poppins', sans-serif;
        }
        
        .hero-gradient {
          background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 25%, #064e3b 50%, #059669 75%, #34d399 100%);
          background-size: 200% 200%;
          animation: gradientShift 20s ease infinite;
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .floating {
          animation: floating 4s ease-in-out infinite;
        }
        
        @keyframes floating {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(5deg); }
          50% { transform: translateY(-20px) rotate(0deg); }
          75% { transform: translateY(-10px) rotate(-5deg); }
        }
        
        .fade-in-up {
          animation: fadeInUp 1.2s ease-out forwards;
          opacity: 0;
          transform: translateY(40px);
        }
        
        .fade-in-up-delay {
          animation: fadeInUp 1.2s ease-out 0.3s forwards;
          opacity: 0;
          transform: translateY(40px);
        }
        
        .fade-in-up-delay-2 {
          animation: fadeInUp 1.2s ease-out 0.6s forwards;
          opacity: 0;
          transform: translateY(40px);
        }
        
        .fade-in-up-delay-3 {
          animation: fadeInUp 1.2s ease-out 0.9s forwards;
          opacity: 0;
          transform: translateY(40px);
        }
        
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .glow-button {
          background: linear-gradient(45deg, #059669, #10b981, #34d399);
          background-size: 200% 200%;
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          animation: gradientPulse 3s ease infinite;
        }
        
        @keyframes gradientPulse {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .glow-button:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 15px 40px rgba(16, 185, 129, 0.6);
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 1.5rem;
        }
        
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }
      `}</style>

      {/* Navigation */}
      <nav className="relative z-20 px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">🌱</span>
            </div>
            <div>
              <span className="text-white font-bold text-2xl">BumiSehat</span>
              <div className="text-green-200 text-xs font-medium">Platform Pelestarian Lingkungan</div>
            </div>
          </div>
          <div className="hidden md:flex space-x-8 text-white/90">
            <a href="#tentang" className="hover:text-white font-medium transition-colors">Tentang</a>
            <a href="#fitur" className="hover:text-white font-medium transition-colors">Fitur</a>
            <a href="#edukasi" className="hover:text-white font-medium transition-colors">Edukasi</a>
            <a href="#dampak" className="hover:text-white font-medium transition-colors">Dampak</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 -mt-24">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Illustration */}
          <div className="mb-12 fade-in-up">
            <div className="text-6xl mb-4">🌍</div>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 fade-in-up leading-tight">
            <span className="block">Selamat Datang di</span>
            <span className="block mt-2 bg-gradient-to-r from-yellow-200 via-green-200 to-emerald-200 bg-clip-text text-transparent">
              BumiSehat
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-2xl md:text-3xl text-white/95 mb-6 fade-in-up-delay leading-relaxed font-medium">
            Platform Pelestarian Tanah dan Tumbuhan 🌱
          </p>

          <p className="text-xl text-white/85 mb-6 fade-in-up-delay-2 max-w-3xl mx-auto leading-relaxed">
            Satu langkah kecil untuk konservasi, satu harapan besar untuk bumi yang lestari
          </p>

          <p className="text-lg text-white/75 mb-16 fade-in-up-delay-2 max-w-2xl mx-auto leading-relaxed">
            Bergabunglah dengan komunitas peduli lingkungan. Catat aktivitas ramah lingkunganmu,
            pelajari tips konservasi, pantau dampak positifmu, dan bersama-sama kita rawat tanah serta tumbuhan
            untuk generasi mendatang.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 fade-in-up-delay-3">
            <Link
              href="/register"
              className="glow-button text-white px-10 py-5 rounded-full font-bold text-xl shadow-2xl min-w-[240px] flex items-center justify-center space-x-3"
            >
              <span>🚀</span>
              <span>Mulai Perjalanan Hijau</span>
            </Link>
            <Link
              href="/login"
              className="glass-card text-white px-10 py-5 rounded-full font-semibold text-xl hover:bg-white/25 transition-all duration-300 min-w-[240px] flex items-center justify-center space-x-3"
            >
              <span>📱</span>
              <span>Masuk ke Akun</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto fade-in-up-delay-3">
            <div className="glass-card rounded-3xl p-8 text-center">
              <div className="text-5xl font-bold mb-3 text-white">1,250+</div>
              <div className="text-white/95 font-semibold text-lg mb-1">Eco Warriors</div>
              <div className="text-white/70 text-sm">Pengguna aktif peduli lingkungan</div>
            </div>
            <div className="glass-card rounded-3xl p-8 text-center">
              <div className="text-5xl font-bold mb-3 text-white">8,500+</div>
              <div className="text-white/95 font-semibold text-lg mb-1">Aksi Hijau</div>
              <div className="text-white/70 text-sm">Aktivitas konservasi tercatat</div>
            </div>
            <div className="glass-card rounded-3xl p-8 text-center">
              <div className="text-5xl font-bold mb-3 text-white">3,200+</div>
              <div className="text-white/95 font-semibold text-lg mb-1">Pohon Ditanam</div>
              <div className="text-white/70 text-sm">Kontribusi penghijauan</div>
            </div>
            <div className="glass-card rounded-3xl p-8 text-center">
              <div className="text-5xl font-bold mb-3 text-white">150+</div>
              <div className="text-white/95 font-semibold text-lg mb-1">Tips Konservasi</div>
              <div className="text-white/70 text-sm">Panduan edukatif tersedia</div>
            </div>
          </div>
        </div>
      </main>

      {/* About Section */}
      <section className="relative z-10 py-20 px-6" id="tentang">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 fade-in-up">
              Tentang BumiSehat 🌱
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto fade-in-up-delay">
              Platform digital yang menginspirasi dan memudahkan setiap orang untuk berkontribusi dalam pelestarian lingkungan
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in-up">
              <h3 className="text-3xl font-bold text-white mb-6">Misi Kami</h3>
              <p className="text-white/85 text-lg leading-relaxed mb-6">
                BumiSehat hadir untuk mengatasi tantangan pelestarian lingkungan melalui pendekatan yang praktis dan edukatif.
                Kami percaya bahwa setiap aksi kecil dapat menciptakan dampak besar bagi kelestarian tanah dan tumbuhan.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h4 className="font-semibold text-white text-lg">Edukasi Berkelanjutan</h4>
                    <p className="text-white/75">Menyediakan pengetahuan praktis tentang konservasi tanah dan penanaman</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="text-2xl">📊</span>
                  <div>
                    <h4 className="font-semibold text-white text-lg">Pelacakan Dampak</h4>
                    <p className="text-white/75">Membantu pengguna melihat kontribusi nyata mereka terhadap lingkungan</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="text-2xl">🤝</span>
                  <div>
                    <h4 className="font-semibold text-white text-lg">Komunitas Peduli</h4>
                    <p className="text-white/75">Membangun jaringan individu yang berkomitmen pada kelestarian bumi</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="fade-in-up-delay">
              <div className="glass-card rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Mengapa BumiSehat?</h3>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🌍</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Mudah Digunakan</h4>
                    <p className="text-white/75 text-sm">Interface yang intuitif untuk semua kalangan</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📱</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Akses Fleksibel</h4>
                    <p className="text-white/75 text-sm">Dapat diakses kapan saja, di mana saja</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🎓</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Berbasis Ilmu</h4>
                    <p className="text-white/75 text-sm">Konten edukatif yang akurat dan terpercaya</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-6" id="fitur">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 fade-in-up">
              Fitur Unggulan BumiSehat
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto fade-in-up-delay">
              Koleksi lengkap tools untuk mendukung misi konservasi tanah dan tumbuhan Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Pencatatan Aktivitas', icon: '📝', desc: 'Catat setiap aksi konservasi dengan mudah' },
              { title: 'Statistik & Progres', icon: '📊', desc: 'Pantau dampak positif dengan grafik interaktif' },
              { title: 'Pencapaian & Badge', icon: '🏆', desc: 'Raih penghargaan atas kontribusi Anda' },
              { title: 'Edukasi & Artikel', icon: '📚', desc: 'Akses pustaka artikel edukatif' },
              { title: 'Tips Harian', icon: '💡', desc: 'Dapatkan tips praktis setiap hari' },
              { title: 'Profil Personal', icon: '👤', desc: 'Kelola profil dan bagikan pencapaian' },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="glass-card rounded-3xl p-10 text-center hover:scale-105 transition-all duration-500 fade-in-up"
                style={{ animationDelay: `${idx * 0.2}s` }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-white/80 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Siap Memulai Perjalanan Konservasi? 🌱
            </h2>
            <p className="text-xl text-white/85 mb-8 leading-relaxed">
              Bergabunglah dengan ribuan eco-warriors lainnya dalam misi melestarikan tanah dan tumbuhan.
              Setiap aksi kecil berdampak besar untuk planet kita.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="glow-button text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl"
              >
                🌟 Daftar Gratis Sekarang
              </Link>
              <a
                href="#tentang"
                className="glass-card text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/25 transition-all duration-300"
              >
                📖 Pelajari Lebih Lanjut
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">🌱</span>
            </div>
            <span className="text-white font-bold text-xl">BumiSehat</span>
          </div>
          <p className="text-white/70 text-sm mb-4">
            Platform edukatif untuk pelestarian tanah dan tumbuhan.
            Bersama membangun masa depan yang lebih hijau dan berkelanjutan.
          </p>
          <p className="text-white/60 text-xs">
            Dibuat dengan 💚 oleh Tim BumiSehat &copy; 2025. Semua hak dilindungi.
          </p>
          <p className="text-white/60 text-xs mt-4">
            🌱 Bersama kita rawat bumi untuk generasi mendatang 🌍
          </p>
        </div>
      </footer>
    </div>
  )
}

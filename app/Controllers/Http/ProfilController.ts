// Sebelumnya: import tanpa currentUser
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class ProfilController {
  public async index({ view, currentUser, response }: HttpContextContract) {
    try {
      const user = currentUser

      const stats = await user.getStats()
      const recentActivities = await user.getRecentActivities(5)

      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        foto: user.foto || null,
        nomor_telepon: user.nomor_telepon || '-',
        lokasi: user.lokasi || '-',
        tanggal_lahir: user.tanggal_lahir || null,
        jenis_kelamin: user.jenis_kelamin || '-',
        bio: user.bio || 'Belum ada bio',
        joinDate: user.createdAt,
        profil_publik: user.profil_publik,
        share_aktivitas: user.share_aktivitas,
        notifikasi_email: user.notifikasi_email
      }

      const profilStats = {
        totalAktivitas: stats.totalAktivitas,
        aktivitasBulanIni: stats.aktivitasBulanIni,
        streak: stats.streak,
        badgeEarned: Math.floor(stats.totalAktivitas / 10),
        statsPerKategori: stats.statsPerKategori
      }

      const formattedActivities = recentActivities.map(activity => ({
        id: activity._id,
        deskripsi: activity.deskripsi,
        tanggal: activity.tanggal,
        lokasi: activity.lokasi,
        kategori: activity.kategori_id ? {
          nama: activity.kategori_id.nama,
          icon: activity.kategori_id.icon
        } : null,
        status: activity.status
      }))

      return view.render('profil', {
        user: userData,
        profilStats,
        recentActivities: formattedActivities
      })

    } catch (error) {
      console.error('Profil Controller Error:', error)
      return response.redirect('/dashboard').with('error', 'Terjadi kesalahan saat memuat profil')
    }
  }

  public async showEdit({ view, currentUser, response }: HttpContextContract) {
    try {
      const user = currentUser

      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        foto: user.foto || null,
        nomor_telepon: user.nomor_telepon || '',
        lokasi: user.lokasi || '',
        tanggal_lahir: user.tanggal_lahir || null,
        jenis_kelamin: user.jenis_kelamin || '',
        bio: user.bio || '',
        profil_publik: user.profil_publik,
        share_aktivitas: user.share_aktivitas,
        notifikasi_email: user.notifikasi_email
      }

      return view.render('edit-profil', { user: userData })

    } catch (error) {
      console.error('Show Edit Profil Error:', error)
      return response.redirect('/profil').with('error', 'Terjadi kesalahan')
    }
  }

  public async update({ request, response, currentUser, session }: HttpContextContract) {
    try {
      const user = currentUser

      const {
        name,
        nomor_telepon,
        lokasi,
        tanggal_lahir,
        jenis_kelamin,
        bio,
        profil_publik,
        share_aktivitas,
        notifikasi_email
      } = request.only([
        'name',
        'nomor_telepon',
        'lokasi',
        'tanggal_lahir',
        'jenis_kelamin',
        'bio',
        'profil_publik',
        'share_aktivitas',
        'notifikasi_email'
      ])

      await User.findByIdAndUpdate(user._id, {
        name,
        nomor_telepon,
        lokasi,
        tanggal_lahir: tanggal_lahir ? new Date(tanggal_lahir) : null,
        jenis_kelamin,
        bio,
        profil_publik: profil_publik === 'on',
        share_aktivitas: share_aktivitas === 'on',
        notifikasi_email: notifikasi_email === 'on'
      })

      session.flash('success', 'Profil berhasil diperbarui')
      return response.redirect('/profil')

    } catch (error) {
      console.error('Update Profil Error:', error)
      session.flash('error', 'Terjadi kesalahan saat memperbarui profil')
      return response.redirect().back()
    }
  }
}

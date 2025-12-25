import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bumisehat';

const tipSchema = new mongoose.Schema({
    judul: { type: String, required: true },
    konten: { type: String, required: true },
    deskripsi: { type: String },
    kategori: { type: String },
    penulis: { type: String },
    foto: { type: String },
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Tips = mongoose.model('Tip', tipSchema);

const tips = [
    {
        judul: "Cara Membuat Kompos di Rumah",
        konten: "Kompos adalah hasil dari penguraian bahan organik yang dapat digunakan untuk menyuburkan tanah. Anda bisa membuat kompos sendiri dengan mudah menggunakan limbah organik rumah tangga seperti sisa makanan dan daun-daun kering. Proses ini membutuhkan waktu 2-3 bulan untuk menghasilkan kompos yang siap digunakan.",
        deskripsi: "Pelajari cara sederhana membuat kompos dari limbah organik di rumah Anda",
        kategori: "Kompos",
        penulis: "Admin BumiSehat"
    },
    {
        judul: "Tips Menghemat Air Sehari-hari",
        konten: "Air adalah sumber daya yang berharga. Beberapa cara sederhana untuk menghemat air: matikan keran saat menyikat gigi, perbaiki keran yang bocor, gunakan shower yang lebih efisien, dan tampung air hujan untuk menyiram tanaman. Setiap tetes air yang disimpan adalah kontribusi untuk masa depan yang lebih berkelanjutan.",
        deskripsi: "Teknik praktis untuk mengurangi penggunaan air di rumah dan lingkungan sekitar",
        kategori: "Penghematan Air",
        penulis: "Admin BumiSehat"
    },
    {
        judul: "Menanam Pohon untuk Masa Depan",
        konten: "Menanam pohon adalah salah satu cara paling efektif untuk mengatasi perubahan iklim. Pohon menyerap karbon dioksida dan menghasilkan oksigen. Anda dapat menanam pohon di halaman rumah, taman komunitas, atau bergabung dengan gerakan penanaman pohon lokal. Setiap pohon yang ditanam adalah investasi untuk generasi mendatang.",
        deskripsi: "Manfaat menanam pohon dan panduan memulai program penanaman di komunitas Anda",
        kategori: "Penanaman",
        penulis: "Admin BumiSehat"
    },
    {
        judul: "Mengurangi Plastik Sekali Pakai",
        konten: "Plastik sekali pakai adalah masalah global yang serius. Mulai dengan membawa tas belanja sendiri, menggunakan botol minum yang dapat diisi ulang, dan menghindari sedotan plastik. Pilih produk dengan kemasan yang dapat didaur ulang atau ramah lingkungan. Perubahan kecil ini dapat membuat perbedaan besar untuk planet kita.",
        deskripsi: "Strategi praktis untuk mengurangi penggunaan plastik dalam kehidupan sehari-hari",
        kategori: "Pengurangan Sampah",
        penulis: "Admin BumiSehat"
    },
    {
        judul: "Energi Terbarukan untuk Rumah Anda",
        konten: "Energi terbarukan seperti panel surya menjadi semakin terjangkau dan efisien. Memasang panel surya di atap rumah dapat mengurangi tagihan listrik dan jejak karbon Anda. Selain itu, pertimbangkan penggunaan lampu LED yang hemat energi dan appliances yang bersertifikat energy star.",
        deskripsi: "Penjelasan tentang energi terbarukan dan cara mengimplementasikannya di rumah",
        kategori: "Energi",
        penulis: "Admin BumiSehat"
    },
    {
        judul: "Berkebun Organik Tanpa Pestisida",
        konten: "Berkebun organik tidak hanya baik untuk lingkungan tetapi juga untuk kesehatan Anda. Gunakan pupuk alami seperti kompos, hindari pestisida kimia, dan mulai dengan menanam sayuran organik sederhana. Sistem drip irrigation dapat membantu menghemat air sambil menjaga tanaman tetap sehat.",
        deskripsi: "Panduan lengkap berkebun organik untuk pemula dengan hasil maksimal",
        kategori: "Berkebun",
        penulis: "Admin BumiSehat"
    }
];

async function seedTips() {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected');

        // Clear existing tips
        await Tips.deleteMany({});
        console.log('🗑️  Cleared existing tips');

        // Insert new tips
        const result = await Tips.insertMany(tips);
        console.log(`✅ ${result.length} tips created successfully!`);

        // Verify
        const count = await Tips.countDocuments();
        console.log(`📊 Total tips in database: ${count}`);

        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

seedTips();

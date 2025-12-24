import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

interface IUser extends mongoose.Document {
  name: string
  email: string
  password: string
  foto?: string
  nomor_telepon?: string
  lokasi?: string
  tanggal_lahir?: Date
  jenis_kelamin?: string
  bio?: string
  profil_publik: boolean
  share_aktivitas: boolean
  notifikasi_email: boolean
  createdAt: Date
  updatedAt: Date
  comparePassword(password: string): Promise<boolean>
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    foto: String,
    nomor_telepon: String,
    lokasi: String,
    tanggal_lahir: Date,
    jenis_kelamin: String,
    bio: String,
    profil_publik: {
      type: Boolean,
      default: true,
    },
    share_aktivitas: {
      type: Boolean,
      default: true,
    },
    notifikasi_email: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Method to compare password
userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password)
}

export default mongoose.models.User || mongoose.model('User', userSchema)

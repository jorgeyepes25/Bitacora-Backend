import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es obligatorio'],
    unique: true,
    minlength: [5, 'El nombre de usuario debe tener al menos 5 caracteres'],
    maxlength: [50, 'El nombre de usuario no puede tener más de 50 caracteres'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: [true, 'El rol es obligatorio']
  },
  status: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo',
    required: [true, 'El estado es obligatorio']
  }
}, {
  timestamps: true
});

// Exportar el modelo
const User = mongoose.model('User', userSchema);

export default User;

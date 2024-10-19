import mongoose from 'mongoose';

// Definir el esquema del rol con buenas prácticas
const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del rol es obligatorio'],
    unique: true,
    trim: true,
    minlength: [3, 'El nombre del rol debe tener al menos 3 caracteres'],
    maxlength: [50, 'El nombre del rol no puede tener más de 50 caracteres'],
    lowercase: true
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

const Role = mongoose.model('Role', roleSchema);

export default Role;

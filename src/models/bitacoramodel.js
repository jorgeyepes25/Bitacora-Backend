import mongoose from 'mongoose';

const bitacoraSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título de la bitácora es obligatorio'],
  },
  fechaMuestreo: {
    type: Date,
    required: [true, 'La fecha del muestreo es obligatoria'],
  },
  localizacion: {
    latitud: {
      type: Number,
      required: [true, 'La latitud es obligatoria']
    },
    longitud: {
      type: Number,
      required: [true, 'La longitud es obligatoria']
    },
  },
  condicionesClimaticas: String,
  descripcionHabitat: String,
  fotos: [String],
  detallesEspecies: [{
    nombreCientifico: String,
    nombreComun: String,
    familia: String,
    cantidadMuestras: Number,
    estadoPlanta: String,
    fotos: [String]
  }],
  observaciones: String,
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notasAdicionales: [{
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    texto: {
      type: String,
      required: true
    },
    visiblePara: {
      type: String,
      enum: ['investigadores', 'colaboradores'],
      default: 'investigadores'
    }
  }]
}, {
  timestamps: true
});

const Bitacora = mongoose.model('Bitacora', bitacoraSchema);
export default Bitacora;

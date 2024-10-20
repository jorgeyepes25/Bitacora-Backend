import Bitacora from '../models/Bitacora.js';
import { uploadImageToFirebase } from '../config/firebaseConfig.js';

// Crear una nueva bitácora
export const crearBitacora = async (req, res) => {
    try {
      const { titulo, fechaMuestreo, localizacion, condicionesClimaticas, descripcionHabitat, detallesEspecies, observaciones } = req.body;
  
      let fotos = [];
  
      // Si hay fotos en la solicitud, subirlas a Firebase y obtener las URLs
      if (req.files && req.files.length > 0) {
        const imageUploadPromises = req.files.map(file => uploadImageToFirebase(file));
        fotos = await Promise.all(imageUploadPromises);
      }
  
      // Crear nueva bitácora
      const nuevaBitacora = new Bitacora({
        titulo,
        fechaMuestreo,
        localizacion,
        condicionesClimaticas,
        descripcionHabitat,
        fotos,
        detallesEspecies,
        observaciones,
        creadoPor: req.user.id
      });
  
      const bitacoraGuardada = await nuevaBitacora.save();
      res.status(201).json(bitacoraGuardada);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Obtener todas las bitácoras
export const obtenerBitacoras = async (req, res) => {
  try {
    const bitacoras = await Bitacora.find().populate('creadoPor', 'username');
    res.status(200).json(bitacoras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una bitácora por ID
export const obtenerBitacoraPorId = async (req, res) => {
  try {
    const bitacora = await Bitacora.findById(req.params.id).populate('creadoPor', 'username');
    if (!bitacora) {
      return res.status(404).json({ message: 'Bitácora no encontrada' });
    }
    res.status(200).json(bitacora);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una bitácora por ID
export const actualizarBitacora = async (req, res) => {
  try {
    const { titulo, fechaMuestreo, localizacion, condicionesClimaticas, descripcionHabitat, fotos, detallesEspecies, observaciones } = req.body;

    const bitacoraActualizada = await Bitacora.findByIdAndUpdate(
      req.params.id,
      {
        titulo,
        fechaMuestreo,
        localizacion,
        condicionesClimaticas,
        descripcionHabitat,
        fotos,
        detallesEspecies,
        observaciones
      },
      { new: true }
    );

    if (!bitacoraActualizada) {
      return res.status(404).json({ message: 'Bitácora no encontrada' });
    }

    res.status(200).json(bitacoraActualizada);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar una bitácora por ID
export const eliminarBitacora = async (req, res) => {
  try {
    const bitacoraEliminada = await Bitacora.findByIdAndDelete(req.params.id);
    if (!bitacoraEliminada) {
      return res.status(404).json({ message: 'Bitácora no encontrada' });
    }
    res.status(200).json({ message: 'Bitácora eliminada con éxito' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Agregar una nota adicional a una bitácora
export const agregarNotaAdicional = async (req, res) => {
  try {
    const { texto, visiblePara } = req.body;
    const bitacora = await Bitacora.findById(req.params.id);

    if (!bitacora) {
      return res.status(404).json({ message: 'Bitácora no encontrada' });
    }

    bitacora.notasAdicionales.push({
      autor: req.user._id,
      texto,
      visiblePara
    });

    await bitacora.save();
    res.status(200).json({ message: 'Nota adicional agregada con éxito' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener notas adicionales de una bitácora
export const obtenerNotasAdicionales = async (req, res) => {
  try {
    const bitacora = await Bitacora.findById(req.params.id).populate('notasAdicionales.autor', 'username');
    if (!bitacora) {
      return res.status(404).json({ message: 'Bitácora no encontrada' });
    }
    res.status(200).json(bitacora.notasAdicionales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Agregar un comentario a una bitácora
export const agregarComentario = async (req, res) => {
  try {
    const { texto } = req.body;
    const bitacora = await Bitacora.findById(req.params.id);

    if (!bitacora) {
      return res.status(404).json({ message: 'Bitácora no encontrada' });
    }

    bitacora.comentarios.push({
      autor: req.user._id,
      texto,
      fecha: new Date()
    });

    await bitacora.save();
    res.status(200).json({ message: 'Comentario agregado con éxito' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener comentarios de una bitácora
export const obtenerComentarios = async (req, res) => {
  try {
    const bitacora = await Bitacora.findById(req.params.id).populate('comentarios.autor', 'username');
    if (!bitacora) {
      return res.status(404).json({ message: 'Bitácora no encontrada' });
    }
    res.status(200).json(bitacora.comentarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

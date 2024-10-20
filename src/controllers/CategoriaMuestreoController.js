import CategoriaMuestreo from '../models/CategoriaMuestreo.js';

// Crear una nueva categoría de muestreo
export const crearCategoriaMuestreo = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    const categoriaExistente = await CategoriaMuestreo.findOne({ nombre });
    if (categoriaExistente) {
      return res.status(400).json({ message: 'La categoría ya existe' });
    }

    const nuevaCategoria = new CategoriaMuestreo({
      nombre,
      descripcion,
    });

    const categoriaGuardada = await nuevaCategoria.save();
    res.status(201).json(categoriaGuardada);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las categorías de muestreo
export const obtenerCategoriasMuestreo = async (req, res) => {
  try {
    const categorias = await CategoriaMuestreo.find();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una categoría de muestreo por ID
export const obtenerCategoriaMuestreoPorId = async (req, res) => {
  try {
    const categoria = await CategoriaMuestreo.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una categoría de muestreo por ID
export const actualizarCategoriaMuestreo = async (req, res) => {
  try {
    const { nombre, descripcion, status } = req.body;

    const categoriaActualizada = await CategoriaMuestreo.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion, status },
      { new: true }
    );

    if (!categoriaActualizada) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    res.status(200).json(categoriaActualizada);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar una categoría de muestreo por ID
export const eliminarCategoriaMuestreo = async (req, res) => {
  try {
    const categoriaEliminada = await CategoriaMuestreo.findByIdAndDelete(req.params.id);
    if (!categoriaEliminada) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.status(200).json({ message: 'Categoría eliminada con éxito' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

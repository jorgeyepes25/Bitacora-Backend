import { body, validationResult } from 'express-validator';
import Role from '../models/Rolemodel.js';
import User from '../models/Usermodel.js'; 

// Crear un nuevo rol
export const createRole = [
  body('name').notEmpty().withMessage('El nombre del rol es obligatorio'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name } = req.body;
      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        return res.status(400).json({ message: 'El rol ya existe' });
      }
      const newRole = new Role({ name });
      const savedRole = await newRole.save();
      res.status(201).json(savedRole);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
];

// Obtener todos los roles
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un rol por ID
export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: 'Rol no encontrado' });
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un rol por ID
export const updateRole = [
  body('name').notEmpty().withMessage('El nombre del rol es obligatorio'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name } = req.body;
      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        return res.status(400).json({ message: 'El nombre del rol ya existe' });
      }
      const updatedRole = await Role.findByIdAndUpdate(req.params.id, { name }, { new: true });
      if (!updatedRole) return res.status(404).json({ message: 'Rol no encontrado' });
      res.status(200).json(updatedRole);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
];

// Eliminar un rol por ID
export const deleteRole = async (req, res) => {
  try {
    // Verificar si algún usuario está asignado a este rol
    const usersWithRole = await User.find({ role: req.params.id });
    if (usersWithRole.length > 0) {
      return res.status(400).json({
        message: 'No se puede eliminar el rol porque está asignado a uno o más usuarios. Reasigne los usuarios a otro rol antes de eliminarlo.'
      });
    }

    // Si no hay usuarios con este rol, proceder con la eliminación
    const deletedRole = await Role.findByIdAndDelete(req.params.id);
    if (!deletedRole) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    res.status(200).json({ message: 'Rol eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

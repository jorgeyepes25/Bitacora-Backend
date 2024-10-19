import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import User from "../models/Usermodel.js";
import Role from "../models/Rolemodel.js";
import { findRoleByName, formatUserResponse } from "../utils/helperFunctions.js";

// Crear un nuevo usuario
export const createUser = [
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, password, roleName } = req.body;

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "El nombre de usuario ya existe" });
      }

      const role = roleName
        ? await findRoleByName(roleName)
        : await findRoleByName("colaborador");

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        username,
        password: hashedPassword,
        role,
      });
      const savedUser = await newUser.save();

      res.status(201).json(formatUserResponse(savedUser));
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
];


// Obtener todos los usuarios con el rol
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("role", "name");

    // Mapear los usuarios para devolver solo el nombre del rol
    const usersWithRoleName = users.map((user) => formatUserResponse(user));

    res.status(200).json(usersWithRoleName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("role", "name");
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.status(200).json(formatUserResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un usuario por ID
export const updateUser = [
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, password, roleName, status } = req.body;
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const updatedFields = {};

      // Comparar solo si el username es diferente
      if (username && username !== user.username) {
        updatedFields.username = username;
      }

      // Comparar solo si el estado es diferente
      if (status && status !== user.status) {
        updatedFields.status = status;
      }

      // Comparar solo si el roleName es diferente
      if (roleName) {
        const role = await findRoleByName(roleName);
        if (String(role) !== String(user.role)) {
          updatedFields.role = role;
        }
      }

      // Si se proporciona una contraseña, usar la función de actualización de contraseña
      if (password) {
        try {
          updatedFields.password = await updatePassword(password, user.password);
        } catch (error) {
          return res.status(400).json({ message: error.message });
        }
      }

      // Solo realizar la actualización si hay campos que actualizar
      if (Object.keys(updatedFields).length === 0) {
        return res.status(400).json({ message: "No hay cambios para actualizar" });
      }

      const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedFields, { new: true }).select('-password');

      res.status(200).json(formatUserResponse(updatedUser));
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
];

// Eliminar un usuario por ID
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

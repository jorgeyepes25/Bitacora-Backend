import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import User from "../models/Usermodel.js";
import Role from "../models/Rolemodel.js";
import {
  findRoleByName,
  formatUserResponse,
  updatePassword,
} from "../utils/helperFunctions.js";

// Crear un nuevo usuario con múltiples roles
export const createUser = [
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, password, roleNames } = req.body;

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "El nombre de usuario ya existe" });
      }

      // Buscar los roles por sus nombres
      const defaultRole = await findRoleByName("colaborador");
      const roles =
        roleNames && roleNames.length > 0
          ? await Role.find({ name: { $in: roleNames } })
          : defaultRole
          ? [defaultRole]
          : [];

      if (roles.length === 0) {
        return res
          .status(400)
          .json({ message: "No se pudo encontrar ningún rol válido" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        username,
        password: hashedPassword,
        roles: roles.map((role) => role._id),
      });
      const savedUser = await newUser.save();

      res.status(201).json(formatUserResponse(savedUser));
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
];

// Crear un nuevo usuario a partir de una autenticación con red social
export const createUserWithSocialProfile = async (profile, provider) => {
  const defaultRole = await Role.findOne({ name: "colaborador" });
  
  const newUser = new User({
    username: profile.displayName || profile.username,
    email: profile.emails ? profile.emails[0].value : undefined,
    roles: [defaultRole._id],
    [`${provider}Id`]: profile.id,
  });
  
  const savedUser = await newUser.save();
  return savedUser;
};

// Obtener todos los usuarios con el rol
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("roles", "name");

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
    const user = await User.findById(req.params.id).populate("roles", "name");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(formatUserResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un usuario con múltiples roles
export const updateUser = [
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, password, roleNames, status } = req.body;
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

      // Comparar roles y actualizar si es necesario
      if (roleNames) {
        const roles = await Role.find({ name: { $in: roleNames } });
        const roleIds = roles.map((role) => role._id);

        // Actualizar los roles solo si son diferentes de los existentes
        if (
          roleIds.length !== user.roles.length ||
          !roleIds.every((roleId) => user.roles.includes(roleId))
        ) {
          updatedFields.roles = roleIds;
        }
      }

      // Actualizar contraseña si es necesario
      if (password) {
        try {
          updatedFields.password = await updatePassword(
            password,
            user.password
          );
        } catch (error) {
          return res.status(400).json({ message: error.message });
        }
      }

      if (Object.keys(updatedFields).length === 0) {
        return res
          .status(400)
          .json({ message: "No hay cambios para actualizar" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updatedFields,
        { new: true }
      ).select("-password");

      res.status(200).json(formatUserResponse(updatedUser));
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
];

// Añadir roles a un usuario existente
export const addRolesToUser = async (req, res) => {
  try {
    const { roleNames } = req.body;
    const userId = req.params.id;

    console.log(roleNames);

    const user = await User.findById(userId).populate("roles", "name");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Buscar los roles por sus nombres
    const rolesToAdd = await Role.find({ name: { $in: roleNames } });
    const newRoleIds = rolesToAdd.map((role) => role._id);

    // Filtrar solo los roles que aún no están asignados al usuario
    const currentRoleIds = user.roles.map((role) => role._id.toString());
    const rolesToAddFiltered = newRoleIds.filter((roleId) => !currentRoleIds.includes(roleId.toString()));

    if (rolesToAddFiltered.length === 0) {
      return res.status(400).json({ message: "Todos los roles ya están asignados al usuario" });
    }

    // Agregar los nuevos roles al usuario
    user.roles = [...user.roles, ...rolesToAddFiltered];
    await user.save();

    res.status(200).json(formatUserResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

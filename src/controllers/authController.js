import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/Usermodel.js';
import { validationResult } from 'express-validator';

// Función de inicio de sesión
export const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    // Buscar usuario por nombre de usuario
    const user = await User.findOne({ username }).populate("role", "name");

    if (!user) {
      return res.status(400).json({ message: "Usuario o contraseña incorrectos" });
    }

    // Comparar la contraseña proporcionada con la almacenada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Usuario o contraseña incorrectos" });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Enviar el token y el usuario (sin contraseña) como respuesta
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role.name,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

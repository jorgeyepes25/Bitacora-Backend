import { body } from "express-validator";

export const userValidationRules = [
  body("username")
    .optional()
    .isLength({ min: 5 })
    .withMessage("El nombre de usuario debe tener al menos 5 caracteres"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("roleName")
    .optional()
    .notEmpty()
    .withMessage("El nombre del rol es obligatorio"),
  body("status")
    .optional()
    .isIn(["activo", "inactivo"])
    .withMessage("El estado debe ser 'activo' o 'inactivo'"),
];

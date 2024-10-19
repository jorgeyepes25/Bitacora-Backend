import bcrypt from "bcrypt";

// Función para actualizar la contraseña si es diferente de la actual
export const updatePassword = async (newPassword, currentPassword) => {
  const isSamePassword = await bcrypt.compare(newPassword, currentPassword);
  if (isSamePassword) {
    throw new Error("No puede usar la misma contraseña anterior");
  }

  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(newPassword, salt);
};

// Función para formatear la respuesta de usuario
export const formatUserResponse = (user) => {
  const { password, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};

// Buscar un rol por nombre
export const findRoleByName = async (roleName) => {
  const role = await Role.findOne({ name: roleName });
  if (!role) {
    throw new Error(`Rol '${roleName}' no encontrado`);
  }
  return role;
};

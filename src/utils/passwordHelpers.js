import bcrypt from 'bcrypt';

// Función para actualizar la contraseña
export const updatePassword = async (newPassword, currentPassword) => {
  const isSamePassword = await bcrypt.compare(newPassword, currentPassword);
  if (isSamePassword) {
    throw new Error("No puede usar la misma contraseña anterior");
  }
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(newPassword, salt);
};

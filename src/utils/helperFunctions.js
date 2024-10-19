import Role from "../models/Rolemodel.js";

// Función para obtener el ObjectId del rol a partir del nombre
export const findRoleByName = async (roleName) => {
  const role = await Role.findOne({ name: roleName });
  if (!role) {
    throw new Error("Rol no encontrado");
  }
  return role._id;
};

// Función para estructurar la respuesta del usuario
export const formatUserResponse = (user) => {
  return {
    _id: user._id,
    username: user.username,
    role: user.role ? user.role.name : null,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

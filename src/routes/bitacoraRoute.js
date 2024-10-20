import { Router } from "express";
import {
  crearBitacora,
  obtenerBitacoras,
  obtenerBitacoraPorId,
  actualizarBitacora,
  eliminarBitacora,
  agregarNotaAdicional,
  obtenerNotasAdicionales,
  agregarComentario,
  obtenerComentarios,
} from "../controllers/bitacoraController.js";

const routerBitacora = Router();

// Rutas para el CRUD de bitácoras
router.post("/", crearBitacora); // Crear una nueva bitácora
router.get("/", obtenerBitacoras); // Obtener todas las bitácoras
router.get("/:id", obtenerBitacoraPorId); // Obtener una bitácora por ID
router.put("/:id", actualizarBitacora); // Actualizar una bitácora por ID
router.delete("/:id", eliminarBitacora); // Eliminar una bitácora por ID

// Rutas para notas adicionales en bitácoras
router.post("/:id/notas", agregarNotaAdicional); // Agregar una nota adicional a una bitácora
router.get("/:id/notas", obtenerNotasAdicionales); // Obtener notas adicionales de una bitácora

// Rutas para comentarios en bitácoras
router.post("/:id/comentarios", agregarComentario); // Agregar un comentario a una bitácora
router.get("/:id/comentarios", obtenerComentarios); // Obtener comentarios de una bitácora

export default routerBitacora;

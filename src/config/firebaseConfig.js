import { initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import crypto from "crypto";
import { firebaseConfig } from "../config/index.js";

let uuidv4 = crypto.randomUUID();

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app).bucket();

// Función para subir imagen a Firebase Storage
export async function uploadImageToFirebase(file) {
  const filename = `${uuidv4}.${file.mimetype.split('/')[1]}`;
  const fileUpload = storage.file(filename);

  const stream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype, // Tipo de archivo
    },
  });

  return new Promise((resolve, reject) => {
    stream.on('error', (error) => {
      reject(error); // Manejo de error en la subida
    });

    stream.on('finish', async () => {
      // Hacemos el archivo público después de subirlo
      await fileUpload.makePublic();
      const publicUrl = `https://storage.googleapis.com/${storage.name}/${filename}`;
      resolve(publicUrl); // Resolución con la URL pública
    });

    stream.end(file.buffer); // Terminamos la subida
  });
}

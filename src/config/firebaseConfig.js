import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { v4 as uuidv4 } from 'uuid';

// Cargar las credenciales de Firebase (key)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const bucket = getStorage().bucket();

// Función para subir imagen a Firebase Storage
export const uploadImageToFirebase = async (file) => {
  const filename = `${uuidv4()}.${file.mimetype.split('/')[1]}`;
  const fileUpload = bucket.file(filename);
  const stream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    }
  });

  return new Promise((resolve, reject) => {
    stream.on('error', (error) => reject(error));
    stream.on('finish', async () => {
      await fileUpload.makePublic();
      const url = `https://storage.googleapis.com/${bucket.name}/${filename}`;
      resolve(url);
    });
    stream.end(file.buffer);
  });
};

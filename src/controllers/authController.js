// authController.js
import jwt from 'jsonwebtoken';
import passport from 'passport';
import bcrypt from 'bcrypt';
import User from '../models/Usermodel.js';
import { authConfig } from '../config/index.js';
import { createUserWithSocialProfile } from './userController.js'; 

// Genera el token JWT
export const generateToken = (user) => {
  return jwt.sign({ userId: user._id, role: user.role }, authConfig.jwtSecret, {
    expiresIn: authConfig.jwtExpiresIn,
  });
};

// Controlador para iniciar sesión con usuario y contraseña (autenticación local)
export const loginUser = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ message: 'Autenticación fallida' });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al iniciar sesión' });
      }
      const token = generateToken(user);
      return res.status(200).json({ message: 'Autenticación exitosa', token, userId: user.id });
    });
  })(req, res, next);
};

// Crear o autenticar usuario con Google
export const googleSignupOrLogin = passport.authenticate('google', { scope: ['profile', 'email'] });

// Callback de autenticación para Google (crea la cuenta si no existe)
export const googleCallback = (req, res, next) => {
  passport.authenticate('google', async (err, user) => {
    if (err || !user) {
      return res.send(`<script>window.close();</script>`);
    }

    try {
      let existingUser = await User.findOne({ googleId: user.googleId });
      if (!existingUser) {
        existingUser = await createUserWithSocialProfile(user, 'google');
      }
      const token = generateToken(existingUser);

      // Enviar token y userId a la ventana principal y cerrar la ventana de autenticación
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({
                  message: "login_success",
                  token: "${token}",
                  userId: "${existingUser._id}"
                }, "*");
              }
              window.close();
            </script>
          </body>
        </html>
      `);
    } catch (error) {
      return res.send(`<script>window.close();</script>`);
    }
  })(req, res, next);
};

// Crear o autenticar usuario con Facebook
export const facebookSignupOrLogin = passport.authenticate('facebook', { scope: ['email'] });

export const facebookCallback = (req, res, next) => {
  passport.authenticate('facebook', async (err, user) => {
    if (err || !user) {
      return res.send(`<script>window.close();</script>`);
    }

    try {
      let existingUser = await User.findOne({ facebookId: user.facebookId });
      if (!existingUser) {
        existingUser = await createUserWithSocialProfile(user, 'facebook');
      }
      const token = generateToken(existingUser);

      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({
                  message: "login_success",
                  token: "${token}",
                  userId: "${existingUser._id}"
                }, "*");
              }
              window.close();
            </script>
          </body>
        </html>
      `);
    } catch (error) {
      return res.send(`<script>window.close();</script>`);
    }
  })(req, res, next);
};

// Crear o autenticar usuario con GitHub
export const githubSignupOrLogin = passport.authenticate('github', { scope: ['user:email'] });

export const githubCallback = (req, res, next) => {
  passport.authenticate('github', async (err, user) => {
    if (err || !user) {
      return res.send(`<script>window.close();</script>`);
    }

    try {
      let existingUser = await User.findOne({ githubId: user.githubId });
      if (!existingUser) {
        existingUser = await createUserWithSocialProfile(user, 'github');
      }
      const token = generateToken(existingUser);

      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({
                  message: "login_success",
                  token: "${token}",
                  userId: "${existingUser._id}"
                }, "*");
              }
              window.close();
            </script>
          </body>
        </html>
      `);
    } catch (error) {
      return res.send(`<script>window.close();</script>`);
    }
  })(req, res, next);
};

// Controlador para cerrar sesión
export const logout = (req, res) => {
  // En un sistema sin sesiones en el servidor, el frontend simplemente puede borrar el token JWT
  res.status(200).json({ message: 'Sesión cerrada con éxito. El token debe eliminarse en el frontend.' });
};

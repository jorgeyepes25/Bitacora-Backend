import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import bcrypt from 'bcrypt';
import User from '../models/Usermodel.js';

// Estrategia Local (usuario y contraseña)
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Estrategia Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOne({ googleId: profile.id });
    if (user) {
      return done(null, user);
    } else {
      const newUser = new User({
        username: profile.displayName,
        googleId: profile.id,
      });
      const savedUser = await newUser.save();
      return done(null, savedUser);
    }
  } catch (error) {
    return done(error);
  }
}));

// Estrategia Facebook OAuth
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: '/api/auth/facebook/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOne({ facebookId: profile.id });
    if (user) {
      return done(null, user);
    } else {
      const newUser = new User({
        username: profile.displayName,
        facebookId: profile.id,
      });
      const savedUser = await newUser.save();
      return done(null, savedUser);
    }
  } catch (error) {
    return done(error);
  }
}));

// Estrategia GitHub OAuth
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: '/api/auth/github/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOne({ githubId: profile.id });
    if (user) {
      return done(null, user);
    } else {
      const newUser = new User({
        username: profile.username,
        githubId: profile.id,
      });
      const savedUser = await newUser.save();
      return done(null, savedUser);
    }
  } catch (error) {
    return done(error);
  }
}));

// Serializar y deserializar usuario
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

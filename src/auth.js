import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'your-google-client-id';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret';

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName || 'Unnamed User',
            email,
            password: '', // not needed for Google users
            role: 'student', // default role, you can customize this
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // store user id, safer than email
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password'); // exclude password
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;

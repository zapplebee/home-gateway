import passport, { PassportStatic } from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import type { RequestHandler } from "express";

import { GH_CLIENT_ID, GH_CLIENT_SECRET, GH_CALLBACK_URL } from "../constants";

export function initializePassport(): PassportStatic {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (obj: any, done) {
    done(null, obj);
  });

  passport.use(
    new GitHubStrategy(
      {
        clientID: GH_CLIENT_ID,
        clientSecret: GH_CLIENT_SECRET,
        callbackURL: GH_CALLBACK_URL,
      },
      function (accessToken: any, _refreshToken: any, profile: any, done: any) {
        return done(null, { ...profile, accessToken });
      }
    )
  );

  return passport;
}

export const ensureAuthenticated: RequestHandler = function ensureAuthenticated(
  req,
  res,
  next
) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

import React from "react";
import ReactDOMServer from "react-dom/server";
import { GHUser } from "../sharedTypes";
import type { Request, RequestHandler } from "express";

const ExpressContext = React.createContext<{
  req: Express.Request & Request;
} | null>(null);

export const useExpress = () => {
  return React.useContext(ExpressContext) as { req: Express.Request & Request };
};

const UserContext = React.createContext<GHUser | null>(null);

export const useUser = () => {
  return React.useContext(UserContext) as GHUser;
};

export const useProfileImage = () => {
  return (React.useContext(UserContext) as GHUser)?.photos?.[0].value ?? null;
};

export const withReact: RequestHandler = (req, res, next) => {
  res.react = (jsx: React.ReactElement) => {
    try {
      res.send(
        "<!DOCTYPE html>" +
          ReactDOMServer.renderToStaticMarkup(
            <ExpressContext.Provider value={{ req }}>
              <UserContext.Provider value={req.user as GHUser}>
                {jsx}
              </UserContext.Provider>
            </ExpressContext.Provider>
          )
      );
    } catch (err) {
      next(err);
    }
  };

  next();
};

declare global {
  namespace Express {
    export interface Response {
      react: (jsx: React.ReactElement) => void;
    }
  }
}

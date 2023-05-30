//dotenv
import "dotenv/config";
console.log(process.env.GATEWAY_COOKIE_SECRET);

// NodeJS imports
import path from "node:path";

// Allow JSX
import React from "react";

// Express
import express, { ErrorRequestHandler } from "express";
import session from "express-session";
import { json, urlencoded } from "body-parser";

// Other Libraries
import { Octokit } from "@octokit/rest";

// Components
import { Page } from "./components/Page";
import { Login } from "./components/Login";
import { Account } from "./components/Account";
import { Main } from "./components/Main";

// Types

import type { GHUser } from "./sharedTypes";

// Lib
import { initializePassport, ensureAuthenticated } from "./lib/passport";
import { webhookRouter } from "./lib/webhook";
import { initializeRedis } from "./lib/redis";
import { withReact } from "./lib/react";

// constants

import { DOMAIN, COOKIE_SECRET, PORT } from "./constants";

/* 

###################################################################
#
#
# Set up constants
#
#
###################################################################

*/

const { redisClient, redisStore } = initializeRedis();
const passport = initializePassport();

const app = express();

/* 

###################################################################
#
#
# Express configuration
#
#
###################################################################

*/

app.set("etag", false);
app.set("trust proxy", true);
app.disable("x-powered-by");

/* 

###################################################################
#
#
# Pre-middleware routes
#
#
###################################################################

*/

app.use("/wobble", express.static(path.join(__dirname, "../public")));

// This has to go before other `body-parser` declarations so that it can use the raw body
app.use("/gh-webhook", webhookRouter());

/* 

###################################################################
#
#
# Body Parser Types
#
#
###################################################################

*/

app.use(json());
app.use(urlencoded({ extended: true }));

/* 

###################################################################
#
#
# Additional Middlewares
#
#
###################################################################

*/
app.use(withReact);

/* 

###################################################################
#
#
# Sessions with Passport
#
#
###################################################################

*/

app.use(
  session({
    secret: COOKIE_SECRET,
    store: redisStore,
    proxy: true,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "strict",
      domain: DOMAIN,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

/* 

###################################################################
#
#
# Unauthenticated Routes
#
#
###################################################################

*/

app.get("/login", function (req, res) {
  if (req.user) {
    return res.redirect("/");
  }
  res.react(
    <Page title="Login">
      <Login />
    </Page>
  );
});

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login?loginfailed=1" }),
  (req, res) => {
    // todo, figure out why a vanilly redirect is not working here.
    res.send(`<script>window.location = 'https://${DOMAIN}/'</script>`);
  }
);

/* 

###################################################################
#
#
# Authenticated Routes
#
#
###################################################################

*/

app.use(ensureAuthenticated);

app.get("/", function (req, res) {
  res.react(
    <Page title="welcome">
      <Main />
    </Page>
  );
});

app.get("/account", function (req, res) {
  (async function () {
    const octokit = new Octokit({
      auth: (req.user as GHUser).accessToken,
    });
    const repos = await octokit.paginate(
      octokit.repos.listForUser,
      {
        username: (req.user as any).username,
        per_page: 100,
      },
      (response) => response.data
    );

    const body = repos;
    res.react(
      <Page title="account">
        <Account data={body} />
      </Page>
    );
  })();
});

app.get("/logout", function (req: Express.Request, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login?logged-out=1");
  });
});

/* 

###################################################################
#
#
# Custom Error Handling Page
#
#
###################################################################

*/

const errorHandler: ErrorRequestHandler = function clientErrorHandler(
  err,
  _req,
  res,
  _next
) {
  console.log(err);
  res.status(500);
  return res.react(
    <Page title="Error">
      <h1>Uh oh</h1>
    </Page>
  );
};

app.use(errorHandler);

/* 

###################################################################
#
#
# Start listener
#
#
###################################################################

*/

const setUpPromises = [redisClient.connect()];

Promise.all(setUpPromises)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

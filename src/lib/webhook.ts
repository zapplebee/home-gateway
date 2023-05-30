import { raw } from "body-parser";
import { Router } from "express";
import { execSync } from "node:child_process";
import crypto from "node:crypto";

import { GH_WEBHOOK_SECRET, WEBHOOK_COMMAND } from "./../constants";

export const verify = (signature: string, payload: string) =>
  crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(
      crypto
        .createHmac("sha256", GH_WEBHOOK_SECRET)
        .update(payload)
        .digest("hex")
    )
  );

export const webhookRouter = () => {
  const router = Router();

  router.all("*", raw({ type: "*/*" }), (req, res) => {
    try {
      const signature =
        (req.headers?.["x-hub-signature-256"] as string)?.replace(
          /^sha256=/i,
          ""
        ) ?? ("no-signature" as string);
      const verified = verify(signature, req.body);
      if (verified) {
        const body = JSON.parse(Buffer.from(req.body).toString("utf-8"));
        if (
          body.ref === "refs/heads/main" &&
          req.headers?.["x-github-event"] === "push"
        ) {
          const x = execSync(WEBHOOK_COMMAND);
          const scriptOutput = Buffer.from(x).toString("utf-8");
          console.log({ scriptOutput });
        }
        res.json({ ok: true, verified });
      } else {
        res.status(500).json({ ok: false, verified });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ ok: false, verified: null });
    }
  });

  return router;
};

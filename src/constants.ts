export const USER_PERMISSIONS_FILE = process.env
  .GATEWAY_USER_PERMISSIONS_FILE as string;
export const REDIS_URL = process.env.GATEWAY_REDIS_URL as string;
export const REDIS_SESSION_PREFIX = process.env
  .GATEWAY_REDIS_SESSION_PREFIX as string;
export const GH_CLIENT_ID = process.env.GATEWAY_GH_CLIENT_ID as string;
export const GH_CLIENT_SECRET = process.env.GATEWAY_GH_CLIENT_SECRET as string;
export const GH_CALLBACK_URL = `http${
  process.env.GATEWAY_HTTPS === "1" ? "s" : ""
}://${process.env.GATEWAY_FQDN as string}/auth/github/callback` as const;
export const DOMAIN = process.env.GATEWAY_FQDN as string;
export const GH_WEBHOOK_SECRET = process.env
  .GATEWAY_GH_WEBHOOK_SECRET as string;
export const COOKIE_SECRET = process.env.GATEWAY_COOKIE_SECRET as string;
export const PORT = 3400 as const;
export const WEBHOOK_COMMAND = process.env.GATEWAY_WEBHOOK_COMMAND as string;

import { ONE_YEAR_MS } from "../../shared/const.js";
import { verifySession, signSession } from "./auth";
import type { Request } from "express";

type TokenResponse = { accessToken: string };

type UserInfo = {
  openId: string;
  name?: string | null;
  email?: string | null;
  platform?: string | null;
};

const NOT_IMPLEMENTED_MSG =
  "OAuth SDK not configured. Provide a real implementation or wire a provider.";

export const sdk = {
  async exchangeCodeForToken(_code: string, _state: string): Promise<TokenResponse> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  },

  async getUserInfo(_accessToken: string): Promise<UserInfo> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  },

  async createSessionToken(openId: string, opts: { name: string; expiresInMs?: number }) {
    return signSession({ sub: openId, appId: "oauth", name: opts.name, email: null }, {
      expiresInMs: opts.expiresInMs ?? ONE_YEAR_MS,
    });
  },

  async authenticateRequest(req: Request) {
    const auth = req.headers.authorization || req.headers.Authorization;
    const token = typeof auth === "string" && auth.startsWith("Bearer ")
      ? auth.slice("Bearer ".length).trim()
      : undefined;
    return verifySession(token);
  },
};

import type { Express, Request, Response } from "express";
import { COOKIE_NAME, ONE_YEAR_MS } from "../../shared/const.js";
import { verifyGoogleIdToken } from "./google";
import { signSession, authenticateRequest } from "./auth";
import { getUserByOpenId, upsertUser } from "../db";
import { getSessionCookieOptions } from "./cookies";

export function registerAuthRoutes(app: Express) {
  // Google ID token sign-in
  app.post("/api/auth/google", async (req: Request, res: Response) => {
    try {
      const idToken = req.body?.idToken as string | undefined;
      if (!idToken) {
        res.status(400).json({ error: "idToken is required" });
        return;
      }

      const profile = await verifyGoogleIdToken(idToken);

      await upsertUser({
        openId: profile.sub,
        email: profile.email,
        name: profile.name,
        loginMethod: "google",
        lastSignedIn: new Date(),
      });
      const user = await getUserByOpenId(profile.sub);

      // Create session token
      const token = await signSession({
        sub: profile.sub,
        appId: "google",
        name: profile.name,
        email: profile.email,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.json({
        app_session_id: token,
        user: user ?? {
          id: null,
          openId: profile.sub,
          name: profile.name,
          email: profile.email,
          loginMethod: "google",
          lastSignedIn: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("[Auth] Google login failed", error);
      res.status(401).json({ error: "Invalid Google token" });
    }
  });

  // Return current user
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      const session = await authenticateRequest(req);
      if (!session?.sub) {
        res.status(401).json({ user: null, error: "Not authenticated" });
        return;
      }
      const user = await getUserByOpenId(session.sub);
      if (!user) {
        res.status(401).json({ user: null, error: "User not found" });
        return;
      }
      res.json({ user });
    } catch (error) {
      console.error("[Auth] /me failed", error);
      res.status(401).json({ user: null, error: "Not authenticated" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    res.json({ success: true });
  });
}

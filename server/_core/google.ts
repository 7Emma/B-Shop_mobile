import { OAuth2Client } from "google-auth-library";
import { ENV } from "./env";

let client: OAuth2Client | null = null;

function getClient() {
  if (!client) {
    if (!ENV.googleClientId) {
      throw new Error("GOOGLE_CLIENT_ID is not configured");
    }
    client = new OAuth2Client(ENV.googleClientId);
  }
  return client;
}

export async function verifyGoogleIdToken(idToken: string) {
  const c = getClient();
  const ticket = await c.verifyIdToken({ idToken, audience: ENV.googleClientId });
  const payload = ticket.getPayload();
  if (!payload || !payload.sub) throw new Error("Invalid Google token");
  return {
    sub: payload.sub,
    email: payload.email ?? null,
    name: payload.name ?? payload.email ?? "User",
    picture: payload.picture ?? null,
  };
}

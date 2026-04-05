export const ENV = {
  // Core
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  isProduction: process.env.NODE_ENV === "production",

  // Google OAuth (ID token verification)
  googleClientId:
    process.env.GOOGLE_CLIENT_ID || process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",

  // Optional: admin auto-promotion
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",

  // Optional/legacy (kept for compatibility)
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};

export function ensureEnv() {
  const errors: string[] = [];

  if (!ENV.cookieSecret) errors.push("JWT_SECRET (cookie signing secret)");
  if (!ENV.googleClientId) errors.push("GOOGLE_CLIENT_ID / EXPO_PUBLIC_GOOGLE_CLIENT_ID");

  if (errors.length) {
    const message = `Missing required environment variables: ${errors.join(", ")}`;
    console.error(message);
    throw new Error(message);
  }
}

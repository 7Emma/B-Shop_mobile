import Constants from "expo-constants";
import * as ReactNative from "react-native";

export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_BASE_URL ?? ""
).replace(/\/$/, "");
export const GOOGLE_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || undefined;
export const GOOGLE_CLIENT_ID_IOS =
  process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS || undefined;
export const GOOGLE_CLIENT_ID_ANDROID =
  process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID || undefined;

export const SESSION_TOKEN_KEY = "app_session_token";
export const USER_INFO_KEY = "bshop-user-info";

/** Extrait l'hôte machine depuis hostUri Metro (ex. "192.168.1.5:8081" → "192.168.1.5"). */
function hostFromExpoPackager(hostUri: string): string {
  const lastColon = hostUri.lastIndexOf(":");
  if (lastColon > 0) {
    const maybePort = hostUri.slice(lastColon + 1);
    if (/^\d+$/.test(maybePort)) {
      return hostUri.slice(0, lastColon);
    }
  }
  return hostUri;
}

/**
 * En dev, l'API Node tourne sur le PC (port 3000). Le dev client connaît déjà l'IP du PC
 * via Metro (hostUri) — même logique que le bundle JS. Sans ça, un téléphone physique
 * utilisait 10.0.2.2 (émulateur uniquement) et toutes les requêtes tRPC échouaient.
 */
function devApiBaseFromPackager(): string | null {
  if (typeof __DEV__ === "undefined" || !__DEV__) return null;
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri || typeof hostUri !== "string") return null;
  const host = hostFromExpoPackager(hostUri);
  if (!host) return null;
  return `http://${host}:3000`;
}

export function getApiBaseUrl(): string {
  if (API_BASE_URL) return API_BASE_URL;

  // On web, derive from current hostname by replacing port 8081 with 3000
  if (
    ReactNative.Platform.OS === "web" &&
    typeof window !== "undefined" &&
    window.location
  ) {
    const { protocol, hostname } = window.location;
    const apiHostname = hostname.replace(/^8081-/, "3000-");
    if (apiHostname !== hostname) {
      return `${protocol}//${apiHostname}`;
    }
  }

  if (ReactNative.Platform.OS !== "web") {
    const fromPackager = devApiBaseFromPackager();
    if (fromPackager) return fromPackager;

    // Émulateur Android → PC hôte
    if (ReactNative.Platform.OS === "android") {
      return "http://10.0.2.2:3000";
    }
    // Simulateur iOS
    return "http://127.0.0.1:3000";
  }

  return API_BASE_URL;
}

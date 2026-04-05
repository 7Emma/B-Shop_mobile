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

  // Sur mobile, on ne peut pas avoir d'URL vide
  if (ReactNative.Platform.OS !== "web" && !API_BASE_URL) {
    console.error(
      "EXPO_PUBLIC_API_BASE_URL manquant. Les requêtes échoueront. Configurez votre fichier .env.",
    );
    // Fallback pour éviter le crash immédiat (IP locale ou émulateur)
    return "http://10.0.2.2:3000";
  }

  return API_BASE_URL;
}

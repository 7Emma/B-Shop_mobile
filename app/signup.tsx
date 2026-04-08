import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_ID_ANDROID,
  GOOGLE_CLIENT_ID_IOS,
} from "@/constants/auth";
import * as Api from "@/lib/_core/api";
import * as Auth from "@/lib/_core/auth";

import { ScreenContainer } from "@/components/screen-container";

export default function SignUpScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isGoogleAuthAvailable = !!(Platform.OS === "android"
    ? GOOGLE_CLIENT_ID_ANDROID
    : Platform.OS === "ios"
      ? GOOGLE_CLIENT_ID_IOS
      : GOOGLE_CLIENT_ID);

  WebBrowser.maybeCompleteAuthSession();
  const [, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID ?? "",
    webClientId: GOOGLE_CLIENT_ID,
    iosClientId: GOOGLE_CLIENT_ID_IOS,
    androidClientId: GOOGLE_CLIENT_ID_ANDROID,
    responseType: "id_token",
  });

  useEffect(() => {
    const run = async () => {
      if (response?.type === "success" && response.authentication?.idToken) {
        setIsLoading(true);
        try {
          const result = await Api.loginWithGoogle(
            response.authentication.idToken,
          );
          if (result.app_session_id) {
            await Auth.setSessionToken(result.app_session_id);
          }
          if (result.user) {
            await Auth.setUserInfo({
              id: result.user.id ?? 0,
              openId: result.user.openId ?? "",
              name: result.user.name ?? null,
              email: result.user.email ?? null,
              loginMethod: result.user.loginMethod ?? "google",
              lastSignedIn: new Date(result.user.lastSignedIn ?? Date.now()),
            });
          }
          router.replace("/");
        } catch (error) {
          console.error("Google signup error", error);
          Alert.alert("Sign up failed", "Unable to sign in with Google.");
        } finally {
          setIsLoading(false);
        }
      }
    };
    run();
  }, [response, router]);

  const handleGoogleSignUp = async () => {
    if (!isGoogleAuthAvailable) {
      Alert.alert(
        "Configuration Error",
        "Google Sign-In is not configured for this app. Please add the client ID to your .env file.",
      );
      return;
    }
    try {
      await promptAsync();
    } catch (error) {
      console.error("Google signup error", error);
      Alert.alert("Sign up failed", "Unable to start Google sign-in.");
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="relative overflow-hidden bg-primary px-6 pt-12 pb-10 rounded-b-[28px]">
          <View className="absolute -right-10 -top-6 h-36 w-36 rounded-full bg-white/12" />
          <View className="absolute left-8 bottom-4 h-20 w-20 rounded-full bg-secondary/30" />
          <TouchableOpacity onPress={() => router.back()} className="mb-5 z-10">
            <Text className="text-white/95 text-base font-medium">← Back</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-extrabold text-white tracking-tight z-10">
            Create account
          </Text>
          <Text className="text-white/90 mt-2 text-base leading-relaxed z-10">
            Join B-Shop in seconds
          </Text>
        </View>

        {/* Form */}
        <View className="px-6 py-8 gap-6 -mt-2">
          <View className="bg-surface border border-border rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="h-8 w-8 rounded-full bg-secondary/15 items-center justify-center">
                <Text className="text-sm">✨</Text>
              </View>
              <Text className="text-sm font-bold text-foreground">
                Google sign-up
              </Text>
            </View>
            <Text className="text-muted text-sm leading-relaxed pl-10">
              One tap with Google — no password to remember.
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleGoogleSignUp}
            disabled={isLoading || !isGoogleAuthAvailable}
            activeOpacity={0.88}
            className={`rounded-2xl py-4 items-center flex-row justify-center gap-2 bg-surface border-2 border-border ${!isGoogleAuthAvailable ? "opacity-50" : ""}`}
          >
            <Text className="text-xl">🟢</Text>
            <Text className="text-foreground font-bold">
              Sign up with Google
            </Text>
          </TouchableOpacity>
          {!isGoogleAuthAvailable && (
            <Text className="text-center text-red-500 text-xs -mt-4">
              Google Sign-In is not configured.
            </Text>
          )}

          <View className="flex-row items-center justify-center gap-1 mt-4">
            <Text className="text-muted">Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text className="text-primary font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-4" />
      </ScrollView>
    </ScreenContainer>
  );
}

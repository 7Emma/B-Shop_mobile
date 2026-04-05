import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
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
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: GOOGLE_CLIENT_ID,
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
        <View className="bg-primary px-6 py-8">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Text className="text-white text-lg">← Back</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-white">Create Account</Text>
          <Text className="text-white text-opacity-90 mt-2">
            Join B-Shop in seconds
          </Text>
        </View>

        {/* Form */}
        <View className="px-6 py-8 gap-6">
          <View className="bg-secondary/10 border border-border rounded-xl p-4">
            <Text className="text-sm font-semibold text-foreground mb-1">
              Google sign-in only
            </Text>
            <Text className="text-muted text-sm">
              Email & password signup is disabled. Use your Google account to
              continue.
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleGoogleSignUp}
            disabled={isLoading || !isGoogleAuthAvailable}
            className={`border border-border rounded-full py-4 items-center flex-row justify-center gap-2 bg-surface ${!isGoogleAuthAvailable ? "opacity-50" : ""}`}
          >
            <Text className="text-2xl">🟢</Text>
            <Text className="text-foreground font-semibold">
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

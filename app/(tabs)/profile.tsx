import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/use-auth";

const MENU_ITEMS = [
  {
    icon: "📦",
    label: "Order History",
    sub: "View your past orders",
    route: "/order-history",
  },
  {
    icon: "📍",
    label: "Saved Addresses",
    sub: "Manage delivery addresses",
    route: null,
  },
  { icon: "❤️", label: "Wishlist", sub: "Your favourite items", route: null },
  { icon: "⚙️", label: "Settings", sub: "App preferences", route: null },
  { icon: "💬", label: "Help & Support", sub: "Contact us", route: null },
];

export default function ProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  if (authLoading) {
    return (
      <ScreenContainer className="items-center justify-center bg-zinc-950">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <ScreenContainer className="p-0 bg-zinc-950">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="px-6 pt-12 pb-6">
            <Text className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-1">
              Account
            </Text>
            <Text className="text-2xl font-bold text-white">Profile</Text>
          </View>

          {/* Sign In Prompt */}
          <View className="flex-1 items-center justify-center px-6 py-12">
            {/* Avatar placeholder */}
            <View className="w-24 h-24 rounded-3xl bg-zinc-900 border border-zinc-800 items-center justify-center mb-6">
              <Text className="text-5xl">👤</Text>
            </View>

            <Text className="text-2xl font-bold text-white mb-2">
              Not signed in
            </Text>
            <Text className="text-center text-zinc-400 text-sm leading-relaxed mb-8 max-w-xs">
              Sign in to access your profile, order history, and saved
              addresses.
            </Text>

            <TouchableOpacity
              onPress={handleLogin}
              activeOpacity={0.85}
              className="bg-primary rounded-2xl px-8 py-4 w-full items-center"
            >
              <Text className="text-white font-bold tracking-wide">
                Sign In
              </Text>
            </TouchableOpacity>

            {/* Perks row */}
            <View className="flex-row mt-8 gap-6">
              {["Orders", "Wishlist", "Addresses"].map((perk) => (
                <View key={perk} className="items-center">
                  <View className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 items-center justify-center mb-1.5">
                    <Text className="text-base">
                      {perk === "Orders"
                        ? "📦"
                        : perk === "Wishlist"
                          ? "❤️"
                          : "📍"}
                    </Text>
                  </View>
                  <Text className="text-xs text-zinc-500">{perk}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0 bg-zinc-950">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View className="px-6 pt-12 pb-6">
          <Text className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-1">
            Account
          </Text>
          <Text className="text-2xl font-bold text-white">Profile</Text>
        </View>

        {/* ── User Card ── */}
        <View className="mx-6 mb-6 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <View className="flex-row items-center">
            {/* Avatar */}
            <View className="w-16 h-16 rounded-2xl bg-primary items-center justify-center mr-4">
              <Text className="text-3xl">👤</Text>
            </View>

            {/* Info */}
            <View className="flex-1">
              <Text className="text-lg font-bold text-white mb-0.5">
                {user?.name || "User"}
              </Text>
              <Text className="text-sm text-zinc-400 mb-2">
                {user?.email || "No email"}
              </Text>
              <View className="flex-row items-center self-start bg-emerald-950 border border-emerald-800 rounded-full px-3 py-0.5">
                <Text className="text-emerald-400 text-xs font-bold">
                  ✓ Verified
                </Text>
              </View>
            </View>
          </View>

          {/* Stats row */}
          <View className="flex-row mt-5 pt-5 border-t border-zinc-800">
            {[
              { label: "Orders", value: "12" },
              { label: "Wishlist", value: "5" },
              { label: "Addresses", value: "2" },
            ].map((stat, i, arr) => (
              <View
                key={stat.label}
                className={`flex-1 items-center ${i < arr.length - 1 ? "border-r border-zinc-800" : ""}`}
              >
                <Text className="text-white font-black text-lg">
                  {stat.value}
                </Text>
                <Text className="text-zinc-500 text-xs mt-0.5">
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Menu Items ── */}
        <View className="px-6 mb-6">
          <Text className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-3">
            My account
          </Text>

          <View className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
            {MENU_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                activeOpacity={0.7}
                onPress={() => {
                  if (item.route) {
                    router.push(item.route as any);
                  } else {
                    Alert.alert(
                      "Coming Soon",
                      `The ${item.label} feature is under construction.`,
                    );
                  }
                }}
                className={`flex-row items-center px-5 py-4 ${
                  index < MENU_ITEMS.length - 1
                    ? "border-b border-zinc-800"
                    : ""
                }`}
              >
                {/* Icon */}
                <View className="w-10 h-10 rounded-2xl bg-zinc-800 items-center justify-center mr-4">
                  <Text className="text-lg">{item.icon}</Text>
                </View>

                {/* Labels */}
                <View className="flex-1">
                  <Text className="text-white font-semibold text-sm">
                    {item.label}
                  </Text>
                  <Text className="text-zinc-500 text-xs mt-0.5">
                    {item.sub}
                  </Text>
                </View>

                {/* Arrow */}
                <Text className="text-zinc-600 text-lg font-light">›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Sign Out ── */}
        <View className="px-6 mb-4">
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.85}
            className="bg-zinc-900 border border-red-900 rounded-2xl py-4 items-center flex-row justify-center"
          >
            <Text className="text-red-400 font-bold tracking-wide mr-2">
              Sign Out
            </Text>
            <Text className="text-red-400 text-base">↗</Text>
          </TouchableOpacity>
        </View>

        <View className="h-8" />
      </ScrollView>
    </ScreenContainer>
  );
}

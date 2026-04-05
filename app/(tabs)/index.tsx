import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";

const CATEGORY_CONFIG = [
  { label: "Electronics", icon: "⚡" },
  { label: "Accessories", icon: "💎" },
  { label: "Fashion", icon: "👗" },
  { label: "Home", icon: "🏠" },
];

export default function HomeScreen() {
  const colors = useColors();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const {
    data: products,
    isLoading,
    isError,
  } = trpc.products.list.useQuery({ limit: 6 });

  const handleLoginPress = () => {
    router.push("/login");
  };

  const handleBrowsePress = () => {
    router.push("/catalog");
  };

  const handleProductPress = (productId: number) => {
    router.push({
      pathname: "/product",
      params: { id: productId },
    });
  };

  if (authLoading) {
    return (
      <ScreenContainer className="items-center justify-center bg-zinc-950">
        <ActivityIndicator size="large" color={colors.primary} />
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
        <View className="px-6 pt-12 pb-8">
          {/* Top row */}
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-1">
                Welcome back
              </Text>
              <Text className="text-2xl font-bold text-white">
                {isAuthenticated ? user?.name || "Friend" : "Guest"} 👋
              </Text>
            </View>
            {/* Logo badge */}
            <View className="bg-primary w-11 h-11 rounded-2xl items-center justify-center shadow-lg">
              <Text className="text-white font-black text-lg">B</Text>
            </View>
          </View>

          {/* Search Bar */}
          <TouchableOpacity
            onPress={handleBrowsePress}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 flex-row items-center"
          >
            <Text className="text-lg mr-3">🔍</Text>
            <Text className="text-zinc-500 flex-1 text-sm">
              Search products, brands...
            </Text>
            <View className="bg-zinc-800 rounded-lg px-2 py-1">
              <Text className="text-zinc-400 text-xs font-medium">Search</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Promo Banner ── */}
        <View className="mx-6 mb-8 rounded-3xl overflow-hidden bg-primary">
          <View className="px-6 py-6">
            <View className="flex-row items-center mb-1">
              <View className="bg-white bg-opacity-20 rounded-full px-2 py-0.5 mr-2">
                <Text className="text-white text-xs font-bold">LIMITED</Text>
              </View>
            </View>
            <Text className="text-white text-2xl font-black mb-1 leading-tight">
              20% off{"\n"}your first order
            </Text>
            <Text className="text-white text-opacity-80 text-sm mb-5">
              Use code <Text className="font-bold">WELCOME20</Text> at checkout
            </Text>
            <TouchableOpacity
              onPress={handleBrowsePress}
              className="bg-white self-start rounded-xl px-5 py-2.5 flex-row items-center"
            >
              <Text className="text-primary font-bold text-sm mr-1">
                Shop Now
              </Text>
              <Text className="text-primary text-sm">→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Featured Products ── */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between px-6 mb-4">
            <View>
              <Text className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-0.5">
                Handpicked for you
              </Text>
              <Text className="text-xl font-bold text-white">Featured</Text>
            </View>
            <TouchableOpacity
              onPress={handleBrowsePress}
              className="border border-zinc-700 rounded-xl px-3 py-1.5"
            >
              <Text className="text-zinc-300 text-xs font-semibold">
                See all →
              </Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View className="h-48 items-center justify-center">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : isError ? (
            <View className="h-48 items-center justify-center">
              <Text className="text-zinc-500 text-sm">
                Unable to load products
              </Text>
            </View>
          ) : (
            <FlatList
              data={products ?? []}
              keyExtractor={(item) => item.id!.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24, gap: 14 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleProductPress(item.id)}
                  activeOpacity={0.85}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden w-44"
                >
                  {/* Image area */}
                  <View className="w-full h-36 bg-zinc-800 items-center justify-center">
                    <Text className="text-5xl">📦</Text>
                  </View>

                  {/* Info */}
                  <View className="p-3.5">
                    <Text
                      className="text-sm font-semibold text-white mb-0.5 leading-snug"
                      numberOfLines={2}
                    >
                      {item.name}
                    </Text>
                    <Text className="text-xs text-zinc-500 mb-3">
                      {item.category}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-base font-black text-primary">
                        ${item.price}
                      </Text>
                      <View className="flex-row items-center bg-zinc-800 rounded-full px-2 py-0.5">
                        <Text className="text-xs mr-0.5">⭐</Text>
                        <Text className="text-xs text-zinc-300 font-medium">
                          {item.rating ?? "4.5"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        {/* ── Categories ── */}
        <View className="px-6 mb-8">
          <View className="mb-4">
            <Text className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-0.5">
              Browse
            </Text>
            <Text className="text-xl font-bold text-white">Categories</Text>
          </View>

          <View className="flex-row flex-wrap gap-3">
            {CATEGORY_CONFIG.map(({ label, icon }) => (
              <TouchableOpacity
                key={label}
                activeOpacity={0.8}
                className="flex-1 min-w-[45%] bg-zinc-900 border border-zinc-800 rounded-2xl py-4 items-center"
              >
                <Text className="text-2xl mb-1.5">{icon}</Text>
                <Text className="text-white font-semibold text-xs tracking-wide">
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Auth Section ── */}
        {!isAuthenticated ? (
          <View className="mx-6 mb-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <Text className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-2">
              Members only
            </Text>
            <Text className="text-lg font-bold text-white mb-1">
              Unlock the full experience
            </Text>
            <Text className="text-sm text-zinc-400 mb-5 leading-relaxed">
              Track orders, save favourites, and get personalised
              recommendations.
            </Text>
            <TouchableOpacity
              onPress={handleLoginPress}
              activeOpacity={0.85}
              className="bg-primary rounded-2xl py-3.5 items-center"
            >
              <Text className="text-white font-bold tracking-wide">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="mx-6 mb-8 bg-zinc-900 border border-emerald-800 rounded-3xl px-5 py-4 flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-emerald-500 items-center justify-center mr-3">
              <Text className="text-white text-xs font-bold">✓</Text>
            </View>
            <View>
              <Text className="text-white font-semibold text-sm">
                Welcome back, {user?.name || "User"}!
              </Text>
              <Text className="text-zinc-500 text-xs mt-0.5">
                You're signed in
              </Text>
            </View>
          </View>
        )}

        <View className="h-6" />
      </ScrollView>
    </ScreenContainer>
  );
}

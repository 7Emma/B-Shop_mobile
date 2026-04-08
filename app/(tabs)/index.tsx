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
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View className="px-6 pt-12 pb-8">
          {/* Top row */}
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-xs font-semibold tracking-widest text-muted uppercase mb-1">
                Welcome back
              </Text>
              <Text className="text-2xl font-bold text-foreground">
                {isAuthenticated ? user?.name || "Friend" : "Guest"} 👋
              </Text>
            </View>
            {/* Logo badge */}
            <View className="bg-primary w-11 h-11 rounded-2xl items-center justify-center border border-white/25">
              <Text className="text-white font-black text-lg">B</Text>
            </View>
          </View>

          {/* Search Bar */}
          <TouchableOpacity
            onPress={handleBrowsePress}
            activeOpacity={0.88}
            className="bg-surface border border-border rounded-2xl px-4 py-4 flex-row items-center"
          >
            <Text className="text-lg mr-3">🔍</Text>
            <Text className="text-muted flex-1 text-sm">
              Search products, brands...
            </Text>
            <View className="bg-cardInner rounded-lg px-2 py-1">
              <Text className="text-muted text-xs font-semibold">Search</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Promo Banner ── */}
        <View className="mx-6 mb-8 rounded-3xl overflow-hidden bg-primary border border-white/15">
          <View className="absolute left-0 top-0 bottom-0 w-1 bg-secondary opacity-90" />
          <View className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10" />
          <View className="absolute right-16 bottom-0 h-24 w-24 rounded-full bg-secondary/25" />
          <View className="px-6 py-6">
            <View className="flex-row items-center mb-1">
              <View className="bg-white/20 rounded-full px-2.5 py-1 mr-2">
                <Text className="text-white text-xs font-bold tracking-wide">
                  LIMITED
                </Text>
              </View>
            </View>
            <Text className="text-white text-2xl font-black mb-1 leading-tight">
              20% off{"\n"}your first order
            </Text>
            <Text className="text-white/85 text-sm mb-5 leading-relaxed">
              Use code <Text className="font-bold">WELCOME20</Text> at checkout
            </Text>
            <TouchableOpacity
              onPress={handleBrowsePress}
              activeOpacity={0.9}
              className="bg-white self-start rounded-xl px-5 py-2.5 flex-row items-center shadow-sm"
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
              <Text className="text-xs font-semibold tracking-widest text-muted uppercase mb-0.5">
                Handpicked for you
              </Text>
              <Text className="text-xl font-bold text-foreground">Featured</Text>
            </View>
            <TouchableOpacity
              onPress={handleBrowsePress}
              activeOpacity={0.85}
              className="border border-border rounded-xl px-3 py-1.5 bg-surface"
            >
              <Text className="text-muted text-xs font-semibold">
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
              <Text className="text-muted text-sm">
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
                  className="bg-surface border border-border rounded-3xl overflow-hidden w-44"
                >
                  {/* Image area */}
                  <View className="w-full h-36 bg-cardInner items-center justify-center">
                    <Text className="text-5xl">📦</Text>
                  </View>

                  {/* Info */}
                  <View className="p-3.5">
                    <Text
                      className="text-sm font-semibold text-foreground mb-0.5 leading-snug"
                      numberOfLines={2}
                    >
                      {item.name}
                    </Text>
                    <Text className="text-xs text-muted mb-3">
                      {item.category}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-base font-black text-primary">
                        ${item.price}
                      </Text>
                      <View className="flex-row items-center bg-cardInner rounded-full px-2 py-0.5">
                        <Text className="text-xs mr-0.5">⭐</Text>
                        <Text className="text-xs text-muted font-medium">
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
            <Text className="text-xs font-semibold tracking-widest text-muted uppercase mb-0.5">
              Browse
            </Text>
            <Text className="text-xl font-bold text-foreground">Categories</Text>
          </View>

          <View className="flex-row flex-wrap gap-3">
            {CATEGORY_CONFIG.map(({ label, icon }) => (
              <TouchableOpacity
                key={label}
                activeOpacity={0.8}
                className="flex-1 min-w-[45%] bg-surface border border-border rounded-2xl py-4 items-center"
              >
                <Text className="text-2xl mb-1.5">{icon}</Text>
                <Text className="text-foreground font-semibold text-xs tracking-wide">
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Auth Section ── */}
        {!isAuthenticated ? (
          <View className="mx-6 mb-8 bg-surface border border-border rounded-3xl p-6">
            <Text className="text-xs font-semibold tracking-widest text-muted uppercase mb-2">
              Members only
            </Text>
            <Text className="text-lg font-bold text-foreground mb-1">
              Unlock the full experience
            </Text>
            <Text className="text-sm text-muted mb-5 leading-relaxed">
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
          <View className="mx-6 mb-8 bg-surface border border-success/35 rounded-3xl px-5 py-4 flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-success items-center justify-center mr-3">
              <Text className="text-white text-xs font-bold">✓</Text>
            </View>
            <View>
              <Text className="text-foreground font-semibold text-sm">
                Welcome back, {user?.name || "User"}!
              </Text>
              <Text className="text-muted text-xs mt-0.5">
                {"You're signed in"}
              </Text>
            </View>
          </View>
        )}

        <View className="h-6" />
      </ScrollView>
    </ScreenContainer>
  );
}

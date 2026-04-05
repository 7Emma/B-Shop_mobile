import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";

export default function CatalogScreen() {
  const colors = useColors();
  const router = useRouter();
  const { data: products, isLoading, isError } = trpc.products.list.useQuery();
  const [filteredProducts, setFilteredProducts] = useState<typeof products>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ["All", "Electronics", "Accessories", "Fashion", "Home"];

  const CATEGORY_ICONS: Record<string, string> = {
    All: "✦",
    Electronics: "⚡",
    Accessories: "💎",
    Fashion: "👗",
    Home: "🏠",
  };

  useMemo(() => {
    const source = products ?? [];
    let filtered = source;

    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchText) {
      const query = searchText.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(query));
    }

    setFilteredProducts(filtered);
  }, [products, searchText, selectedCategory]);

  const handleProductPress = (productId: number) => {
    router.push({ pathname: "/product", params: { id: productId } });
  };

  const resultCount = filteredProducts?.length ?? 0;

  return (
    <ScreenContainer className="p-0 bg-zinc-950">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View className="px-6 pt-12 pb-4">
          <Text className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-1">
            Browse
          </Text>
          <Text className="text-2xl font-bold text-white">Catalog</Text>
        </View>

        {/* ── Search Bar ── */}
        <View className="px-6 pb-4">
          <View className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 flex-row items-center">
            <Text className="text-base mr-3">🔍</Text>
            <TextInput
              placeholder="Search products..."
              value={searchText}
              onChangeText={setSearchText}
              className="flex-1 text-white text-sm"
              placeholderTextColor={colors.muted}
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchText("")}
                className="w-6 h-6 rounded-full bg-zinc-700 items-center justify-center ml-2"
              >
                <Text className="text-zinc-300 text-xs font-bold">✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── Category Filter ── */}
        <View className="pb-4">
          <FlatList
            data={categories}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}
            renderItem={({ item }) => {
              const isActive =
                (item === "All" && !selectedCategory) ||
                selectedCategory === item;
              return (
                <TouchableOpacity
                  onPress={() =>
                    setSelectedCategory(item === "All" ? null : item)
                  }
                  activeOpacity={0.8}
                  className={`flex-row items-center px-4 py-2 rounded-2xl border ${
                    isActive
                      ? "bg-primary border-primary"
                      : "bg-zinc-900 border-zinc-800"
                  }`}
                >
                  <Text className="text-sm mr-1.5">{CATEGORY_ICONS[item]}</Text>
                  <Text
                    className={`font-semibold text-sm ${
                      isActive ? "text-white" : "text-zinc-400"
                    }`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* ── Results Count ── */}
        {!isLoading && !isError && (
          <View className="px-6 pb-3">
            <Text className="text-xs text-zinc-500 font-medium">
              {resultCount} {resultCount === 1 ? "product" : "products"} found
            </Text>
          </View>
        )}

        {/* ── Products List ── */}
        <View className="px-6 pb-4">
          {isLoading ? (
            <View className="h-64 items-center justify-center">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : isError ? (
            <View className="h-64 items-center justify-center">
              <View className="bg-zinc-900 border border-zinc-800 rounded-3xl px-8 py-8 items-center">
                <Text className="text-3xl mb-3">⚠️</Text>
                <Text className="text-white font-semibold mb-1">
                  Something went wrong
                </Text>
                <Text className="text-zinc-500 text-sm">
                  Unable to load products
                </Text>
              </View>
            </View>
          ) : resultCount === 0 ? (
            <View className="h-64 items-center justify-center">
              <View className="bg-zinc-900 border border-zinc-800 rounded-3xl px-8 py-8 items-center">
                <Text className="text-3xl mb-3">🔍</Text>
                <Text className="text-white font-semibold mb-1">
                  No results
                </Text>
                <Text className="text-zinc-500 text-sm">
                  Try a different search or category
                </Text>
              </View>
            </View>
          ) : (
            <View className="gap-3">
              {filteredProducts?.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  onPress={() => handleProductPress(product.id)}
                  activeOpacity={0.8}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex-row"
                >
                  {/* Image */}
                  <View className="w-28 h-28 bg-zinc-800 items-center justify-center">
                    <Text className="text-4xl">📦</Text>
                  </View>

                  {/* Info */}
                  <View className="flex-1 px-4 py-4 justify-between">
                    <View>
                      <Text
                        className="font-semibold text-white text-sm leading-snug mb-1"
                        numberOfLines={2}
                      >
                        {product.name}
                      </Text>
                      <View className="flex-row items-center self-start bg-zinc-800 rounded-full px-2 py-0.5">
                        <Text className="text-zinc-400 text-xs">
                          {product.category}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center justify-between mt-2">
                      <Text className="text-base font-black text-primary">
                        ${product.price}
                      </Text>
                      <View className="flex-row items-center bg-zinc-800 rounded-full px-2 py-0.5">
                        <Text className="text-xs mr-0.5">⭐</Text>
                        <Text className="text-xs text-zinc-300 font-medium">
                          {product.rating}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Arrow */}
                  <View className="justify-center pr-4">
                    <Text className="text-zinc-600 text-xl">›</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View className="h-6" />
      </ScrollView>
    </ScreenContainer>
  );
}

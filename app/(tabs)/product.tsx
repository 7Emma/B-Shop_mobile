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
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";

export default function ProductScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const numericId = Number(id);
  const {
    data: product,
    isLoading,
    isError,
  } = trpc.products.byId.useQuery(
    { id: Number.isFinite(numericId) ? numericId : 0 },
    { enabled: Number.isFinite(numericId) },
  );

  const utils = trpc.useUtils();
  const addToCart = trpc.cart.add.useMutation({
    onSuccess: async () => {
      await utils.cart.list.invalidate();
      router.push("/cart");
    },
  });

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Sign in required",
        "Please sign in to add items to your cart.",
      );
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      await addToCart.mutateAsync({ productId: product.id, quantity });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert("Error", "Unable to add to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      Alert.alert("Sign in required", "Please sign in to checkout.");
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      await addToCart.mutateAsync({ productId: product.id, quantity });
      router.push("/checkout");
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Unable to proceed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  if (isError || !product) {
    return (
      <ScreenContainer className="items-center justify-center px-6">
        <Text className="text-xl font-bold text-foreground mb-2">
          Product not found
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-3">
          <Text className="text-primary">Go back</Text>
        </TouchableOpacity>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Back Button */}
        <View className="px-6 py-4 flex-row items-center justify-between bg-surface border-b border-border">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-lg">← Back</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-foreground">
            Product Details
          </Text>
          <Text className="text-lg">❤️</Text>
        </View>

        {/* Product Image */}
        <View className="w-full h-64 bg-gradient-to-br from-primary to-secondary items-center justify-center">
          <Text className="text-6xl">📦</Text>
        </View>

        {/* Product Info */}
        <View className="px-6 py-6 gap-4">
          {/* Name and Rating */}
          <View>
            <Text className="text-2xl font-bold text-foreground mb-2">
              {product.name}
            </Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-sm text-muted">{product.category}</Text>
              <Text className="text-sm">•</Text>
              <Text className="text-sm">⭐ {product.rating ?? "4.5"}</Text>
            </View>
          </View>

          {/* Price */}
          <View className="flex-row items-baseline gap-2">
            <Text className="text-4xl font-bold text-primary">
              ${product.price}
            </Text>
            <Text className="text-lg text-muted line-through">$129.99</Text>
          </View>

          {/* Stock Status */}
          <View
            className={`rounded-full px-4 py-2 self-start ${
              (product.stock ?? 0) > 0
                ? "bg-success bg-opacity-10"
                : "bg-error bg-opacity-10"
            }`}
          >
            <Text
              className={`font-semibold text-sm ${
                (product.stock ?? 0) > 0 ? "text-success" : "text-error"
              }`}
            >
              {(product.stock ?? 0) > 0 ? "✓ In Stock" : "Out of Stock"}
            </Text>
          </View>

          {/* Description */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              Description
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              {product.description}
            </Text>
          </View>

          {/* Features */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-3">
              Features
            </Text>
            <View className="gap-2">
              {[
                "Active Noise Cancellation",
                "30-Hour Battery Life",
                "Premium Sound Quality",
                "Wireless Connection",
              ].map((feature) => (
                <View key={feature} className="flex-row items-center gap-2">
                  <Text className="text-lg">✓</Text>
                  <Text className="text-sm text-muted">{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Quantity Selector */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-3">
              Quantity
            </Text>
            <View className="flex-row items-center gap-3 bg-surface rounded-lg p-2 w-fit">
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 items-center justify-center"
              >
                <Text className="text-lg">−</Text>
              </TouchableOpacity>
              <Text className="text-lg font-semibold w-8 text-center">
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                className="w-8 h-8 items-center justify-center"
              >
                <Text className="text-lg">+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3 pt-4">
            <TouchableOpacity
              onPress={handleAddToCart}
              disabled={!product.inStock || loading}
              className={`rounded-full py-4 items-center border border-primary ${
                !product.inStock || loading ? "opacity-50" : ""
              }`}
            >
              {loading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Text className="text-primary font-semibold text-lg">
                  Add to Cart
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleBuyNow}
              disabled={!product.inStock || loading}
              className={`rounded-full py-4 items-center bg-primary ${!product.inStock || loading ? "opacity-50" : ""}`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-lg">
                  Buy Now
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Reviews Section */}
          <View className="pt-6 border-t border-border">
            <Text className="text-lg font-bold text-foreground mb-4">
              Customer Reviews
            </Text>
            <View className="bg-surface rounded-lg p-4 border border-border">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="font-semibold text-foreground">John Doe</Text>
                <Text className="text-sm">⭐⭐⭐⭐⭐</Text>
              </View>
              <Text className="text-sm text-muted">
                "Excellent headphones! Great sound quality and very comfortable
                to wear for long periods."
              </Text>
            </View>
          </View>
        </View>

        <View className="h-4" />
      </ScrollView>
    </ScreenContainer>
  );
}

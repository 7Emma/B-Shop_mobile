import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";

export default function CartScreen() {
  const colors = useColors();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { data: cartItems, isLoading } = trpc.cart.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const utils = trpc.useUtils();
  const updateQty = trpc.cart.updateQuantity.useMutation({
    onSuccess: () => utils.cart.list.invalidate(),
  });
  const removeItem = trpc.cart.remove.useMutation({
    onSuccess: () => utils.cart.list.invalidate(),
  });

  const calculateSubtotal = () => {
    return (cartItems ?? []).reduce((sum, item) => {
      return sum + parseFloat(item.price) * item.quantity;
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    updateQty.mutate({ id, quantity: newQuantity });
  };

  const handleRemoveItem = (id: number) => {
    removeItem.mutate({ id });
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const handleContinueShopping = () => {
    router.push("/catalog");
  };

  if (authLoading || isLoading) {
    return (
      <ScreenContainer className="items-center justify-center bg-zinc-950">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <ScreenContainer className="items-center justify-center px-6 bg-zinc-950">
        <View className="bg-zinc-900 border border-zinc-800 rounded-3xl px-8 py-10 items-center w-full">
          <View className="w-16 h-16 rounded-3xl bg-zinc-800 items-center justify-center mb-5">
            <Text className="text-3xl">🛒</Text>
          </View>
          <Text className="text-xl font-bold text-white mb-2">
            Sign in required
          </Text>
          <Text className="text-center text-zinc-400 text-sm leading-relaxed mb-6">
            Please sign in to view and manage your shopping cart.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/login")}
            activeOpacity={0.85}
            className="bg-primary rounded-2xl px-8 py-3.5 w-full items-center"
          >
            <Text className="text-white font-bold tracking-wide">Sign In</Text>
          </TouchableOpacity>
        </View>
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
            My Cart
          </Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-white">Shopping Cart</Text>
            {(cartItems?.length ?? 0) > 0 && (
              <View className="bg-primary rounded-full px-3 py-1">
                <Text className="text-white text-xs font-bold">
                  {cartItems?.length}{" "}
                  {cartItems?.length === 1 ? "item" : "items"}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Empty State ── */}
        {(cartItems?.length ?? 0) === 0 ? (
          <View className="flex-1 items-center justify-center px-6 py-12">
            <View className="bg-zinc-900 border border-zinc-800 rounded-3xl px-8 py-10 items-center w-full">
              <View className="w-20 h-20 rounded-3xl bg-zinc-800 items-center justify-center mb-5">
                <Text className="text-4xl">🛒</Text>
              </View>
              <Text className="text-xl font-bold text-white mb-2">
                Your cart is empty
              </Text>
              <Text className="text-center text-zinc-400 text-sm leading-relaxed mb-6">
                Add some products to get started!
              </Text>
              <TouchableOpacity
                onPress={handleContinueShopping}
                activeOpacity={0.85}
                className="bg-primary rounded-2xl px-8 py-3.5 w-full items-center"
              >
                <Text className="text-white font-bold tracking-wide">
                  Browse Catalog
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {/* ── Cart Items ── */}
            <View className="px-6 gap-3 mb-6">
              {cartItems?.map((item) => (
                <View
                  key={item.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 flex-row items-center"
                >
                  {/* Image */}
                  <View className="w-16 h-16 bg-zinc-800 rounded-2xl items-center justify-center mr-4">
                    <Text className="text-2xl">📦</Text>
                  </View>

                  {/* Info */}
                  <View className="flex-1">
                    <Text
                      className="font-semibold text-white text-sm leading-snug mb-1"
                      numberOfLines={2}
                    >
                      {item.productName ?? `Product #${item.productId}`}
                    </Text>
                    <Text className="text-primary font-black text-base">
                      ${item.price}
                    </Text>
                  </View>

                  {/* Controls */}
                  <View className="items-end gap-2">
                    {/* Quantity stepper */}
                    <View className="flex-row items-center bg-zinc-800 rounded-2xl overflow-hidden">
                      <TouchableOpacity
                        onPress={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 items-center justify-center"
                      >
                        <Text className="text-white text-lg font-bold">−</Text>
                      </TouchableOpacity>
                      <Text className="w-7 text-center text-white font-bold text-sm">
                        {item.quantity}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 items-center justify-center"
                      >
                        <Text className="text-white text-lg font-bold">+</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Remove */}
                    <TouchableOpacity
                      onPress={() => handleRemoveItem(item.id)}
                      className="w-8 h-8 rounded-xl bg-red-950 border border-red-900 items-center justify-center"
                    >
                      <Text className="text-red-400 text-xs">✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* ── Order Summary ── */}
            <View className="mx-6 mb-6 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
              <Text className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-4">
                Order Summary
              </Text>

              {/* Line items */}
              <View className="gap-3 mb-4 pb-4 border-b border-zinc-800">
                <View className="flex-row justify-between items-center">
                  <Text className="text-zinc-400 text-sm">Subtotal</Text>
                  <Text className="text-white font-semibold">
                    ${calculateSubtotal().toFixed(2)}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-zinc-400 text-sm">Tax (10%)</Text>
                  <Text className="text-white font-semibold">
                    ${calculateTax().toFixed(2)}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-zinc-400 text-sm">Shipping</Text>
                  <View className="bg-emerald-950 border border-emerald-800 rounded-full px-2 py-0.5">
                    <Text className="text-emerald-400 text-xs font-bold">
                      FREE
                    </Text>
                  </View>
                </View>
              </View>

              {/* Total */}
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-white font-bold text-base">Total</Text>
                <Text className="text-2xl font-black text-primary">
                  ${calculateTotal().toFixed(2)}
                </Text>
              </View>

              {/* CTA */}
              <TouchableOpacity
                onPress={handleCheckout}
                activeOpacity={0.85}
                className="bg-primary rounded-2xl py-4 items-center flex-row justify-center"
              >
                <Text className="text-white font-bold tracking-wide mr-2">
                  Proceed to Checkout
                </Text>
                <Text className="text-white text-base">→</Text>
              </TouchableOpacity>

              {/* Continue shopping */}
              <TouchableOpacity
                onPress={handleContinueShopping}
                activeOpacity={0.7}
                className="mt-3 py-2 items-center"
              >
                <Text className="text-zinc-500 text-sm font-medium">
                  ← Continue Shopping
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View className="h-6" />
      </ScrollView>
    </ScreenContainer>
  );
}

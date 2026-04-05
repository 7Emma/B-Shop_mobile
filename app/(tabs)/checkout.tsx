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
import { useState } from "react";

export default function CheckoutScreen() {
  const colors = useColors();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [selectedPayment, setSelectedPayment] = useState("card");

  const addresses = [
    { id: 1, name: "Home", address: "123 Main St, City, State 12345" },
    { id: 2, name: "Work", address: "456 Business Ave, City, State 67890" },
  ];

  const shippingMethods = [
    { id: "standard", name: "Standard (5-7 days)", price: 5.99 },
    { id: "express", name: "Express (2-3 days)", price: 14.99 },
    { id: "overnight", name: "Overnight", price: 29.99 },
  ];

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: "💳" },
    { id: "paypal", name: "PayPal", icon: "🅿️" },
    { id: "apple", name: "Apple Pay", icon: "🍎" },
  ];

  const subtotal = 119.98;
  const tax = 12.0;
  const shipping =
    shippingMethods.find((m) => m.id === selectedShipping)?.price || 5.99;
  const total = subtotal + tax + shipping;

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      console.log("Placing order:", {
        address: selectedAddress,
        shipping: selectedShipping,
        payment: selectedPayment,
      });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/confirmation");
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="bg-primary px-6 pt-12 pb-8">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Text className="text-white text-lg">← Back</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">Checkout</Text>
        </View>

        {/* Shipping Address */}
        <View className="px-6 py-6 border-b border-border">
          <Text className="text-lg font-bold text-foreground mb-4">
            Shipping Address
          </Text>
          {addresses.map((addr) => (
            <TouchableOpacity
              key={addr.id}
              onPress={() => setSelectedAddress(addr.id)}
              className={`p-4 rounded-lg mb-3 border-2 ${
                selectedAddress === addr.id
                  ? "border-primary bg-primary bg-opacity-5"
                  : "border-border bg-surface"
              }`}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">
                    {addr.name}
                  </Text>
                  <Text className="text-sm text-muted mt-1">
                    {addr.address}
                  </Text>
                </View>
                <View
                  className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                    selectedAddress === addr.id
                      ? "border-primary bg-primary"
                      : "border-border"
                  }`}
                >
                  {selectedAddress === addr.id && (
                    <Text className="text-white text-xs">✓</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Shipping Method */}
        <View className="px-6 py-6 border-b border-border">
          <Text className="text-lg font-bold text-foreground mb-4">
            Shipping Method
          </Text>
          {shippingMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setSelectedShipping(method.id)}
              className={`p-4 rounded-lg mb-3 border-2 ${
                selectedShipping === method.id
                  ? "border-primary bg-primary bg-opacity-5"
                  : "border-border bg-surface"
              }`}
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="font-semibold text-foreground">
                    {method.name}
                  </Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <Text className="font-bold text-primary">
                    ${method.price.toFixed(2)}
                  </Text>
                  <View
                    className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                      selectedShipping === method.id
                        ? "border-primary bg-primary"
                        : "border-border"
                    }`}
                  >
                    {selectedShipping === method.id && (
                      <Text className="text-white text-xs">✓</Text>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Method */}
        <View className="px-6 py-6 border-b border-border">
          <Text className="text-lg font-bold text-foreground mb-4">
            Payment Method
          </Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setSelectedPayment(method.id)}
              className={`p-4 rounded-lg mb-3 border-2 flex-row items-center justify-between ${
                selectedPayment === method.id
                  ? "border-primary bg-primary bg-opacity-5"
                  : "border-border bg-surface"
              }`}
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">{method.icon}</Text>
                <Text className="font-semibold text-foreground">
                  {method.name}
                </Text>
              </View>
              <View
                className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                  selectedPayment === method.id
                    ? "border-primary bg-primary"
                    : "border-border"
                }`}
              >
                {selectedPayment === method.id && (
                  <Text className="text-white text-xs">✓</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Summary */}
        <View className="px-6 py-6 bg-surface mx-6 rounded-2xl border border-border mb-6">
          <Text className="text-lg font-bold text-foreground mb-4">
            Order Summary
          </Text>

          <View className="gap-3 mb-4 pb-4 border-b border-border">
            <View className="flex-row justify-between">
              <Text className="text-muted">Subtotal</Text>
              <Text className="font-semibold text-foreground">
                ${subtotal.toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted">Tax</Text>
              <Text className="font-semibold text-foreground">
                ${tax.toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted">Shipping</Text>
              <Text className="font-semibold text-foreground">
                ${shipping.toFixed(2)}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between mb-6">
            <Text className="text-lg font-bold text-foreground">Total</Text>
            <Text className="text-2xl font-bold text-primary">
              ${total.toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handlePlaceOrder}
            disabled={isLoading}
            className={`rounded-full py-4 items-center ${isLoading ? "bg-primary opacity-50" : "bg-primary"}`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-lg">
                Place Order
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="h-4" />
      </ScrollView>
    </ScreenContainer>
  );
}

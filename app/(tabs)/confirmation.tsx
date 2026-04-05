import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";

export default function OrderConfirmationScreen() {
  const router = useRouter();

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-primary px-6 pt-12 pb-8">
          <Text className="text-xs font-semibold tracking-widest text-white/80 uppercase mb-1">
            Success
          </Text>
          <Text className="text-2xl font-bold text-white">Order Confirmed</Text>
        </View>

        <View className="items-center justify-center flex-1 px-6 py-12">
          <View className="bg-surface border border-border rounded-2xl p-8 w-full items-center">
            <View className="w-16 h-16 rounded-3xl bg-success/15 items-center justify-center mb-5">
              <Text className="text-3xl">✅</Text>
            </View>
            <Text className="text-xl font-bold text-foreground mb-2">
              Order Confirmed!
            </Text>
            <Text className="text-center text-muted mb-6">
              Your purchase is on the way. You will receive a notification once
              it ships.
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/")}
              className="bg-primary rounded-full px-8 py-3 w-full items-center mb-3"
            >
              <Text className="text-white font-semibold">
                Continue Shopping
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/profile")}
              className="border border-border rounded-full px-8 py-3 w-full items-center"
            >
              <Text className="text-foreground font-semibold">View Orders</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

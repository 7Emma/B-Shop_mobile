import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";

export default function OrderHistoryScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: orders, isLoading, isError } = trpc.orders.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const renderContent = () => {
    if (!isAuthenticated) {
      return (
        <View className="bg-surface border border-border rounded-2xl p-6">
          <Text className="text-lg font-bold text-foreground mb-2">
            Please sign in
          </Text>
          <Text className="text-muted mb-4">
            Connect your account to view your past orders.
          </Text>
          <TouchableOpacity
            className="bg-primary rounded-full py-3 px-5 self-start"
            onPress={() => router.push("/login")}
          >
            <Text className="text-white font-semibold">Sign In</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (isLoading) {
      return (
        <View className="bg-surface border border-border rounded-2xl p-6 items-center">
          <ActivityIndicator />
          <Text className="text-muted mt-3">Loading your orders...</Text>
        </View>
      );
    }

    if (isError || !orders || orders.length === 0) {
      return (
        <View className="bg-surface border border-border rounded-2xl p-6">
          <View className="w-14 h-14 rounded-2xl bg-secondary/15 items-center justify-center mb-4 self-start">
            <Text className="text-2xl">📦</Text>
          </View>
          <Text className="text-lg font-bold text-foreground mb-2">
            No orders yet
          </Text>
          <Text className="text-muted mb-4">
            You haven’t placed any orders. Browse products and start your first purchase.
          </Text>
          <TouchableOpacity
            className="bg-primary rounded-full py-3 px-5 self-start"
            onPress={() => router.push("/catalog")}
          >
            <Text className="text-white font-semibold">Browse Catalog</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View className="bg-surface border border-border rounded-2xl p-6 gap-4">
        {orders.map((order) => (
          <View
            key={order.id}
            className="border-b border-border pb-4 mb-2 last:border-b-0 last:pb-0 last:mb-0"
          >
            <Text className="text-sm text-muted">Order #{order.id}</Text>
            <Text className="text-lg font-bold text-foreground">{order.status}</Text>
            <Text className="text-xs text-muted">
              Placed on {new Date(order.createdAt as unknown as string).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </View>
    );
  };
  return (
    <ScreenContainer className="p-0">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-primary px-6 pt-12 pb-8">
          <Text className="text-xs font-semibold tracking-widest text-white/80 uppercase mb-1">
            Orders
          </Text>
          <Text className="text-2xl font-bold text-white">Order History</Text>
        </View>

        <View className="px-6 py-8">{renderContent()}</View>
      </ScrollView>
    </ScreenContainer>
  );
}

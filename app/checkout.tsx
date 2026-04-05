import { Redirect } from "expo-router";

export default function LegacyCheckoutRedirect() {
  return <Redirect href="/(tabs)/checkout" />;
}

import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { Pressable } from "react-native";

/** Tab bar button with light haptics; avoids PlatformPressable’s navigation theme hook. */
export function HapticTab(props: BottomTabBarButtonProps) {
  const {
    children,
    style,
    onPress,
    onPressIn,
    onPressOut,
    onLongPress,
    disabled,
    android_ripple,
    hoverEffect,
    pressOpacity,
    pressColor,
    href,
    ...rest
  } = props;
  void hoverEffect;
  void pressOpacity;
  void pressColor;
  void href;

  return (
    <Pressable
      {...rest}
      android_ripple={android_ripple}
      disabled={disabled}
      style={style}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressOut={onPressOut}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === "ios") {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPressIn?.(ev);
      }}
    >
      {children}
    </Pressable>
  );
}

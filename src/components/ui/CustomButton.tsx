import * as React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
 
type ButtonVariant = "filled" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";
 
interface ButtonProps {
  onPress?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
}
 
export  function CustomButton({
  children,
  disabled,
  loading,
  onPress,
  size = "md",
  variant = "filled",
  style,
  textStyle,
}: ButtonProps) {
  const sizeSyles: Record<
    ButtonSize,
    { height: number; fontSize: number; padding: number }
  > = {
    sm: { height: 36, fontSize: 14, padding: 12 },
    md: { height: 44, fontSize: 16, padding: 16 },
    lg: { height: 55, fontSize: 18, padding: 20 },
  };
 
  function getTextColor(): string {
    switch (variant) {
      case "filled":
        return "white";
      case "outline":
        return "black";
      default:
        return "black";
    }
  }
 
  function getVariantStyle(): ViewStyle {
    switch (variant) {
      case "filled":
        return {
          backgroundColor: "black",
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: "gray",
        };
      default:
        return {
          backgroundColor: "transparent",
        };
    }
  }
 
  return (
    <Pressable
      onPress={onPress}
      style={[
        getVariantStyle(),
        {
          borderRadius: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: sizeSyles[size].height,
          paddingHorizontal: sizeSyles[size].padding,
          opacity: disabled || loading ? 0.5 : 1,
        },
        style,
      ]}
      disabled={disabled || loading}
    >
      <Text
        style={[
          { color: getTextColor(), fontSize: sizeSyles[size].fontSize },
          textStyle,
        ]}
      >
        {loading ? <ActivityIndicator /> : children}
      </Text>
    </Pressable>
  );
}
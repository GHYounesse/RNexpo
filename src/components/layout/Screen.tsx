import { SafeAreaView, View, ScrollView, StyleSheet } from 'react-native';
import { tokens } from '@/src/theme';

type Props = {
  children: React.ReactNode;
  scrollable?: boolean;       // Wrap in ScrollView if true
  padding?: number;           // Optional padding override
  bgColor?: string;           // Optional background override
};
export function Screen({
  children,
  scrollable = false,
  padding = tokens.space.md,
  bgColor = tokens.colors.background,
}: Props) {
  if (scrollable) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
        <ScrollView
          contentContainerStyle={{ padding }}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { padding, backgroundColor: bgColor }]}>
      <View style={{ flex: 1 }}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
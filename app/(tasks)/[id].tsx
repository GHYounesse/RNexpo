import { useLocalSearchParams, usePathname, useSegments } from "expo-router";
import { Screen } from '@/src/components/layout/Screen';
import { AppText } from '@/src/components/ui/AppText';
export default function TaskDetail() {
    const pathname= usePathname();
    const params= useLocalSearchParams();
    const segments= useSegments();
  return (
    <Screen>
      <AppText variant="heading">Task Detail Screen {params.id}, {pathname}, {segments}</AppText>
      <AppText  variant="body" color="secondary">Pathname: {pathname}</AppText>
      <AppText  variant="body" color="error">Segments: {segments.join(', ')}</AppText>
    </Screen>
  );
}
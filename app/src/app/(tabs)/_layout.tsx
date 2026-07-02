import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "react-native";

import { Colors } from "@/constants/theme";

export default function TabLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>マップ</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="map.fill" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="ranking">
        <NativeTabs.Trigger.Label>ランキング</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="list.number" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="trends">
        <NativeTabs.Trigger.Label>推移</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="chart.line.uptrend.xyaxis" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>設定</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="gearshape.fill" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

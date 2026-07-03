import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import React from "react";

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>マップ</Label>
        <Icon sf="map.fill" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="ranking">
        <Label>ランキング</Label>
        <Icon sf="list.number" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="trends">
        <Label>推移</Label>
        <Icon sf="chart.line.uptrend.xyaxis" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <Label>設定</Label>
        <Icon sf="gearshape.fill" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

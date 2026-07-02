import React from "react";
import { StyleSheet, Text, useColorScheme } from "react-native";

import { Colors } from "@/constants/theme";
import { diffColor } from "@/lib/colors";

/** 前週比の「▲1.2」「▼0.5」「±0.0」表示 */
export function PriceChange({ current, prev, size = 13 }: { current?: number; prev?: number; size?: number }) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];
  if (current === undefined || prev === undefined) {
    return <Text style={[styles.text, { fontSize: size, color: colors.textSecondary }]}>-</Text>;
  }
  const diff = Math.round((current - prev) * 10) / 10;
  const arrow = Math.abs(diff) < 0.05 ? "±" : diff > 0 ? "▲" : "▼";
  return (
    <Text style={[styles.text, { fontSize: size, color: diffColor(diff, colors.textSecondary) }]}>
      {arrow}
      {Math.abs(diff).toFixed(1)}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: { fontVariant: ["tabular-nums"] },
});

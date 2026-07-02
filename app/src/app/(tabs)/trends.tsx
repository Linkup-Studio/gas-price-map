import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FuelSelector } from "@/components/fuel-selector";
import { CHART_COLORS, LineChart, Series } from "@/components/line-chart";
import { Colors } from "@/constants/theme";
import { FUELS, HistoryData, fetchHistory } from "@/lib/data";
import { prefName } from "@/lib/prefectures";
import { useApp } from "@/lib/store";

const PERIODS = [
  { key: "3m", label: "3ヶ月", weeks: 13 },
  { key: "1y", label: "1年", weeks: 52 },
  { key: "3y", label: "3年", weeks: 156 },
  { key: "10y", label: "10年", weeks: 520 },
] as const;

export default function TrendsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];
  const { fuel, myPref, favorites } = useApp();
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>(PERIODS[1]);
  const [national, setNational] = useState<HistoryData | null>(null);
  const [prefHist, setPrefHist] = useState<HistoryData | null>(null);

  // 比較対象: 現在地の県（なければお気に入り先頭）
  const compareCode = myPref ?? favorites[0] ?? null;

  useEffect(() => {
    fetchHistory("00").then(setNational).catch(() => {});
  }, []);
  useEffect(() => {
    if (!compareCode) return;
    fetchHistory(compareCode).then(setPrefHist).catch(() => {});
  }, [compareCode]);

  const series: Series[] = useMemo(() => {
    const cut = (points: [string, number][]) => points.slice(-period.weeks);
    const result: Series[] = [];
    if (compareCode && prefHist?.[fuel]?.length) {
      result.push({ label: prefName(compareCode), color: CHART_COLORS.pref, points: cut(prefHist[fuel]) });
    }
    if (national?.[fuel]?.length) {
      result.push({ label: "全国平均", color: CHART_COLORS.national, points: cut(national[fuel]) });
    }
    return result;
  }, [national, prefHist, fuel, period, compareCode]);

  const fuelLabel = FUELS.find((f) => f.key === fuel)?.label ?? "";

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.background }]} edges={["top"]}>
      <Text style={[styles.title, { color: colors.text }]}>価格の推移</Text>
      <FuelSelector />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={[styles.periodRow]}>
          {PERIODS.map((p) => (
            <Pressable
              key={p.key}
              onPress={() => setPeriod(p)}
              style={[
                styles.period,
                { backgroundColor: p.key === period.key ? colors.backgroundSelected : colors.backgroundElement },
              ]}
            >
              <Text style={{ color: colors.text, fontSize: 13 }}>{p.label}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={[styles.caption, { color: colors.textSecondary }]}>
          {fuelLabel}（週次・円/L）
          {compareCode ? `　${prefName(compareCode)} と全国平均` : ""}
        </Text>
        {series.length === 0 ? (
          <View style={styles.center}>
            <ActivityIndicator />
          </View>
        ) : (
          <View style={styles.chart}>
            <LineChart series={series} />
          </View>
        )}
        {!compareCode && (
          <Text style={[styles.hint, { color: colors.textSecondary }]}>
            設定タブで現在地の県を取得するか、お気に入りを追加すると、県別の推移を重ねて表示できます。
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { paddingVertical: 60, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", paddingHorizontal: 16, paddingTop: 8 },
  periodRow: { flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingVertical: 4 },
  period: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  caption: { fontSize: 12, paddingHorizontal: 16, paddingVertical: 6 },
  chart: { paddingHorizontal: 12 },
  hint: { fontSize: 13, paddingHorizontal: 16, paddingTop: 12, lineHeight: 20 },
});

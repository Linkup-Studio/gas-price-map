import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from "react-native";

import { CHART_COLORS, LineChart, Series } from "@/components/line-chart";
import { PriceChange } from "@/components/price-change";
import { Colors } from "@/constants/theme";
import { FUELS, HistoryData, fetchHistory, formatDate } from "@/lib/data";
import { prefName } from "@/lib/prefectures";
import { useApp } from "@/lib/store";

export default function PrefDetailScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];
  const { latest, favorites, toggleFavorite } = useApp();
  const [hist, setHist] = useState<HistoryData | null>(null);
  const [national, setNational] = useState<HistoryData | null>(null);

  useEffect(() => {
    if (!code) return;
    fetchHistory(code).then(setHist).catch(() => {});
    fetchHistory("00").then(setNational).catch(() => {});
  }, [code]);

  const rankOf = useMemo(() => {
    if (!latest || !code) return null;
    const prices = latest.fuels.regular.prices;
    const sorted = Object.entries(prices)
      .filter(([c]) => c !== "00")
      .sort((a, b) => a[1] - b[1]);
    const idx = sorted.findIndex(([c]) => c === code);
    return idx >= 0 ? idx + 1 : null;
  }, [latest, code]);

  if (!code) return null;
  const fav = favorites.includes(code);

  return (
    <>
      <Stack.Screen
        options={{
          title: prefName(code),
          headerRight: () => (
            <Pressable onPress={() => toggleFavorite(code)} hitSlop={8}>
              <Text style={{ fontSize: 20, color: fav ? "#E5A000" : colors.textSecondary }}>
                {fav ? "★" : "☆"}
              </Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        {latest && (
          <View style={[styles.card, { backgroundColor: colors.backgroundElement }]}>
            <Text style={[styles.caption, { color: colors.textSecondary }]}>
              {formatDate(latest.fuels.regular.surveyDate)}調査
              {rankOf ? `　レギュラーの安さ 全国${rankOf}位` : ""}
            </Text>
            {FUELS.map((f) => {
              const d = latest.fuels[f.key];
              const price = d.prices[code];
              return (
                <View key={f.key} style={styles.priceRow}>
                  <Text style={[styles.fuelLabel, { color: colors.text }]}>{f.label}</Text>
                  <View style={styles.priceRight}>
                    <Text style={[styles.price, { color: colors.text }]}>
                      {price !== undefined ? price.toFixed(1) : "-"}
                      <Text style={[styles.unit, { color: colors.textSecondary }]}> 円/L</Text>
                    </Text>
                    <PriceChange current={price} prev={d.prevPrices[code]} />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {FUELS.map((f) => {
          const prefPoints = hist?.[f.key]?.slice(-52) ?? [];
          const natPoints = national?.[f.key]?.slice(-52) ?? [];
          if (prefPoints.length === 0) return null;
          const series: Series[] = [
            { label: prefName(code), color: CHART_COLORS.pref, points: prefPoints },
            ...(natPoints.length > 0
              ? [{ label: "全国平均", color: CHART_COLORS.national, points: natPoints }]
              : []),
          ];
          return (
            <View key={f.key} style={styles.chartBlock}>
              <Text style={[styles.chartTitle, { color: colors.text }]}>{f.label}（直近1年）</Text>
              <LineChart series={series} height={180} />
            </View>
          );
        })}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 48, gap: 16 },
  card: { borderRadius: 12, padding: 14, gap: 10 },
  caption: { fontSize: 12 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  fuelLabel: { fontSize: 15 },
  priceRight: { flexDirection: "row", alignItems: "baseline", gap: 10 },
  price: { fontSize: 18, fontWeight: "600", fontVariant: ["tabular-nums"] },
  unit: { fontSize: 12, fontWeight: "400" },
  chartBlock: { gap: 4 },
  chartTitle: { fontSize: 15, fontWeight: "600" },
});

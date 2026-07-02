import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FuelSelector } from "@/components/fuel-selector";
import { PriceChange } from "@/components/price-change";
import { Colors } from "@/constants/theme";
import { formatDate } from "@/lib/data";
import { prefName } from "@/lib/prefectures";
import { useApp } from "@/lib/store";

type Row = { code: string; price: number; prev?: number };

export default function RankingScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];
  const { fuel, latest, favorites, myPref } = useApp();
  const [asc, setAsc] = useState(true);
  const router = useRouter();

  const data = latest?.fuels[fuel];

  const rows: Row[] = useMemo(() => {
    if (!data) return [];
    const list = Object.entries(data.prices)
      .filter(([code]) => code !== "00")
      .map(([code, price]) => ({ code, price, prev: data.prevPrices[code] }));
    list.sort((a, b) => (asc ? a.price - b.price : b.price - a.price));
    return list;
  }, [data, asc]);

  const pinned = new Set([...(myPref ? [myPref] : []), ...favorites]);

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: colors.text }]}>ランキング</Text>
        <Pressable
          onPress={() => setAsc((v) => !v)}
          style={[styles.sort, { backgroundColor: colors.backgroundElement }]}
        >
          <Text style={{ color: colors.text, fontSize: 13 }}>{asc ? "安い順 ↑" : "高い順 ↓"}</Text>
        </Pressable>
      </View>
      <FuelSelector />
      {data && (
        <Text style={[styles.caption, { color: colors.textSecondary }]}>
          {formatDate(data.surveyDate)}調査・前週比つき
        </Text>
      )}
      <FlatList
        data={rows}
        keyExtractor={(r) => r.code}
        contentInsetAdjustmentBehavior="automatic"
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => router.push(`/pref/${item.code}`)}
            style={[
              styles.row,
              { borderBottomColor: colors.backgroundElement },
              pinned.has(item.code) && { backgroundColor: colors.backgroundElement },
            ]}
          >
            <Text style={[styles.rank, { color: colors.textSecondary }]}>{index + 1}</Text>
            <Text style={[styles.pref, { color: colors.text }]}>
              {prefName(item.code)}
              {item.code === myPref ? " 📍" : favorites.includes(item.code) ? " ★" : ""}
            </Text>
            <View style={styles.right}>
              <Text style={[styles.price, { color: colors.text }]}>{item.price.toFixed(1)}</Text>
              <PriceChange current={item.price} prev={item.prev} />
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: { fontSize: 22, fontWeight: "700" },
  sort: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  caption: { fontSize: 12, paddingHorizontal: 16, paddingBottom: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rank: { width: 30, fontSize: 14, fontVariant: ["tabular-nums"] },
  pref: { flex: 1, fontSize: 16 },
  right: { flexDirection: "row", alignItems: "baseline", gap: 10 },
  price: { fontSize: 17, fontWeight: "600", fontVariant: ["tabular-nums"] },
});

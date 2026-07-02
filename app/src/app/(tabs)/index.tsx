import { useRouter } from "expo-router";
import React, { useState } from "react";
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
import { JapanMap } from "@/components/japan-map";
import { PriceChange } from "@/components/price-change";
import { Colors } from "@/constants/theme";
import { FUELS, formatDate } from "@/lib/data";
import { prefName } from "@/lib/prefectures";
import { useApp } from "@/lib/store";

export default function MapScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];
  const { fuel, latest, loadError, reload, myPref } = useApp();
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const data = latest?.fuels[fuel];
  const fuelLabel = FUELS.find((f) => f.key === fuel)?.label ?? "";
  const unit = fuel === "kerosene" ? "円/L" : "円/L";
  const shown = selected ?? myPref;

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.background }]} edges={["top"]}>
      <Text style={[styles.title, { color: colors.text }]}>ガソリン価格マップ</Text>
      <FuelSelector />
      {!data ? (
        <View style={styles.center}>
          {loadError ? (
            <>
              <Text style={{ color: colors.textSecondary }}>データを取得できませんでした</Text>
              <Pressable onPress={reload} style={[styles.retry, { backgroundColor: colors.backgroundElement }]}>
                <Text style={{ color: colors.text }}>再読み込み</Text>
              </Pressable>
            </>
          ) : (
            <ActivityIndicator />
          )}
        </View>
      ) : (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View style={styles.headerRow}>
            <Text style={[styles.national, { color: colors.text }]}>
              全国平均 {data.prices["00"]?.toFixed(1)}
              <Text style={[styles.unit, { color: colors.textSecondary }]}> {unit}</Text>
            </Text>
            <PriceChange current={data.prices["00"]} prev={data.prevPrices["00"]} />
          </View>
          <Text style={[styles.caption, { color: colors.textSecondary }]}>
            {fuelLabel}・{formatDate(data.surveyDate)}調査（週次）
          </Text>

          <JapanMap prices={data.prices} selected={shown ?? null} onSelect={setSelected} />

          <View style={styles.legendRow}>
            <Text style={[styles.legendLabel, { color: "#2166ac" }]}>■ 安い</Text>
            <Text style={[styles.legendLabel, { color: colors.textSecondary }]}>← 全国平均 →</Text>
            <Text style={[styles.legendLabel, { color: "#b2182b" }]}>■ 高い</Text>
          </View>

          {shown && data.prices[shown] !== undefined && (
            <Pressable
              onPress={() => router.push(`/pref/${shown}`)}
              style={[styles.card, { backgroundColor: colors.backgroundElement }]}
            >
              <View>
                <Text style={[styles.cardPref, { color: colors.text }]}>
                  {prefName(shown)}
                  {shown === myPref && selected === null ? "（現在地）" : ""}
                </Text>
                <Text style={[styles.cardSub, { color: colors.textSecondary }]}>タップで詳細・推移へ</Text>
              </View>
              <View style={styles.cardRight}>
                <Text style={[styles.cardPrice, { color: colors.text }]}>
                  {data.prices[shown].toFixed(1)}
                  <Text style={[styles.unit, { color: colors.textSecondary }]}> {unit}</Text>
                </Text>
                <PriceChange current={data.prices[shown]} prev={data.prevPrices[shown]} />
              </View>
            </Pressable>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  retry: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  title: { fontSize: 22, fontWeight: "700", paddingHorizontal: 16, paddingTop: 8 },
  headerRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  national: { fontSize: 26, fontWeight: "700", fontVariant: ["tabular-nums"] },
  unit: { fontSize: 13, fontWeight: "400" },
  caption: { fontSize: 12, paddingHorizontal: 16, paddingBottom: 4 },
  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 4,
  },
  legendLabel: { fontSize: 11 },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 14,
    borderRadius: 12,
  },
  cardPref: { fontSize: 17, fontWeight: "600" },
  cardSub: { fontSize: 12, marginTop: 2 },
  cardRight: { alignItems: "flex-end" },
  cardPrice: { fontSize: 20, fontWeight: "700", fontVariant: ["tabular-nums"] },
});

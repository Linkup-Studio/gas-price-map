import React, { useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { formatDateWithYear } from "@/lib/data";
import { PREFECTURES, prefName } from "@/lib/prefectures";
import { useApp } from "@/lib/store";

const SOURCE_URL = "https://www.enecho.meti.go.jp/statistics/petroleum_and_lpgas/pl007/";
const PRIVACY_URL = "https://linkup-studio.github.io/gas-price-map/privacy.html";

export default function SettingsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];
  const { latest, myPref, detectMyPref, locationDenied, favorites, toggleFavorite } = useApp();
  const [detecting, setDetecting] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const surveyDate = latest?.fuels.regular.surveyDate ?? null;

  const onDetect = async () => {
    setDetecting(true);
    try {
      await detectMyPref();
    } finally {
      setDetecting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.background }]} edges={["top"]}>
      <Text style={[styles.title, { color: colors.text }]}>設定</Text>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <Text style={[styles.section, { color: colors.textSecondary }]}>あなたの県</Text>
        <View style={[styles.card, { backgroundColor: colors.backgroundElement }]}>
          <View style={styles.rowBetween}>
            <Text style={[styles.body, { color: colors.text }]}>
              {myPref ? prefName(myPref) : "未設定"}
            </Text>
            <Pressable onPress={onDetect} style={[styles.button, { backgroundColor: colors.background }]}>
              {detecting ? (
                <ActivityIndicator />
              ) : (
                <Text style={{ color: colors.text, fontSize: 13 }}>現在地から取得</Text>
              )}
            </Pressable>
          </View>
          {locationDenied && (
            <Text style={[styles.note, { color: colors.textSecondary }]}>
              位置情報が許可されていません。iOSの設定から許可するか、下の一覧から選んでください。
            </Text>
          )}
          <Pressable onPress={() => setShowPicker((v) => !v)}>
            <Text style={[styles.link, { color: colors.textSecondary }]}>
              {showPicker ? "一覧を閉じる" : "一覧から選ぶ / お気に入りを編集"}
            </Text>
          </Pressable>
          {showPicker && (
            <View style={styles.grid}>
              {PREFECTURES.map((p) => {
                const fav = favorites.includes(p.code);
                return (
                  <Pressable
                    key={p.code}
                    onPress={() => toggleFavorite(p.code)}
                    style={[
                      styles.chip,
                      { backgroundColor: fav ? colors.backgroundSelected : colors.background },
                    ]}
                  >
                    <Text style={{ color: colors.text, fontSize: 12 }}>
                      {fav ? "★ " : ""}
                      {p.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
          {favorites.length > 0 && (
            <Text style={[styles.note, { color: colors.textSecondary }]}>
              お気に入り: {favorites.map(prefName).join("・")}
            </Text>
          )}
        </View>

        <Text style={[styles.section, { color: colors.textSecondary }]}>データについて</Text>
        <View style={[styles.card, { backgroundColor: colors.backgroundElement }]}>
          <Text style={[styles.body, { color: colors.text }]}>
            出典: 資源エネルギー庁「石油製品小売市況調査」
          </Text>
          <Text style={[styles.note, { color: colors.textSecondary }]}>
            毎週月曜に調査され、水曜に公表される都道府県別の平均価格です。
            {surveyDate ? `\n現在のデータ: ${formatDateWithYear(surveyDate)}調査` : ""}
            {"\n"}灯油は18Lあたりで公表される価格を1Lあたりに換算しています。
          </Text>
          <Pressable onPress={() => Linking.openURL(SOURCE_URL)}>
            <Text style={[styles.link, { color: colors.textSecondary }]}>出典ページを開く</Text>
          </Pressable>
        </View>

        <Text style={[styles.section, { color: colors.textSecondary }]}>このアプリ</Text>
        <View style={[styles.card, { backgroundColor: colors.backgroundElement }]}>
          <Pressable onPress={() => Linking.openURL(PRIVACY_URL)}>
            <Text style={[styles.link, { color: colors.textSecondary }]}>プライバシーポリシー</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  title: { fontSize: 22, fontWeight: "700", paddingHorizontal: 16, paddingTop: 8 },
  content: { paddingBottom: 32 },
  section: { fontSize: 13, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 6 },
  card: { marginHorizontal: 16, borderRadius: 12, padding: 14, gap: 8 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  body: { fontSize: 16 },
  note: { fontSize: 12, lineHeight: 18 },
  link: { fontSize: 13, textDecorationLine: "underline" },
  button: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 6, paddingTop: 4 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14 },
});

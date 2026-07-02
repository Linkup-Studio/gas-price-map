import React from "react";
import { Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";

import { Colors } from "@/constants/theme";
import { FUELS } from "@/lib/data";
import { useApp } from "@/lib/store";

export function FuelSelector() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];
  const { fuel, setFuel } = useApp();

  return (
    <View style={[styles.row, { backgroundColor: colors.backgroundElement }]}>
      {FUELS.map((f) => {
        const selected = f.key === fuel;
        return (
          <Pressable
            key={f.key}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => setFuel(f.key)}
            style={[styles.item, selected && { backgroundColor: colors.background }]}
          >
            <Text
              style={[
                styles.label,
                { color: selected ? colors.text : colors.textSecondary },
                selected && styles.labelSelected,
              ]}
            >
              {f.short}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 3,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  item: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: "center",
  },
  label: { fontSize: 13 },
  labelSelected: { fontWeight: "600" },
});

import japan from "@svg-maps/japan";
import React, { useMemo } from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import Svg, { G, Path } from "react-native-svg";

import { colorScale, divergingColor } from "@/lib/colors";
import { PREFECTURES } from "@/lib/prefectures";

const EN_TO_CODE = new Map(PREFECTURES.map((p) => [p.en, p.code]));

type Props = {
  prices: Record<string, number>;
  selected: string | null;
  onSelect: (code: string) => void;
};

export function JapanMap({ prices, selected, onSelect }: Props) {
  const scheme = useColorScheme();
  const stroke = scheme === "dark" ? "#000000" : "#ffffff";
  const noData = scheme === "dark" ? "#2E3135" : "#E0E1E6";

  const { mid, spread } = useMemo(() => colorScale(prices), [prices]);

  return (
    <View style={styles.container}>
      <Svg viewBox={japan.viewBox} style={styles.svg}>
        <G>
          {japan.locations.map((loc) => {
            const code = EN_TO_CODE.get(loc.id);
            const price = code ? prices[code] : undefined;
            const fill = price !== undefined ? divergingColor(price, mid, spread) : noData;
            const isSelected = code !== undefined && code === selected;
            return (
              <Path
                key={loc.id}
                d={loc.path}
                fill={fill}
                stroke={isSelected ? "#111111" : stroke}
                strokeWidth={isSelected ? 2 : 0.6}
                onPress={code ? () => onSelect(code) : undefined}
              />
            );
          })}
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", aspectRatio: 438 / 516 },
  svg: { width: "100%", height: "100%" },
});

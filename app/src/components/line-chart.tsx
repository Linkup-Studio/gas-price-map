import React, { useMemo } from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import Svg, { Line, Polyline, Text as SvgText } from "react-native-svg";

import { Colors } from "@/constants/theme";
import { CHART_COLORS } from "@/lib/colors";

export type Series = {
  label: string;
  color: string;
  points: [string, number][]; // [ISO日付, 価格]
};

type Props = {
  series: Series[];
  height?: number;
  unit?: string;
};

const W = 360;
const PAD_L = 40;
const PAD_R = 12;
const PAD_T = 10;
const PAD_B = 24;

export function LineChart({ series, height = 220, unit = "円/L" }: Props) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];
  const gridColor = scheme === "dark" ? "#2E3135" : "#E8E8EC";

  const layout = useMemo(() => {
    const all = series.flatMap((s) => s.points);
    if (all.length === 0) return null;
    const values = all.map(([, v]) => v);
    const dates = all.map(([d]) => d).sort();
    const vMin = Math.min(...values);
    const vMax = Math.max(...values);
    const pad = Math.max((vMax - vMin) * 0.08, 1);
    const lo = vMin - pad;
    const hi = vMax + pad;
    const t0 = new Date(dates[0]).getTime();
    const t1 = new Date(dates[dates.length - 1]).getTime();
    const x = (iso: string) =>
      PAD_L + ((new Date(iso).getTime() - t0) / Math.max(t1 - t0, 1)) * (W - PAD_L - PAD_R);
    const y = (v: number) => PAD_T + (1 - (v - lo) / (hi - lo)) * (height - PAD_T - PAD_B);
    // グリッドは整数の円単位でおよそ4本
    const step = Math.max(Math.round((hi - lo) / 4), 1);
    const gridValues: number[] = [];
    for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) gridValues.push(v);
    return { x, y, gridValues, first: dates[0], last: dates[dates.length - 1] };
  }, [series, height]);

  if (!layout) return null;
  const { x, y, gridValues, first, last } = layout;

  const fmt = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}/${d.getMonth() + 1}`;
  };

  return (
    <View>
      <Svg viewBox={`0 0 ${W} ${height}`} style={{ width: "100%", aspectRatio: W / height }}>
        {gridValues.map((v) => (
          <React.Fragment key={v}>
            <Line x1={PAD_L} y1={y(v)} x2={W - PAD_R} y2={y(v)} stroke={gridColor} strokeWidth={1} />
            <SvgText x={PAD_L - 6} y={y(v) + 3.5} fontSize={10} fill={colors.textSecondary} textAnchor="end">
              {v}
            </SvgText>
          </React.Fragment>
        ))}
        {series.map((s) => (
          <Polyline
            key={s.label}
            points={s.points.map(([d, v]) => `${x(d)},${y(v)}`).join(" ")}
            fill="none"
            stroke={s.color}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        ))}
        <SvgText x={PAD_L} y={height - 6} fontSize={10} fill={colors.textSecondary}>
          {fmt(first)}
        </SvgText>
        <SvgText x={W - PAD_R} y={height - 6} fontSize={10} fill={colors.textSecondary} textAnchor="end">
          {fmt(last)}
        </SvgText>
      </Svg>
      <View style={styles.legend}>
        {series.map((s) => (
          <View key={s.label} style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: s.color }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>
              {s.label}
              {s.points.length > 0 ? `  ${s.points[s.points.length - 1][1].toFixed(1)}${unit}` : ""}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export { CHART_COLORS };

const styles = StyleSheet.create({
  legend: { flexDirection: "row", gap: 16, paddingHorizontal: 4, paddingTop: 4 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  swatch: { width: 10, height: 10, borderRadius: 3 },
  legendText: { fontSize: 12 },
});

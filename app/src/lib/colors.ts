/**
 * 地図ヒートマップ用のダイバージング配色。
 * 中点=全国平均（ニュートラルグレー）、安い=青、高い=赤。
 * 中点から両極へ明度が単調に下がる（暗くなる）よう設計している。
 */

type RGB = [number, number, number];

const CHEAP_POLE: RGB = [33, 102, 172]; // #2166ac
const NEUTRAL: RGB = [232, 232, 232]; // #e8e8e8
const EXPENSIVE_POLE: RGB = [178, 24, 43]; // #b2182b

function mix(a: RGB, b: RGB, t: number): string {
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

/**
 * value: 対象価格, mid: 全国平均, spread: 平均からこの幅で両極に達する
 */
export function divergingColor(value: number, mid: number, spread: number): string {
  const t = Math.max(-1, Math.min(1, (value - mid) / spread));
  return t < 0 ? mix(NEUTRAL, CHEAP_POLE, -t) : mix(NEUTRAL, EXPENSIVE_POLE, t);
}

/** 都道府県価格マップから中点(全国平均)と広がりを算出 */
export function colorScale(prices: Record<string, number>): { mid: number; spread: number } {
  const values = Object.entries(prices)
    .filter(([code]) => code !== "00")
    .map(([, v]) => v);
  const mid = prices["00"] ?? values.reduce((a, b) => a + b, 0) / values.length;
  const maxDev = Math.max(...values.map((v) => Math.abs(v - mid)), 1);
  return { mid, spread: maxDev };
}

/** 前週比の表示色（上昇=赤 / 下降=青 / 横ばい=グレー） */
export function diffColor(diff: number | null, fallback: string): string {
  if (diff === null || Math.abs(diff) < 0.05) return fallback;
  return diff > 0 ? "#c62f21" : "#1d6fc4";
}

export const CHART_COLORS = {
  pref: "#3E63DD", // 選択中の県
  national: "#8B8D98", // 全国平均（比較の基準線）
} as const;

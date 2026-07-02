import AsyncStorage from "@react-native-async-storage/async-storage";

export type FuelType = "regular" | "high_octane" | "diesel" | "kerosene";

export const FUELS: { key: FuelType; label: string; short: string }[] = [
  { key: "regular", label: "レギュラー", short: "レギュラー" },
  { key: "high_octane", label: "ハイオク", short: "ハイオク" },
  { key: "diesel", label: "軽油", short: "軽油" },
  { key: "kerosene", label: "灯油", short: "灯油" },
];

export type FuelLatest = {
  surveyDate: string;
  prices: Record<string, number>;
  prevSurveyDate: string | null;
  prevPrices: Record<string, number>;
};

export type LatestData = { fuels: Record<FuelType, FuelLatest> };

/** 履歴: 油種 -> [ [ISO日付, 価格], ... ] */
export type HistoryData = Record<FuelType, [string, number][]>;

const BASE_URL = "https://raw.githubusercontent.com/Linkup-Studio/gas-price-map/main/data";
const CACHE_PREFIX = "cache:v1:";

async function fetchWithCache<T>(path: string): Promise<T> {
  const cacheKey = CACHE_PREFIX + path;
  try {
    const res = await fetch(`${BASE_URL}/${path}`, { headers: { "Cache-Control": "no-cache" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const parsed = JSON.parse(text) as T;
    AsyncStorage.setItem(cacheKey, text).catch(() => {});
    return parsed;
  } catch (err) {
    // オフライン時は最後に取得できたデータで表示を維持する
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached) as T;
    throw err;
  }
}

export function fetchLatest(): Promise<LatestData> {
  return fetchWithCache<LatestData>("latest.json");
}

/** code: "00"(全国) または "01".."47" */
export function fetchHistory(code: string): Promise<HistoryData> {
  return fetchWithCache<HistoryData>(code === "00" ? "history/national.json" : `history/${code}.json`);
}

export function formatDate(iso: string | null): string {
  if (!iso) return "-";
  const [, m, d] = iso.split("-");
  return `${Number(m)}/${Number(d)}`;
}

export function formatDateWithYear(iso: string | null): string {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-");
  return `${y}年${Number(m)}月${Number(d)}日`;
}

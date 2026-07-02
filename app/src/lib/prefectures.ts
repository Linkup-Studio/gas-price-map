export type Prefecture = {
  code: string;
  name: string;
  region: string;
  en: string;
  capital: [number, number]; // [lat, lng] 県庁所在地（現在地→自県判定のフォールバック用）
};

export const PREFECTURES: Prefecture[] = [
  { code: "01", name: "北海道", region: "北海道", en: "hokkaido", capital: [43.0642, 141.3469] },
  { code: "02", name: "青森", region: "東北", en: "aomori", capital: [40.8244, 140.74] },
  { code: "03", name: "岩手", region: "東北", en: "iwate", capital: [39.7036, 141.1527] },
  { code: "04", name: "宮城", region: "東北", en: "miyagi", capital: [38.2688, 140.8721] },
  { code: "05", name: "秋田", region: "東北", en: "akita", capital: [39.7186, 140.1024] },
  { code: "06", name: "山形", region: "東北", en: "yamagata", capital: [38.2404, 140.3633] },
  { code: "07", name: "福島", region: "東北", en: "fukushima", capital: [37.75, 140.4678] },
  { code: "08", name: "茨城", region: "関東", en: "ibaraki", capital: [36.3418, 140.4468] },
  { code: "09", name: "栃木", region: "関東", en: "tochigi", capital: [36.5657, 139.8836] },
  { code: "10", name: "群馬", region: "関東", en: "gunma", capital: [36.3911, 139.0608] },
  { code: "11", name: "埼玉", region: "関東", en: "saitama", capital: [35.8574, 139.6489] },
  { code: "12", name: "千葉", region: "関東", en: "chiba", capital: [35.6047, 140.1233] },
  { code: "13", name: "東京", region: "関東", en: "tokyo", capital: [35.6895, 139.6917] },
  { code: "14", name: "神奈川", region: "関東", en: "kanagawa", capital: [35.4478, 139.6425] },
  { code: "15", name: "新潟", region: "中部", en: "niigata", capital: [37.9026, 139.0236] },
  { code: "16", name: "富山", region: "中部", en: "toyama", capital: [36.6953, 137.2113] },
  { code: "17", name: "石川", region: "中部", en: "ishikawa", capital: [36.5947, 136.6256] },
  { code: "18", name: "福井", region: "中部", en: "fukui", capital: [36.0652, 136.2216] },
  { code: "19", name: "山梨", region: "中部", en: "yamanashi", capital: [35.6642, 138.5684] },
  { code: "20", name: "長野", region: "中部", en: "nagano", capital: [36.6513, 138.181] },
  { code: "21", name: "岐阜", region: "中部", en: "gifu", capital: [35.3912, 136.7223] },
  { code: "22", name: "静岡", region: "中部", en: "shizuoka", capital: [34.9769, 138.3831] },
  { code: "23", name: "愛知", region: "中部", en: "aichi", capital: [35.1802, 136.9066] },
  { code: "24", name: "三重", region: "近畿", en: "mie", capital: [34.7303, 136.5086] },
  { code: "25", name: "滋賀", region: "近畿", en: "shiga", capital: [35.0045, 135.8686] },
  { code: "26", name: "京都", region: "近畿", en: "kyoto", capital: [35.0116, 135.7681] },
  { code: "27", name: "大阪", region: "近畿", en: "osaka", capital: [34.6863, 135.52] },
  { code: "28", name: "兵庫", region: "近畿", en: "hyogo", capital: [34.6913, 135.183] },
  { code: "29", name: "奈良", region: "近畿", en: "nara", capital: [34.6851, 135.8048] },
  { code: "30", name: "和歌山", region: "近畿", en: "wakayama", capital: [34.226, 135.1675] },
  { code: "31", name: "鳥取", region: "中国", en: "tottori", capital: [35.5039, 134.2377] },
  { code: "32", name: "島根", region: "中国", en: "shimane", capital: [35.4723, 133.0505] },
  { code: "33", name: "岡山", region: "中国", en: "okayama", capital: [34.6618, 133.9344] },
  { code: "34", name: "広島", region: "中国", en: "hiroshima", capital: [34.3966, 132.4596] },
  { code: "35", name: "山口", region: "中国", en: "yamaguchi", capital: [34.1859, 131.4714] },
  { code: "36", name: "徳島", region: "四国", en: "tokushima", capital: [34.0658, 134.5593] },
  { code: "37", name: "香川", region: "四国", en: "kagawa", capital: [34.3401, 134.0434] },
  { code: "38", name: "愛媛", region: "四国", en: "ehime", capital: [33.8416, 132.7657] },
  { code: "39", name: "高知", region: "四国", en: "kochi", capital: [33.5597, 133.5311] },
  { code: "40", name: "福岡", region: "九州・沖縄", en: "fukuoka", capital: [33.6064, 130.4181] },
  { code: "41", name: "佐賀", region: "九州・沖縄", en: "saga", capital: [33.2494, 130.2988] },
  { code: "42", name: "長崎", region: "九州・沖縄", en: "nagasaki", capital: [32.7448, 129.8737] },
  { code: "43", name: "熊本", region: "九州・沖縄", en: "kumamoto", capital: [32.7898, 130.7417] },
  { code: "44", name: "大分", region: "九州・沖縄", en: "oita", capital: [33.2382, 131.6126] },
  { code: "45", name: "宮崎", region: "九州・沖縄", en: "miyazaki", capital: [31.9111, 131.4239] },
  { code: "46", name: "鹿児島", region: "九州・沖縄", en: "kagoshima", capital: [31.5602, 130.5581] },
  { code: "47", name: "沖縄", region: "九州・沖縄", en: "okinawa", capital: [26.2124, 127.6809] },
];

export const prefByCode = new Map(PREFECTURES.map((p) => [p.code, p]));

export function prefName(code: string): string {
  return code === "00" ? "全国" : (prefByCode.get(code)?.name ?? code);
}

/** 緯度経度から最寄りの県庁所在地で県を推定する（reverse geocode失敗時のフォールバック） */
export function nearestPrefecture(lat: number, lng: number): Prefecture {
  let best = PREFECTURES[0];
  let bestDist = Infinity;
  for (const p of PREFECTURES) {
    const d = (p.capital[0] - lat) ** 2 + ((p.capital[1] - lng) * Math.cos((lat * Math.PI) / 180)) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = p;
    }
  }
  return best;
}

/** reverseGeocodeの region（"Tokyo"/"東京都" など）を県コードへ */
export function regionToCode(region: string | null | undefined): string | null {
  if (!region) return null;
  const normalized = region.toLowerCase().replace(/[\s-]/g, "");
  for (const p of PREFECTURES) {
    if (
      normalized === p.en ||
      normalized === `${p.en}ken` ||
      normalized === `${p.en}fu` ||
      normalized === `${p.en}to` ||
      region.startsWith(p.name)
    ) {
      return p.code;
    }
  }
  return null;
}

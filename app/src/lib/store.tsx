import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { fetchLatest, FuelType, LatestData } from "./data";
import { nearestPrefecture, regionToCode } from "./prefectures";

type AppState = {
  fuel: FuelType;
  setFuel: (f: FuelType) => void;
  latest: LatestData | null;
  loadError: boolean;
  reload: () => void;
  favorites: string[];
  toggleFavorite: (code: string) => void;
  myPref: string | null;
  detectMyPref: () => Promise<void>;
  locationDenied: boolean;
};

const AppContext = createContext<AppState | null>(null);

const FAVORITES_KEY = "favorites:v1";
const MYPREF_KEY = "myPref:v1";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [fuel, setFuel] = useState<FuelType>("regular");
  const [latest, setLatest] = useState<LatestData | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [myPref, setMyPref] = useState<string | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);

  const reload = useCallback(() => {
    setLoadError(false);
    fetchLatest()
      .then(setLatest)
      .catch(() => setLoadError(true));
  }, []);

  useEffect(() => {
    reload();
    AsyncStorage.getItem(FAVORITES_KEY).then((v) => v && setFavorites(JSON.parse(v)));
    AsyncStorage.getItem(MYPREF_KEY).then((v) => v && setMyPref(v));
  }, [reload]);

  const toggleFavorite = useCallback((code: string) => {
    setFavorites((prev) => {
      const next = prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code];
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const detectMyPref = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLocationDenied(true);
      return;
    }
    setLocationDenied(false);
    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const { latitude, longitude } = pos.coords;
    let code: string | null = null;
    try {
      const places = await Location.reverseGeocodeAsync({ latitude, longitude });
      code = regionToCode(places[0]?.region);
    } catch {
      // reverse geocode不可の環境では最寄り県庁で近似する
    }
    if (!code) code = nearestPrefecture(latitude, longitude).code;
    setMyPref(code);
    AsyncStorage.setItem(MYPREF_KEY, code).catch(() => {});
  }, []);

  const value = useMemo(
    () => ({
      fuel,
      setFuel,
      latest,
      loadError,
      reload,
      favorites,
      toggleFavorite,
      myPref,
      detectMyPref,
      locationDenied,
    }),
    [fuel, latest, loadError, reload, favorites, toggleFavorite, myPref, detectMyPref, locationDenied],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

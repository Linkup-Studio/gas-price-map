#!/usr/bin/env python3
"""最新の時系列Excel(s5.xlsx)を取得して標準出力にパスを返す。

取得戦略（上から順に試行）:
  1. METIの結果ページを直接取得し、s5.xlsxリンクを抽出してダウンロード
  2. 直近45日分の日付でファイルURLを直接プローブ
  3. Wayback Machine（CDX API）に退避されたスナップショットから取得

METIサイトはネットワークによって応答しないことがあるため多段フォールバックにしている。
"""
from __future__ import annotations

import datetime as dt
import re
import sys
import urllib.request
from pathlib import Path

BASE = "https://www.enecho.meti.go.jp/statistics/petroleum_and_lpgas/pl007"
RESULTS_URL = f"{BASE}/results.html"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
OUT = Path(__file__).resolve().parent.parent / "data" / "s5_latest.xlsx"
TIMEOUT = 30


def http_get(url: str, timeout: int = TIMEOUT) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as res:
        return res.read()


def is_xlsx(data: bytes) -> bool:
    return data[:2] == b"PK" and len(data) > 50_000


def save(data: bytes, note: str) -> None:
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_bytes(data)
    print(f"fetched via {note}: {len(data)} bytes", file=sys.stderr)
    print(OUT)


def meti_reachable() -> bool:
    """METIサイト自体に到達できるか（ネットワークによっては全断のため先に確認）。"""
    try:
        http_get(f"{BASE}/index.html", timeout=10)
        return True
    except Exception as e:
        print(f"METI unreachable, skip direct strategies: {e}", file=sys.stderr)
        return False


def try_results_page() -> bool:
    try:
        html = http_get(RESULTS_URL).decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"results page failed: {e}", file=sys.stderr)
        return False
    m = re.findall(r'href="[^"]*xlsx/(\d{6}s5\.xlsx)"', html)
    if not m:
        return False
    name = sorted(m)[-1]
    try:
        data = http_get(f"{BASE}/xlsx/{name}")
    except Exception as e:
        print(f"xlsx download failed: {e}", file=sys.stderr)
        return False
    if is_xlsx(data):
        save(data, f"results page ({name})")
        return True
    return False


def try_probe() -> bool:
    today = dt.date.today()
    for delta in range(45):
        d = today - dt.timedelta(days=delta)
        if d.weekday() >= 5:  # 土日は公表なし
            continue
        name = f"{d:%y%m%d}s5.xlsx"
        try:
            data = http_get(f"{BASE}/xlsx/{name}", timeout=15)
        except Exception:
            continue
        if is_xlsx(data):
            save(data, f"probe ({name})")
            return True
    return False


def try_wayback() -> bool:
    cdx = (
        "http://web.archive.org/cdx/search/cdx"
        "?url=enecho.meti.go.jp/statistics/petroleum_and_lpgas/pl007/xlsx/*"
        "&output=text&fl=timestamp,original,statuscode&filter=statuscode:200"
        "&collapse=urlkey&limit=500"
    )
    try:
        lines = http_get(cdx, timeout=60).decode().strip().splitlines()
    except Exception as e:
        print(f"wayback cdx failed: {e}", file=sys.stderr)
        return False
    s5 = [ln.split() for ln in lines if "s5.xlsx" in ln]
    if not s5:
        return False
    # ファイル名の日付（yymmdd）が最新のものを選ぶ
    s5.sort(key=lambda row: row[1].rsplit("/", 1)[-1])
    timestamp, original = s5[-1][0], s5[-1][1]
    try:
        data = http_get(f"https://web.archive.org/web/{timestamp}id_/{original}", timeout=120)
    except Exception as e:
        print(f"wayback download failed: {e}", file=sys.stderr)
        return False
    if is_xlsx(data):
        save(data, f"wayback ({original.rsplit('/', 1)[-1]} @{timestamp})")
        return True
    return False


if __name__ == "__main__":
    strategies = (try_results_page, try_probe, try_wayback) if meti_reachable() else (try_wayback,)
    for strategy in strategies:
        if strategy():
            sys.exit(0)
    print("ERROR: all fetch strategies failed", file=sys.stderr)
    sys.exit(1)

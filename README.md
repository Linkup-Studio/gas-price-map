# ガソリン価格マップ (gas-price-map)

全国の都道府県別ガソリン価格（レギュラー／ハイオク／軽油／灯油）を地図・ランキング・推移グラフで見られるiOSアプリ。

## データソース

資源エネルギー庁「石油製品小売市況調査」（週次・都道府県別）
https://www.enecho.meti.go.jp/statistics/petroleum_and_lpgas/pl007/

GitHub Actionsが毎週水曜にExcelを取得し、`data/` 配下のJSONを更新する。
アプリはこのJSONを直接読む（バックエンドサーバーなし）。

## 構成

```
scripts/fetch_latest.py   最新の時系列Excel(s5.xlsx)を取得（METI直接→URLプローブ→Wayback の3段フォールバック）
scripts/build_data.py     Excel → JSON 変換
data/latest.json          最新週＋前週の全国・都道府県別価格
data/history/national.json  全国平均の全履歴（1990年〜）
data/history/{NN}.json    都道府県別の全履歴（2004年〜、NN=01..47）
app/                      Expoアプリ（iOS）
.github/workflows/update-data.yml  週次自動更新
```

## ローカル実行

```bash
pip install openpyxl
python scripts/fetch_latest.py
python scripts/build_data.py data/s5_latest.xlsx
```

## ライセンス・出典

価格データの出典: 資源エネルギー庁「石油製品小売市況調査」

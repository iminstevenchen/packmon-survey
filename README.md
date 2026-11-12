# packmon-survey

Packmon 的網頁部分（靜態檔，用 GitHub Pages 發布）。App 本體是 SwiftUI iOS，程式碼在私有 repo。

```
index.html        介紹頁
survey/           客戶調查問卷（PWA，可加入主畫面）
  index.html
  manifest.json
  sw.js           離線快取；改了問卷就把 CACHE 版本號 +1
  icons/
```

## 線上網址

- 介紹頁：https://iminstevenchen.github.io/packmon-survey/
- 問卷：https://iminstevenchen.github.io/packmon-survey/survey/

## 發布（已完成）

GitHub Pages：Settings → Pages → `main`、`/ (root)`。推上 `main` 後約一分鐘更新。

## 回覆收集

問卷答案經 Google Apps Script 網頁應用程式寫進 Google 試算表「Packmon 問卷回覆」，每人一列。
`survey/index.html` 的 `SHEET_URL` 已填入部署網址。改了 Apps Script 要用「部署 → 管理部署作業 → 編輯 → 新版本」才會生效，網址不變。

## 更新問卷

改完 `survey/index.html` 後，把 `survey/sw.js` 的 `CACHE` 版本號 +1，再推上 `main`，使用者下次開啟就會拿到新版。

## 注意

- Apps Script 網址會寫在公開的 HTML 裡，不要另外到處貼。
- 問卷不收姓名與聯絡方式；等候名單 Email 請另開頁面，並單獨勾選同意。

# packmon-web

Packmon 的網頁部分（靜態檔，用 GitHub Pages 發布）。App 本體是 SwiftUI iOS，程式碼在私有 repo。

```
index.html        介紹頁
survey/           客戶調查問卷（PWA，可加入主畫面）
  index.html
  manifest.json
  sw.js           離線快取；改了問卷就把 CACHE 版本號 +1
  icons/
```

## 發布

1. 在 GitHub 建立公開 repo `packmon-web`，把這個資料夾內容推上去（根目錄要有 `.nojekyll`）。
2. Settings → Pages → Source 選 `main`、`/ (root)`。
3. 問卷網址：`https://iminstevenchen.github.io/packmon-web/survey/`

## 接上 Google 試算表

1. 在「Packmon 問卷回覆」試算表，擴充功能 → Apps Script，貼上 `doPost`，部署為網頁應用程式（執行身分：我，存取權：所有人）。
2. 把部署後的 `https://script.google.com/macros/s/.../exec` 填進 `survey/index.html` 的 `var SHEET_URL='';`。
3. 重新推上 GitHub，填一次問卷，確認試算表多一列。

## 注意

- Apps Script 網址會寫在公開的 HTML 裡，不要另外到處貼。
- 問卷不收姓名與聯絡方式；等候名單 Email 請另開頁面，並單獨勾選同意。

/**
 * Packmon 問卷 → Google Sheet
 * 使用方式：貼進試算表的 擴充功能 → Apps Script，先執行一次 setup()，
 * 再「部署 → 管理部署作業 → 編輯 → 新版本」，網址不變。
 * 資料寫入「回覆v2」，舊的「回覆」分頁不動；「摘要」分頁用公式自動更新。
 */
var DATA = '回覆v2', DASH = '摘要';
var HEAD = ['時間','暱稱','真實/測試','語言','類型','性別','年齡層','一年出國次數','旅程長短','身分','MBTI',
  '最困擾','想要的功能','顧慮','先選哪個','自認','付費意願','下一趟時間',
  '出發前準備','忘東西頻率','規定確定感','計畫程度','需要提醒','付費意願(程度)','開放回饋'];
var SPEC = ['sp_time','sp_forget','sp_customs','sp_plan','sp_remind','sp_pay'];

function sheet_(name) {
  var ss = SpreadsheetApp.getActive();
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function setup() {
  var sh = sheet_(DATA);
  sh.getRange(1, 1, 1, HEAD.length).setValues([HEAD]).setFontWeight('bold').setBackground('#c4704f').setFontColor('#ffffff');
  sh.setFrozenRows(1);
  buildDashboard();
}

function doPost(e) {
  var d = JSON.parse(e.postData.contents), a = d.answers || {};
  var sh = sheet_(DATA);
  if (sh.getLastRow() === 0) setup();
  var nick = d.nick || a.nick || '';
  var test = /^(test|測試|demo)/i.test(nick) ? '測試' : '真實';
  var row = [new Date(d.at || Date.now()), nick, test, a.lang || '', d.type || '',
    d.gender || a.gender || '', d.age || a.age || '', d.freq || a.freq || '', d.trip || a.trip || '', d.role || a.role || '', d.mbti || a.mbti || '',
    d.pains || '', d.wants || '', d.blocks || '', d.pick || '', d.jp || '', d.pay || '', d.soon || ''];
  SPEC.forEach(function (k) { row.push(a[k] === undefined ? '' : a[k]); });
  row.push(d.note || a.note || '');
  sh.appendRow(row);
  return ContentService.createTextOutput('ok');
}

/** 摘要分頁：只算「真實」回覆，公式會自動更新 */
function buildDashboard() {
  var sh = sheet_(DASH);
  sh.clear(); sh.getCharts().forEach(function (c) { sh.removeChart(c); });
  var R = "'" + DATA + "'!";
  sh.getRange('A1').setValue('Packmon 問卷摘要（不含測試）').setFontSize(16).setFontWeight('bold');
  sh.getRange('A2').setValue('回覆數'); sh.getRange('B2').setFormula('=COUNTIF(' + R + 'C:C,"真實")');
  sh.getRange('D2').setValue('測試數'); sh.getRange('E2').setFormula('=COUNTIF(' + R + 'C:C,"測試")');
  var blocks = [['類型','E'],['性別','F'],['年齡層','G'],['一年出國次數','H'],['旅程長短','I'],['身分','J'],['語言','D']];
  blocks.forEach(function (b, i) {
    var col = 1 + (i % 4) * 3, row = 4 + Math.floor(i / 4) * 9;
    sh.getRange(row, col).setFormula('=IFERROR(QUERY(' + R + 'A:Y,"select ' + b[1] + ',count(' + b[1] + ') where C=\'真實\' and ' + b[1] + '<>\'\' group by ' + b[1] + ' label count(' + b[1] + ') \'人數\'",1),{"' + b[0] + '","人數"})');
    sh.getRange(row, col).setFontWeight('bold');
    sh.insertChart(sh.newChart().setChartType(Charts.ChartType.BAR).addRange(sh.getRange(row, col, 7, 2))
      .setOption('title', b[0]).setOption('legend', {position: 'none'}).setPosition(row + 18, col, 0, 0).setNumHeaders(1).build());
  });
  var r0 = 40;
  sh.getRange(r0, 1).setValue('程度題平均（0–100）').setFontWeight('bold');
  ['出發前準備','忘東西頻率','規定確定感','計畫程度','需要提醒','付費意願'].forEach(function (n, i) {
    var c = String.fromCharCode(83 + i);
    sh.getRange(r0 + 1 + i, 1).setValue(n);
    sh.getRange(r0 + 1 + i, 2).setFormula('=IFERROR(ROUND(AVERAGEIFS(' + R + c + ':' + c + ',' + R + 'C:C,"真實")),"")');
  });
  sh.insertChart(sh.newChart().setChartType(Charts.ChartType.BAR).addRange(sh.getRange(r0 + 1, 1, 6, 2))
    .setOption('title', '程度題平均').setOption('legend', {position: 'none'}).setOption('hAxis', {viewWindow: {min: 0, max: 100}})
    .setPosition(r0, 4, 0, 0).build());
  sh.getRange(r0 + 8, 1).setValue('開放回饋（最新 20 則）').setFontWeight('bold');
  sh.getRange(r0 + 9, 1).setFormula('=IFERROR(QUERY(' + R + 'A:Y,"select A,B,Y where C=\'真實\' and Y<>\'\' order by A desc limit 20 label A \'時間\',B \'暱稱\',Y \'回饋\'",1),"尚無回饋")');
  sh.setColumnWidths(1, 12, 110);
}

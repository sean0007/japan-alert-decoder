import assert from "node:assert/strict";
import test from "node:test";
import { ALERTS, ALERT_IDS, LEGACY, decodeAlert, extractShindo, extractTsunamiHeight, getAlert, rules } from "./alerts";

const d = (text: string, extra: Record<string, string> = {}) => decodeAlert({ text, ...extra });

test("ids are unique, every alert has sources, meaning and actions", () => {
  assert.equal(new Set(ALERT_IDS).size, ALERT_IDS.length);
  for (const a of ALERTS) {
    assert.ok(a.sources.length, a.id);
    assert.ok(a.meaning.length > 20, a.id);
    assert.ok(a.doNow.length, a.id);
  }
  for (const l of LEGACY) for (const id of l.replacedBy) assert.ok(getAlert(id), `${l.nameJa} → ${id}`);
});

test("16 level-named weather warnings use JMA's official English and dictionary names", () => {
  const lv = ALERTS.filter((a) => a.family === "weather-level" && a.level && a.level >= 2);
  assert.equal(lv.length, 16);
  for (const a of lv) {
    assert.match(a.nameEn, /^Level [2-5] (Emergency Warning|Urgent Warning|Warning|Advisory) \((Heavy Rain|Landslide|Flood|Storm Surge)\)$/);
    assert.ok(a.dictJa, `${a.id} has a JMA dictionary entry`);
  }
  assert.equal(getAlert("l4-landslide")!.nameJa, "レベル4土砂災害危険警報");
  assert.equal(getAlert("l4-landslide")!.color, "purple");
});

test("EEW text → act now, train-specific action first", () => {
  const r = d("緊急地震速報 千葉県北西部で地震 強い揺れに備えてください（気象庁）", { situation: "train" });
  assert.equal(r.primary?.id, "eew-warning");
  assert.equal(r.urgency, "act_now");
  assert.match(r.primary!.doNow[0], /strap|handrail/);
});

test("EEW cancellation wins over the warning", () => {
  const r = d("緊急地震速報 先ほど発表した緊急地震速報を取り消します");
  assert.equal(r.primary?.id, "eew-cancel");
  assert.equal(r.urgency, "info");
  assert.equal(r.modifiers.cancelled, true);
  assert.ok(!r.also.some((a) => a.id === "eew-warning"));
  assert.equal(d("JMA has cancelled the EEW.").primary?.id, "eew-cancel");
});

test("tsunami: major warning beats advisory; height extracted; lifted", () => {
  const r = d("大津波警報・津波警報・津波注意報を発表しています 予想される津波の高さ 10m超");
  assert.equal(r.primary?.id, "major-tsunami-warning");
  assert.equal(r.extracted.tsunamiHeight, "over 10 m");
  assert.ok(r.also.some((a) => a.id === "tsunami-advisory"));
  const lifted = d("津波警報を解除しました");
  assert.equal(lifted.modifiers.lifted, true);
  assert.equal(lifted.urgency, "info");
  assert.equal(extractTsunamiHeight("津波注意報 高いところで1m"), "1 m");
});

test("old names map to the 2026-05-29 names", () => {
  assert.equal(d("鹿児島県 土砂災害警戒情報").primary?.id, "l4-landslide");
  assert.equal(d("大雨警報（土砂災害）").primary?.id, "l3-landslide");
  assert.equal(d("大雨警報(浸水害)").primary?.id, "l3-heavy-rain");
  const flood = d("洪水警報");
  assert.equal(flood.primary?.id, "l3-heavy-rain");
  assert.ok(flood.also.some((a) => a.id === "l3-flood"));
  assert.match(flood.notes.join(" "), /no longer issued/);
  assert.equal(d("Landslide Alert Information").primary?.id, "l4-landslide");
});

test("plain 高潮警報 is ambiguous: Level 4 first (old meaning), Level 3 also; a level number decides", () => {
  const r = d("高潮警報");
  assert.equal(r.primary?.id, "l4-storm-surge");
  assert.ok(r.also.some((a) => a.id === "l3-storm-surge"));
  assert.equal(d("レベル３高潮警報").primary?.id, "l3-storm-surge");
  assert.equal(d("レベル4高潮危険警報").primary?.id, "l4-storm-surge");
});

test("new names, full-width digits, English and informal phrasing", () => {
  const r = d("【警戒レベル４相当】レベル４土砂災害危険警報　横浜市", { lang: "vi" });
  assert.equal(r.primary?.id, "l4-landslide");
  assert.equal(r.extracted.level, 4);
  assert.match(r.primary!.nameLocal!, /cấp độ 4/);
  assert.ok(!r.also.some((a) => a.id === "evac-l4"), "相当 is not a municipal evacuation order");
  assert.equal(d("Level 5 Emergency Warning (Heavy Rain)").primary?.id, "l5-heavy-rain");
  assert.equal(d("level 4 landslide warning for Hakone").primary?.id, "l4-landslide");
  assert.match(d("レベル4大雨危険警報").notes.join(" "), /evacuate by Level 4/);
});

test("evacuation info and the bare alert level", () => {
  assert.equal(d("【警戒レベル4】避難指示 発令 ○○地区").primary?.id, "evac-l4");
  assert.equal(d("警戒レベル3").primary?.id, "evac-l3");
  assert.equal(d("避難勧告").primary?.id, "evac-l4");
  assert.equal(d("緊急安全確保").urgency, "act_now");
});

test("Nankai Trough keyword handling", () => {
  assert.equal(d("南海トラフ地震臨時情報（巨大地震注意）").primary?.id, "nankai-megaquake-advisory");
  assert.equal(d("南海トラフ地震臨時情報（巨大地震警戒）").primary?.id, "nankai-megaquake-warning");
  assert.equal(d("南海トラフ地震臨時情報").primary?.id, "nankai-investigating");
  assert.equal(d("南海トラフ地震臨時情報（調査終了）").primary?.id, "nankai-investigation-ended");
  assert.equal(d("北海道・三陸沖後発地震注意情報").primary?.id, "hokkaido-sanriku-advisory");
});

test("shindo extraction and the shindo report", () => {
  assert.equal(extractShindo("震度５強"), "5+");
  assert.equal(extractShindo("震度6弱 震度3"), "6-");
  assert.equal(extractShindo("seismic intensity 5-lower"), "5-");
  assert.equal(extractShindo("Shindo 7"), "7");
  const r = d("震度5強 東京都23区 この地震による津波の心配はありません");
  assert.equal(r.primary?.id, "shindo-report");
  assert.match(r.headline, /5-upper/);
  assert.ok(r.also.some((a) => a.id === "no-tsunami"));
});

test("missile, volcano, heat, bulletins, other warnings", () => {
  assert.equal(d("Missile launch. Missile launch. A missile appears to have been launched. Take shelter in a sturdy building or underground.").primary?.id, "missile");
  assert.equal(d("ミサイル発射。ミサイル発射。").urgency, "act_now");
  assert.equal(d("桜島 噴火警戒レベル3").primary?.id, "volcano-l3");
  assert.equal(d("熱中症警戒アラート").primary?.id, "heat-alert");
  assert.equal(d("千葉県気象防災速報（線状降水帯発生） 第１号").primary?.id, "bulletin-linear-rainband");
  assert.equal(d("顕著な大雨に関する気象情報").primary?.id, "bulletin-linear-rainband");
  assert.equal(d("竜巻注意情報").primary?.id, "bulletin-tornado");
  const thunder = d("雷注意報");
  assert.equal(thunder.primary?.id, "thunderstorm-advisory");
  assert.equal(thunder.primary?.level, null);
});

test("drill and unknown text", () => {
  const r = d("これは訓練です。緊急地震速報。");
  assert.equal(r.modifiers.drill, true);
  assert.equal(r.urgency, "info");
  assert.match(r.headline, /^\[Drill\]/);
  const u = d("hello world");
  assert.equal(u.verdict, "not_recognized");
  assert.equal(u.primary, null);
});

test("alert id + lang", () => {
  const r = decodeAlert({ alert: "l3-landslide", lang: "ko" });
  assert.equal(r.primary?.nameLocal, "레벨 3 토사 재해 경보");
  assert.equal(decodeAlert({ alert: "津波注意報" }).primary?.id, "tsunami-advisory");
  assert.throws(() => decodeAlert({ alert: "volcano-l9" }));
  assert.throws(() => decodeAlert({ text: "津波警報", lang: "xx" }));
  assert.throws(() => decodeAlert({ text: "津波警報", situation: "moon" }));
  assert.throws(() => decodeAlert({}));
});

test("rules() has tables, sources and as-of date", () => {
  const r = rules();
  assert.equal(r.dataAsOf, "2026-10-17");
  assert.equal(r.alertLevels.length, 5);
  assert.equal(r.shindo.length, 10);
  assert.ok(r.renamed.length >= 15);
  assert.ok(r.sources.every((s) => s.startsWith("https://")));
});

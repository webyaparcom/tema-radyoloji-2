/* radyoloji-tetkik-rehberi — Radyoloji Tetkik Rehberi — tetkik karşılaştırma satırları, açılır hazırlık talimatı (16 Kas 2026 · mcp:webmaker/20261116-181132-t332 · D17).
   Üstte sütun başlıkları (süre · açlık · kontrast · ışın) olan karşılaştırma tablosu; her tetkik bir satır (ikon, ad, süre, açlık, kontrast, 3 çubuklu ışın göstergesi). Satır tıklanınca altında hazırlık talimatı ve uyarı kutusu açılır; aynı anda tek satır açık (`<details name>`, JS gerektirmez). Kayıt alanları: `sure` · `aclik` · `kontrast` · `isin` (0–3) · `uyari`. Dar ekranda satırlar etiketli kartlara dönüşür.
   Üretici: scripts/modul-fabrika (aile module) — elle düzenleme yerine tanımı değiştirip yeniden üret.
   Veri: desing: ust · baslik · metin · img · img2 · cta_ad/cta_url · cta2_ad/cta2_url; data (maddeler): [{ ikon?, baslik, metin?, url? }] — metinler dil sözlüğü. */
const P = "modulex-radyoloji-tetkik-rehberi";
const IMG_KOK = `/img/${json.id}/`;
/* --- ortak ön ek (scripts/modul-fabrika/on-ek.js) — dil · güvenlik · sayı yardımcıları --- */
const pick = (v) => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) { /* alt satır */ } }
  return String(v[json.lang] ?? Object.values(v)[0] ?? "");
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const medyaUrl = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|file):/i.test(s)) return "";
  if (/^data:/i.test(s)) return /^data:(image|video|audio)\//i.test(s) ? s : "";
  if (s.startsWith("/") || /^https?:\/\//i.test(s)) return s;
  return `${IMG_KOK}${s}`;
};
const href = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|data):/i.test(s)) return "";
  if (/^(https?:)?\/\//i.test(s) || /^(mailto:|tel:|#)/i.test(s)) return s;
  return wxLangInternalHref(s);
};
const dogru = (v, d) => (v === undefined || v === null || v === "") ? d : !(v === false || v === "false" || v === 0 || v === "0");
const ikonAd = (v) => String(v ?? "").trim().replace(/[^a-z0-9_]/gi, "");
const satirlar = (s) => esc(s).replace(/\r?\n/g, "<br />");
/* ilk dolu alan: yeni ad önce, eski kuşak şablonun adı yedek (G6 yalnız path değiştirerek takas eder) */
const ilk = (o, ks) => {
  for (const k of ks) {
    const v = o == null ? undefined : o[k];
    if (v == null || v === "") continue;
    if (typeof v === "object" && !Array.isArray(v) && !Object.keys(v).length) continue;
    return v;
  }
  return "";
};
const metinAl = (o, ks) => pick(ilk(o, ks)).trim();
const { desing: des = {} } = json;
const setting = webmakerdata?.setting ?? {};
const veri = Array.isArray(json.data) ? json.data : [];
const dil = String(json.lang || "");
const sayiBicim = (v, ondalik) => {
  try { return new Intl.NumberFormat(dil || undefined, { minimumFractionDigits: ondalik, maximumFractionDigits: ondalik }).format(v); } catch (e) { return String(v); }
};
const ikonH = (ad, sinif) => (ad ? `<span class="${sinif} material-symbols-outlined" aria-hidden="true">${ad}</span>` : "");
const no = (i) => String(i + 1).padStart(2, "0");
const ctaHtml = () => {
  const a1 = metinAl(des, ["cta_ad", "button"]); const u1 = href(ilk(des, ["cta_url", "buttonurl", "url"]));
  const a2 = metinAl(des, ["cta2_ad"]); const u2 = href(ilk(des, ["cta2_url"]));
  const d = (a, u, ek) => (a && u ? `<a class="${P}-dugme${ek}" href="${esc(u)}">${esc(a)}<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>` : "");
  const ic = d(a1, u1, "") + d(a2, u2, ` ${P}-dugme--ikincil`);
  return ic ? `<div class="${P}-cta">${ic}</div>` : "";
};
const basHtml = (B, ek) => {
  if (!B.ust && !B.baslik && !B.metin && !ek) return "";
  return `<header class="${P}-bas">`
    + (B.ust ? `<p class="${P}-ust">${esc(B.ust)}</p>` : "")
    + (B.baslik ? `<h2 class="${P}-baslik" id="${P}-{{id}}-b">${esc(B.baslik)}</h2>` : "")
    + (B.metin ? `<p class="${P}-metin">${satirlar(B.metin)}</p>` : "")
    + (ek || "")
    + "</header>";
};
/* --- aile: module --- */
const yeniMadde = veri.map((o) => ({
  ikon: ikonAd(ilk(o, ["ikon", "icon"])), baslik: metinAl(o, ["baslik", "name", "title"]),
  metin: metinAl(o, ["metin", "text", "description", "spot"]), url: href(ilk(o, ["url", "link"])),
})).filter((k) => k.baslik);
/* module-1 eski şeması: name2/spot2/icon2 … name4 → madde */
const eskiMadde = [2, 3, 4].map((n) => ({ ikon: ikonAd(des["icon" + n]), baslik: metinAl(des, ["name" + n]), metin: metinAl(des, ["spot" + n]), url: "" })).filter((k) => k.baslik);
const kayitlar = yeniMadde.length ? yeniMadde : eskiMadde;
const G1 = medyaUrl(ilk(des, ["img", "image"]));
const G2 = medyaUrl(ilk(des, ["img2", "image2"]));
const gH = (src, s, w, h) => (src ? `<img class="${P}-${s}" src="${esc(src)}" alt="" width="${w || 1200}" height="${h || 900}" loading="lazy" decoding="async" />` : "");
const ustH = (B) => (B.ust ? `<p class="${P}-ust">${esc(B.ust)}</p>` : "");
const basH = (B) => (B.baslik ? `<h2 class="${P}-baslik" id="${P}-{{id}}-b">${esc(B.baslik)}</h2>` : "");
const metH = (B) => (B.metin ? `<p class="${P}-metin">${satirlar(B.metin)}</p>` : "");
const listeH = (ic) => (ic ? `<ul class="${P}-maddeler" role="list">${ic}</ul>` : "");
const maddeVar = (k, i) => `<li class="${P}-madde">${ikonH(k.ikon || "check_circle", `${P}-mikon`)}<div class="${P}-myazi"><h3 class="${P}-mbaslik">${k.url ? `<a class="${P}-bag" href="${esc(k.url)}">${esc(k.baslik)}</a>` : esc(k.baslik)}</h3>${k.metin ? `<p class="${P}-mmetin">${satirlar(k.metin)}</p>` : ""}</div></li>`;
/* --- modül: radyoloji-tetkik-rehberi --- */
const kart = () => "";
const sar = (ic, A, B) => {
    const R = yeniMadde.length ? veri.filter((o) => metinAl(o, ["baslik", "name", "title"])) : [];
    const x = (i, ks) => metinAl(R[i] || {}, ks);
    const ET = { s: metinAl(des, ["sureAd"]), a: metinAl(des, ["aclikAd"]), k: metinAl(des, ["kontrastAd"]), i: metinAl(des, ["isinAd"]) };
    const YK = metinAl(des, ["yokAd"]);
    const HZ = metinAl(des, ["hazirlikAd"]);
    const isinVar = !!ET.i && A.some((k, i) => x(i, ["isin", "radiation"]) !== "");
    /* sayı aralığı (30–45) RTL'de ters dönmesin */
    const ara = (t) => esc(t).replace(/\d+(?:[.,]\d+)?\s*[–-]\s*\d+(?:[.,]\d+)?/g, (m) => `<bdi dir="ltr">${m}</bdi>`);
    const hucre = (et, v) => `<span class="${P}-hc${v ? "" : ` ${P}-hc--bos`}"${et ? ` data-et="${esc(et)}"` : ""}><bdi>${ara(v || YK || "—")}</bdi></span>`;
    const isin = (i) => {
      const n = Number(x(i, ["isin", "radiation"]));
      if (x(i, ["isin", "radiation"]) === "" || !Number.isFinite(n)) return `<span class="${P}-hc ${P}-hc--bos" data-et="${esc(ET.i)}">—</span>`;
      const d = Math.max(0, Math.min(3, Math.round(n)));
      return `<span class="${P}-hc" data-et="${esc(ET.i)}"><span class="${P}-isin" role="img" aria-label="${esc(ET.i)} ${d}/3">${[0, 1, 2].map((j) => `<i class="${P}-ibar${j < d ? ` ${P}-ibar--dolu` : ""}"></i>`).join("")}</span></span>`;
    };
    const satir = (k, i) => {
      const uy = x(i, ["uyari", "warning"]);
      const govde = k.metin || uy;
      return `<details class="${P}-tetkik" name="${P}-{{id}}"${govde ? "" : " data-bos"}><summary class="${P}-satir"><span class="${P}-tad">${ikonH(k.ikon, `${P}-tikon`)}<strong class="${P}-tisim">${esc(k.baslik)}</strong></span>${hucre(ET.s, x(i, ["sure", "duration"]))}${hucre(ET.a, x(i, ["aclik", "fasting"]))}${hucre(ET.k, x(i, ["kontrast", "contrast"]))}${isinVar ? isin(i) : ""}<span class="${P}-ok material-symbols-outlined" aria-hidden="true">expand_more</span></summary>${govde ? `<div class="${P}-hazirlik">${HZ ? `<p class="${P}-hbas">${ikonH("checklist", `${P}-hik`)}${esc(HZ)}</p>` : ""}${k.metin ? `<p class="${P}-hmetin">${satirlar(k.metin)}</p>` : ""}${uy ? `<p class="${P}-uyari">${ikonH("warning", `${P}-uik`)}<span>${esc(uy)}</span></p>` : ""}${k.url ? `<a class="${P}-hbag" href="${esc(k.url)}">@read-more@<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>` : ""}</div>` : ""}</details>`;
    };
    const bas = `<div class="${P}-thead" aria-hidden="true"><span>${esc(metinAl(des, ["tetkikAd"]))}</span><span>${esc(ET.s)}</span><span>${esc(ET.a)}</span><span>${esc(ET.k)}</span>${isinVar ? `<span>${esc(ET.i)}</span>` : ""}<span></span></div>`;
    return `<div class="${P}-giris">${ustH(B)}${basH(B)}${metH(B)}</div><div class="${P}-rehber${isinVar ? "" : ` ${P}-rehber--3`}">${bas}${A.map(satir).join("")}</div>${ctaHtml()}`;
  };
const B = { ust: metinAl(des, ["ust","title","badge"]), baslik: metinAl(des, ["baslik","name"]), metin: metinAl(des, ["metin","description"]) };
/* veri yoksa gövde hiç kurulmaz (sarmalayıcı boş listeye dokunmaz) */
const BOS = !B.baslik && !B.metin;
const govde = BOS ? "" : sar(kayitlar.map((k, i) => kart(k, i, kayitlar.length, kayitlar)).join(""), kayitlar, B);
const bas = "";
const sinif = (bas || B.ust || B.baslik || B.metin ? "" : ` ${P}--bassiz`);
html = html
  .replaceAll("{{fbsinif}}", () => sinif)
  .replaceAll("{{fbetiket}}", () => (B.baslik ? `aria-labelledby="${P}-{{id}}-b"` : ""))
  .replaceAll("{{fbbas}}", () => bas)
  .replaceAll("{{fbgovde}}", () => govde);
if (BOS) html = "";

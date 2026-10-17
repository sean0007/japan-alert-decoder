import { ImageResponse } from "next/og";
import { EXAMPLE_SHARED, COLOR_HEX, parseShared, sharedResult } from "@/lib/share";
import { SITUATION_LABEL } from "@/lib/alerts";

// English only: the default OG font has no Japanese glyphs.
export async function GET(req: Request) {
  const shared = parseShared(new URL(req.url).searchParams) ?? EXAMPLE_SHARED;
  const r = sharedResult(shared);
  const p = r.primary!;
  const badge = p.level ? `${p.levelKind === "volcanic-alert-level" ? "Volcanic alert level" : "Alert level"} ${p.level}${p.color ? ` · ${p.color}` : ""}` : (r.urgencyLabel ?? "");
  const bg = p.color ? COLOR_HEX[p.color] : "#334155";
  const fg = p.color && ["black", "purple", "red"].includes(p.color) ? "#ffffff" : p.color ? "#000000" : "#ffffff";
  const actions = p.doNow.slice(0, 2);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#07080c", color: "#f3efe4", padding: "52px 64px", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: "0.24em", textTransform: "uppercase", color: "#f0b429" }}>Japan alert decoder</div>
          <div style={{ display: "flex", fontSize: 22, color: "#9b9588" }}>official rules as of {r.dataAsOf}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", fontSize: 26, fontWeight: 700, padding: "6px 18px", borderRadius: 999, background: bg, color: fg, border: p.color === "black" ? "2px solid #666" : "none" }}>{badge}</div>
          </div>
          <div style={{ display: "flex", marginTop: 18, fontSize: p.nameEn.length > 48 ? 50 : 64, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.08, maxWidth: 1070 }}>{p.nameEn}</div>
          {shared.situation ? <div style={{ display: "flex", marginTop: 10, fontSize: 26, color: "#9b9588" }}>{SITUATION_LABEL[shared.situation]}</div> : null}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, border: "2px solid #23252c", borderRadius: 24, padding: "18px 24px", background: "#101218" }}>
          {actions.map((a) => (
            <div key={a} style={{ display: "flex", fontSize: 26, lineHeight: 1.3, color: "#f3efe4" }}>
              → {a.length > 110 ? `${a.slice(0, 107)}…` : a}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: "#6f6a60" }}>
          <span>japan-alert-decoder.vercel.app · free, 14 languages</span>
          <span>Not an alert service. Follow official instructions.</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable" } },
  );
}

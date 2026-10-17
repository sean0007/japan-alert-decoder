import { ImageResponse } from "next/og";

export const alt = "Japan Alert Decoder: what does this Japanese emergency alert mean and what do I do?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LEVELS: [string, string, string][] = [
  ["5", "#111111", "Emergency Warning"],
  ["4", "#a855f7", "Urgent Warning"],
  ["3", "#ef4444", "Warning"],
  ["2", "#facc15", "Advisory"],
  ["1", "#e5e7eb", "Early Advisory"],
];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#07080c", color: "#f3efe4", padding: "64px", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
        <div style={{ display: "flex", fontSize: 22, letterSpacing: "0.28em", textTransform: "uppercase", color: "#f0b429" }}>Free · Japan · emergency alerts</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 66, lineHeight: 1.05, letterSpacing: "-0.03em", maxWidth: 1050 }}>What does this Japanese alert mean?</div>
          <div style={{ display: "flex", fontSize: 30, color: "#9b9588", maxWidth: 1050, lineHeight: 1.35 }}>
            Earthquake Early Warning · tsunami · Level 1-5 weather warnings (new since May 29, 2026) · evacuation · J-ALERT
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {LEVELS.map(([n, c, label]) => (
            <div key={n} style={{ display: "flex", flexDirection: "column", flex: 1, borderRadius: 18, padding: "12px 16px", background: c, color: ["5", "4", "3"].includes(n) ? "#fff" : "#000", border: n === "5" ? "2px solid #666" : "none" }}>
              <span style={{ fontSize: 30, fontWeight: 800 }}>Level {n}</span>
              <span style={{ fontSize: 18 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}

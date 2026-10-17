# Japan Alert Decoder

Free decoder for Japanese emergency alerts: paste the alert (Japanese or English) and get what it is, the alert level and colour, what to do now (by situation) and its official name in 14 languages (JMA multilingual dictionary).

Covers the Earthquake Early Warning (緊急地震速報) and its cancellation, shindo, tsunami warnings, the new level-named weather warnings in force since 2026-05-29 (レベル5特別警報 / レベル4危険警報 / レベル3警報 / レベル2注意報 for heavy rain, landslide, flood, storm surge) with the old names they replaced, other weather warnings, 気象防災速報 (線状降水帯), evacuation levels (避難指示 etc.), Nankai Trough information, the Hokkaido-Sanriku advisory, volcanic alert levels, J-ALERT missile alerts and heat alerts.

- Site: https://japan-alert-decoder.vercel.app
- API: `GET /api/decode?text=レベル4土砂災害危険警報&lang=vi` (also POST JSON), `GET /api/rules`
- Docs: `/openapi.json`, `/llms.txt`, `/.well-known/ai-plugin.json`
- MCP: `japan_emergency_alert_decode` on https://free-agent-tools.vercel.app/mcp

Data as of 2026-10-17 from official JMA, Cabinet Office, Cabinet Secretariat and Ministry of the Environment pages (listed in `/api/rules`). `scripts/build-names.py` regenerates `lib/alert-names.ts` from the JMA multilingual dictionary xlsx.

Educational guide, not an alert service: no live data. Always follow official instructions.

```
npm install
npm test
npm run build
```

MIT licence.

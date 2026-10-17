import { openapiDoc, preflight, staticJson } from "@/lib/agent-api";
import { API_INFO, ENDPOINTS, PUBLIC_URL } from "@/lib/api";

export function GET() {
  const base = openapiDoc(API_INFO, PUBLIC_URL, Object.values(ENDPOINTS)) as {
    paths: Record<string, unknown>;
    [k: string]: unknown;
  };
  base.paths["/api/rules"] = {
    get: {
      operationId: "japanAlertRules",
      summary: "Every alert type with level, colour, meaning, actions, official names in 14 languages, old→new names, shindo and tsunami tables, sources",
      description: "Returns all decodable Japanese alert types (earthquake, tsunami, megaquake advisories, level-named weather warnings since 2026-05-29, other weather warnings, 気象防災速報, evacuation levels, volcano, J-ALERT, heat) with ids, Japanese and English names, official names from the JMA multilingual dictionary, alert level, colour, urgency, issuer, meaning, actions and sources; plus the alert-level table, renamed old names, the shindo scale, tsunami categories, EEW criteria, situations, languages and official live-data links. No inputs.",
      responses: {
        "200": {
          description: "Rules JSON with dataAsOf and sources.",
          content: { "application/json": { schema: { type: "object", additionalProperties: true } } },
        },
      },
    },
  };
  return staticJson(base);
}
export const OPTIONS = preflight;

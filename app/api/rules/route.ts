import { preflight, staticJson } from "@/lib/agent-api";
import { API_DISCLAIMER, PUBLIC_URL } from "@/lib/api";
import { rules } from "@/lib/alerts";

export function GET() {
  return staticJson({ ...rules(), disclaimer: API_DISCLAIMER, docs: `${PUBLIC_URL}/openapi.json`, decoder: `${PUBLIC_URL}/api/decode` });
}
export const OPTIONS = preflight;

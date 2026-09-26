import { jsonrepair } from "jsonrepair";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const MODEL_NAME = process.env.MODEL_NAME || "qwen2.5:7b";

const SYSTEM_PROMPT = `You are FieldLog, a structured extraction assistant for emergency responders in harsh field environments.

You receive messy, code-switched, phonetically-spelled input that may mix languages. Extract structured fields and produce a clean English summary.

You have two jobs:

JOB 1 — Record facts:
- symptoms: what the person is experiencing, translated to clinical meaning (chakkar = dizziness)
- vitals: any measurements mentioned
- medications_given: drugs explicitly administered in the input
- followup: next steps mentioned in the input
- summary_en: one to three clean English sentences describing only what was stated. Do NOT include suggestions in the summary.

JOB 2 — Flag a possible medication for supervisor review:
- suggested_medication: if the symptoms suggest a common over-the-counter or field-standard medication might help (e.g. fever -> paracetamol, dehydration -> ORS), name it here. Otherwise empty string.
- suggestion_reason: one short sentence. Otherwise empty string.

The suggestion is NEVER an instruction. It is a flag for a human to review and sign off. The summary and the suggestion must stay separate.

Return ONLY valid JSON matching the schema.`;

const SCHEMA = {
  type: "object",
  properties: {
    symptoms: { type: "array", items: { type: "string" } },
    vitals: { type: "array", items: { type: "string" } },
    medications_given: { type: "array", items: { type: "string" } },
    suggested_medication: { type: "string" },
    suggestion_reason: { type: "string" },
    followup: { type: "string" },
    summary_en: { type: "string" }
  },
  required: [
    "symptoms",
    "medications_given",
    "summary_en",
    "suggested_medication",
    "suggestion_reason"
  ]
};

function recoverJson(raw) {
  if (!raw) return null;

  try { return JSON.parse(raw); } catch {}

  const first = raw.indexOf("{");
  const last = raw.lastIndexOf("}");
  const cleaned = first >= 0 && last > first ? raw.slice(first, last + 1) : raw;

  try { return JSON.parse(cleaned); } catch {}

  try { return JSON.parse(jsonrepair(cleaned)); }
  catch (e) {
    console.error("[ollama] All recovery failed:", e.message);
    console.error("[ollama] Raw:", JSON.stringify(raw));
    throw new Error(`JSON recovery failed: ${e.message}`);
  }
}

async function callOllama(text) {
  const started = Date.now();

  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text }
      ],
      format: SCHEMA,
      stream: false,
      options: { temperature: 0.2 }
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Ollama error ${response.status}: ${err}`);
  }

  const rawText = await response.text();
  let data;
  try {
    data = JSON.parse(rawText);
  } catch (e) {
    console.error("[ollama] Ollama HTTP not JSON:", rawText.slice(0, 300));
    throw new Error(`Ollama returned invalid HTTP JSON: ${e.message}`);
  }

  const content = data.message?.content || "{}";
  const parsed = recoverJson(content);

  return {
    parsed,
    duration_ms: Date.now() - started
  };
}

export async function normalizeText(text) {
  try {
    const { parsed, duration_ms } = await callOllama(text);
    return { ...parsed, model: MODEL_NAME, duration_ms };
  } catch (firstError) {
    console.warn("[ollama] First attempt failed, retrying once:", firstError.message);
    try {
      const { parsed, duration_ms } = await callOllama(text);
      return { ...parsed, model: MODEL_NAME, duration_ms };
    } catch (secondError) {
      throw new Error(
        `Extraction failed twice. First: ${firstError.message}. Second: ${secondError.message}`
      );
    }
  }
}

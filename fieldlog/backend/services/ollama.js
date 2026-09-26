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

export async function normalizeText(text) {
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

  const data = await response.json();
  const content = data.message?.content || "{}";

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    throw new Error(`Model returned invalid JSON: ${content}`);
  }

  return {
    ...parsed,
    model: MODEL_NAME,
    duration_ms: Date.now() - started
  };
}

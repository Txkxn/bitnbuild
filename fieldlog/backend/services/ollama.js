const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const MODEL_NAME = process.env.MODEL_NAME || "qwen2.5:7b";

const SYSTEM_PROMPT = `You are FieldLog, a structured extraction assistant for emergency responders, victims, and bystanders in harsh field environments.

You will receive messy, code-switched, phonetically-spelled input that may mix multiple languages (e.g. Hindi-English, Arabic-English, German-English, Spanish-English) in one sentence.

Your job:
1. Extract structured fields from the input.
2. Produce a clean, factual English summary.
3. Do NOT invent information that is not present.
4. If a field is not mentioned, leave it out or return an empty string/array.
5. Preserve numbers exactly (temperatures, dosages, times).
6. Keep the summary under 3 sentences.

Return ONLY valid JSON matching the required schema.`;

const SCHEMA = {
  type: "object",
  properties: {
    symptoms: { type: "array", items: { type: "string" } },
    vitals: { type: "array", items: { type: "string" } },
    medications: { type: "array", items: { type: "string" } },
    followup: { type: "string" },
    summary_en: { type: "string" },
    languages_detected: { type: "array", items: { type: "string" } }
  },
  required: ["symptoms", "medications", "summary_en"]
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
      options: {
        temperature: 0.2
      }
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

# FieldLog

**Offline multilingual field logging for harsh environments.**

FieldLog is an offline-first tool for anyone in a crisis environment — responders, victims, or bystanders — who needs to capture messy, mixed-language input and turn it into a clean, structured record. It runs entirely on a local machine, requires no internet after installation, and is designed for readability under direct sunlight.

Built for **BitNBuild '26 — UAE Regional Qualifying Round**.

---

## The Problem

Emergency responders, first-aid workers, and multinational dispatchers working in harsh environments deal with patients and witnesses who speak in **code-switched, phonetically-spelled, mixed-language phrases** under stress. Existing tools assume:

- Clean, monolingual input
- Correct spelling
- Reliable internet connectivity
- Comfortable, climate-controlled conditions

None of these assumptions hold in the field. Meanwhile, the person closest to the event — the one who actually knows what happened — often has the least access to clean tools.

This project addresses two problem statements:

1. **AI/ML — Code-Switching and Spelling by Ear:** Language tools learn one clean official version of a language, then meet people who switch tongues mid-sentence, spell by ear, and write one language in another's script.
2. **Web Dev — Built for a Quiet Room, Used in the Sun:** Operational web interfaces are built for climate-controlled desktop environments, yet emergency and workplace compliance logging occurs under direct solar glare, extreme heat, and physical exhaustion.

---

## What FieldLog Does

1. Accepts messy typed or dictated input in mixed languages
2. Extracts structured fields (symptoms, medications, follow-up) using a local LLM
3. Produces a clean English summary of the input
4. Flags known field idioms so the responder sees which phrases were recognized
5. Displays everything in a high-contrast, blocky interface designed for sunlight and stress
6. Works fully offline — no cloud APIs, no telemetry, no external fonts

**Example input:**

Mere ko chakkar aa rahe hain, ich bin nicht so gut, gave ORS, come back in 2 hours


**Example output:**
```json
{
  "symptoms": ["dizziness"],
  "medications": ["ORS"],
  "followup": "2 hours",
  "summary_en": "The person is experiencing dizziness and has been given ORS. They are advised to return in 2 hours.",
  "idioms_matched": [
    { "lang": "hi", "phrase": "chakkar aa rahe hain", "meaning": "feeling dizzy / vertigo" },
    { "lang": "de", "phrase": "ich bin nicht so gut", "meaning": "I am unwell / not feeling well" }
  ]
}

┌──────────────────┐
│  React frontend  │  Blocky UI, sunlight mode, log history
└────────┬─────────┘
         │ POST /api/normalize
         ▼
┌──────────────────┐
│ Express backend  │  Extraction orchestration, idiom lookup
└────────┬─────────┘
         │
         ├──► Ollama (localhost:11434, qwen2.5:7b)
         │    Structured JSON extraction via schema enforcement
         │
         └──► Idiom table (data/idioms.json)
              Curated field idioms in Hindi, Arabic, Spanish, German

## Setup

Prerequisites:
- Node.js 18+ (22 recommended)
- Ollama installed (https://ollama.com)
- 16GB RAM recommended

### 1. Install Ollama and pull the model

FieldLog uses a local LLM for offline operation. You must install Ollama on your machine and download the model once. After that, everything runs offline.

    curl -fsSL https://ollama.com/install.sh | sh
    ollama pull qwen2.5:7b

Ollama then runs as a background service on http://localhost:11434.

Low-RAM alternative: if your machine has less than 16GB RAM, use `ollama pull gemma3:4b` instead, and set MODEL_NAME=gemma3:4b in backend/.env.

### 2. Backend

    cd fieldlog/backend
    npm install
    cp .env.example .env
    npm run dev

Backend starts on http://localhost:3001.

### 3. Frontend

    cd ../frontend
    npm install
    npm run dev

Frontend starts on http://localhost:5173.

### 4. Verify

    curl http://localhost:3001/api/health

Should return:

    {"status":"ok","model":"qwen2.5:7b","ollama_url":"http://localhost:11434"}

---

## API

GET /api/health — service status

POST /api/normalize — extract structured data from messy input

Request:

    { "text": "Patient ko fever hai 102, gave paracetamol 500mg, come back tomorrow morning" }

Response:

    {
      "input": "...",
      "symptoms": ["fever"],
      "medications": ["paracetamol 500mg"],
      "followup": "tomorrow morning",
      "summary_en": "The patient has a fever of 102. Paracetamol 500mg was administered. The patient should return tomorrow morning.",
      "idioms_matched": [],
      "idioms_count": 0,
      "model": "qwen2.5:7b",
      "duration_ms": 11097
    }

---

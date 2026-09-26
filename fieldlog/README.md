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
```
---
# FieldLog Setup

### 1. Clone the repo

```bash
git clone https://github.com/Txkxn/bitnbuild.git
cd bitnbuild/fieldlog
```

### 2. Install prerequisites

Install:

* Node.js + npm
* Python 3
* Ollama
* Whisper

Then install Qwen:

```bash
ollama pull qwen3
```

### 3. Start the app

Open **3 terminals**.

**Frontend**

```bash
cd fieldlog/frontend
npm install
npm run dev
```

**Backend**

```bash
cd fieldlog/backend
npm install
npm run dev
```

**Whisper**

```bash
cd fieldlog/whisper
pip install -r requirements.txt
python server.py
```

Make sure **Ollama is running** in the background.

You should now have the frontend, backend, Whisper, and Ollama running simultaneously.

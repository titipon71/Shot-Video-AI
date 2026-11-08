# Word timestamps for a voiceover, for story videos ("voice" in the config).
#   .cache/whisper-venv/Scripts/python scripts/story/transcribe.py assets/voice/<id>.wav assets/voice/<id>.words.json
# Writes a flat array [{ "text", "start", "end" }]. The text only has to be close: make.mjs aligns it
# to the scenes' narration (`say`) character by character and keeps the times.
# Setup once: python -m venv .cache/whisper-venv && .cache/whisper-venv/Scripts/python -m pip install faster-whisper
import argparse
import json

from faster_whisper import WhisperModel

ap = argparse.ArgumentParser()
ap.add_argument("audio")
ap.add_argument("out")
ap.add_argument("--model", default="medium")
ap.add_argument("--language", default="th")
ap.add_argument("--prompt", default=None, help="names and terms to bias spelling toward")
a = ap.parse_args()

model = WhisperModel(a.model, device="cpu", compute_type="int8")
segments, info = model.transcribe(
    a.audio, language=a.language, word_timestamps=True, initial_prompt=a.prompt, vad_filter=False, beam_size=5
)
words = []
for seg in segments:
    for w in seg.words or []:
        words.append({"text": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)})
    print(f"{seg.start:7.2f}-{seg.end:7.2f} {seg.text.strip()}", flush=True)

with open(a.out, "w", encoding="utf-8") as f:
    json.dump(words, f, ensure_ascii=False, indent=0)
print(f"{len(words)} words, {info.duration:.2f}s -> {a.out}")

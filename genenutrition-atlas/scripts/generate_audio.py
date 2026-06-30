#!/usr/bin/env python3
"""
Regenerate the fixed narration MP3s for GeneNutrition Atlas.

Each gene's narration = its `plain` explanation + population note + a short
disclaimer (the same text the app shows). Audio is synthesized with Kokoro v1.0
(neural TTS, voice `am_michael` — warm, calm, confident male) and encoded to MP3.

Setup (one time)
----------------
    pip install kokoro-onnx soundfile imageio-ffmpeg

    # Model + voices (hosted on the kokoro-onnx GitHub releases):
    mkdir -p scripts/kokoro
    curl -L -o scripts/kokoro/kokoro-v1.0.int8.onnx \
      https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.int8.onnx
    curl -L -o scripts/kokoro/voices-v1.0.bin \
      https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin

Run
---
    python scripts/generate_audio.py

Outputs MP3s into ../audio/<SYMBOL>.mp3 and writes ../audio/manifest.json.
The gene text is read straight from ../js/data.js so audio always matches the app.
"""
import json, re, os, subprocess, time, sys
from multiprocessing import Pool

HERE = os.path.dirname(os.path.abspath(__file__))
APP  = os.path.dirname(HERE)
OUT  = os.path.join(APP, "audio")
MODEL   = os.path.join(HERE, "kokoro", "kokoro-v1.0.int8.onnx")
VOICES  = os.path.join(HERE, "kokoro", "voices-v1.0.bin")
VOICE, SPEED, WORKERS = "am_michael", 0.94, max(1, os.cpu_count() or 1)


def load_genes():
    """Read symbol/name/plain/population out of js/data.js without a JS engine."""
    src = open(os.path.join(APP, "js", "data.js"), encoding="utf-8").read()
    # Grab each gene object's four narration-relevant fields in source order.
    blocks = re.split(r"\n\s*\{\s*\n\s*symbol:", src)[1:]
    genes = []
    for b in blocks:
        b = "symbol:" + b
        def field(name):
            m = re.search(name + r':\s*"((?:[^"\\]|\\.)*)"', b)
            return json.loads('"' + m.group(1) + '"') if m else None
        sym = field("symbol")
        if not sym:
            continue
        genes.append({"symbol": sym, "name": field("name"),
                      "plain": field("plain"), "population": field("population")})
    return genes


def spoken_symbol(sym):
    return " ".join(re.findall(r"[A-Za-z]|[0-9]+", sym))


def narration(g):
    return (f"{spoken_symbol(g['symbol'])}. {g['name']}. {g['plain']} "
            f"Here's a quick population note. {g['population']} "
            f"Remember, this is educational information to discuss with your "
            f"clinician, not medical advice.")


_K = None
def worker(g):
    global _K
    if _K is None:
        from kokoro_onnx import Kokoro
        _K = Kokoro(MODEL, VOICES)
    import soundfile as sf
    import imageio_ffmpeg
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    sym = g["symbol"]
    wav = os.path.join(OUT, f"_tmp_{os.getpid()}.wav")
    mp3 = os.path.join(OUT, f"{sym}.mp3")
    samples, sr = _K.create(narration(g), voice=VOICE, speed=SPEED, lang="en-us")
    sf.write(wav, samples, sr)
    subprocess.run([ff, "-y", "-i", wav, "-ac", "1", "-c:a", "libmp3lame",
                    "-b:a", "56k", mp3, "-loglevel", "error"], check=True)
    os.remove(wav)
    dur = len(samples) / sr
    print(f"  {sym:8s} {dur:5.1f}s  {os.path.getsize(mp3)//1024:4d}KB", flush=True)
    return sym, round(dur, 1)


def main():
    if not (os.path.exists(MODEL) and os.path.exists(VOICES)):
        sys.exit(f"Model files missing. See the setup notes at the top of this script.")
    os.makedirs(OUT, exist_ok=True)
    genes = load_genes()
    t0 = time.time()
    print(f"Generating {len(genes)} narrations (voice={VOICE}) on {WORKERS} workers…", flush=True)
    with Pool(WORKERS) as pool:
        results = pool.map(worker, genes)
    manifest = {s: {"file": f"audio/{s}.mp3", "seconds": d} for s, d in results}
    json.dump({"voice": VOICE, "engine": "Kokoro v1.0", "speed": SPEED, "genes": manifest},
              open(os.path.join(OUT, "manifest.json"), "w"), indent=2)
    print(f"DONE {len(results)} files in {time.time()-t0:.0f}s -> {OUT}", flush=True)


if __name__ == "__main__":
    main()

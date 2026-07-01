#!/usr/bin/env python3
"""Regenerate clean narration MP3s: per-sentence synthesis + silence-trim +
uniform short gaps. Fixes the patchy/dropout seams from long single-pass TTS."""
import json, re, os, subprocess, time
from multiprocessing import Pool
import numpy as np
import imageio_ffmpeg

BASE = "/tmp/claude-0/-home-user-Claude/e5944d0c-cddf-51fa-aff1-bb8bfbd5d23e/scratchpad"
OUT  = "/home/user/Claude/neuronourish/audio"
VOICE, SPEED, WORKERS, SR = "am_michael", 0.95, 4, 24000
GAP = int(0.13 * SR)        # pause between sentences
EDGE = int(0.08 * SR)       # lead/tail padding
os.makedirs(OUT, exist_ok=True)
FF = imageio_ffmpeg.get_ffmpeg_exe()
GENES = json.load(open(f"{BASE}/genes.json"))

def spoken_symbol(sym):
    return " ".join(re.findall(r"[A-Za-z]|[0-9]+", sym))

def tts_norm(s):
    # Drop code-like parentheticals (contain a digit, * or /) — they read as gibberish.
    s = re.sub(r"\([^)]*[\d*/][^)]*\)", "", s)
    s = s.replace("—", ", ").replace("–", " to ")     # em-dash -> comma; en-dash (ranges) -> "to"
    s = s.replace("%", " percent").replace("&", " and ")
    s = re.sub(r"\be\.g\.\,?", "for example,", s)
    s = re.sub(r"\bi\.e\.\,?", "that is,", s)
    s = re.sub(r"\s+", " ", s)
    s = re.sub(r"\s+([.,;:!?])", r"\1", s)            # no space before punctuation
    s = re.sub(r"\(\s*\)", "", s)                      # empty parens left over
    s = re.sub(r"\s{2,}", " ", s).strip()
    return s

def narration_sentences(g):
    parts = [
        f"{spoken_symbol(g['symbol'])}.",
        f"{g['name']}.",
        g["plain"],
        "Here's a quick population note.",
        g["population"],
        "Remember, this is educational information to discuss with your clinician, not medical advice.",
    ]
    text = tts_norm(" ".join(parts))
    # Split into sentences for clean per-chunk synthesis.
    sents = re.split(r"(?<=[.!?])\s+", text)
    return [s.strip() for s in sents if s.strip()]

def trim(samples, thresh=0.012, margin=int(0.04*SR)):
    a = np.abs(samples)
    idx = np.where(a > thresh)[0]
    if len(idx) == 0:
        return samples[:0]
    s = max(0, idx[0] - margin); e = min(len(samples), idx[-1] + margin)
    return samples[s:e]

_K = None
def worker(g):
    global _K
    if _K is None:
        from kokoro_onnx import Kokoro
        _K = Kokoro(f"{BASE}/kokoro/kokoro-v1.0.int8.onnx", f"{BASE}/kokoro/voices-v1.0.bin")
    import soundfile as sf
    sym = g["symbol"]
    chunks = []
    for sent in narration_sentences(g):
        samples, sr = _K.create(sent, voice=VOICE, speed=SPEED, lang="en-us")
        samples = trim(np.asarray(samples, dtype=np.float32))
        if len(samples):
            chunks.append(samples)
    gap = np.zeros(GAP, dtype=np.float32)
    edge = np.zeros(EDGE, dtype=np.float32)
    pieces = [edge]
    for i, c in enumerate(chunks):
        pieces.append(c)
        pieces.append(gap if i < len(chunks) - 1 else edge)
    audio = np.concatenate(pieces)
    # gentle peak normalize
    peak = float(np.max(np.abs(audio))) or 1.0
    audio = (audio / peak) * 0.95
    wav = os.path.join(OUT, f"_tmp_{os.getpid()}.wav")
    mp3 = os.path.join(OUT, f"{sym}.mp3")
    sf.write(wav, audio, SR)
    subprocess.run([FF, "-y", "-i", wav, "-ac", "1", "-c:a", "libmp3lame",
                    "-b:a", "64k", mp3, "-loglevel", "error"], check=True)
    os.remove(wav)
    dur = len(audio) / SR
    print(f"  {sym:8s} {dur:5.1f}s  {len(chunks)} sentences  {os.path.getsize(mp3)//1024}KB", flush=True)
    return sym, round(dur, 1)

if __name__ == "__main__":
    t0 = time.time()
    print(f"Regenerating {len(GENES)} narrations (sentence-split) on {WORKERS} workers…", flush=True)
    with Pool(WORKERS) as pool:
        results = pool.map(worker, GENES)
    manifest = {s: {"file": f"audio/{s}.mp3", "seconds": d} for s, d in results}
    json.dump({"voice": VOICE, "engine": "Kokoro v1.0 (sentence-split)", "speed": SPEED,
               "genes": manifest}, open(os.path.join(OUT, "manifest.json"), "w"), indent=2)
    print(f"DONE {len(results)} files in {time.time()-t0:.0f}s", flush=True)

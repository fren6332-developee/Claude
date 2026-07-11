#!/usr/bin/env bash
# Step 7 of the YouTube pipeline: promote a job's composite render to
# outputs/<job>.final.mp4 -- the ship-ready deliverable.
set -euo pipefail

usage() {
  echo "Usage: $0 <job>" >&2
  exit 1
}

[ $# -eq 1 ] || usage
job="$1"

pipeline_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
project_dir="$pipeline_root/projects/$job"
outputs_dir="$pipeline_root/outputs"

[ -d "$project_dir" ] || { echo "No such project: $project_dir" >&2; exit 1; }

manifest="$project_dir/job.json"
[ -f "$manifest" ] || { echo "Missing job.json manifest in $project_dir" >&2; exit 1; }

# composite.mp4 is whatever graphics-plan / embedded-captions / background-music
# left behind -- the fully assembled render, ready to ship as-is.
composite="$project_dir/composite.mp4"
[ -f "$composite" ] || {
  echo "No composite.mp4 in $project_dir -- run graphics-plan (and captions/music" >&2
  echo "for formats that need them) before finalize." >&2
  exit 1
}

command -v ffmpeg >/dev/null 2>&1 || { echo "ffmpeg not found on PATH" >&2; exit 1; }

mkdir -p "$outputs_dir"
final="$outputs_dir/${job}.final.mp4"

ffmpeg -y -i "$composite" -c copy -movflags +faststart "$final"

if command -v python3 >/dev/null 2>&1; then
  python3 - "$manifest" <<'PY'
import json
import sys
import datetime

path = sys.argv[1]
with open(path) as f:
    data = json.load(f)
data["status"] = "shipped"
data["shipped_at"] = datetime.datetime.utcnow().isoformat() + "Z"
with open(path, "w") as f:
    json.dump(data, f, indent=2)
    f.write("\n")
PY
else
  echo "python3 not found -- skipped updating job.json status to 'shipped'" >&2
fi

echo "Shipped: $final"

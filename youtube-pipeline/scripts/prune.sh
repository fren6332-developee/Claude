#!/usr/bin/env bash
# Cleans up a shipped job's intermediate render artifacts, keeping raw/ (the
# source of truth) and job.json (the manifest/history). Everything else --
# rough-cut renders, graphics renders, caption burns, music stems, the
# composite -- is reproducible from raw/ plus the plan files, so it's safe to
# drop once outputs/<job>.final.mp4 exists.
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
[ -f "$outputs_dir/${job}.final.mp4" ] || {
  echo "Refusing to prune: outputs/${job}.final.mp4 does not exist yet." >&2
  echo "Run finalize.sh first." >&2
  exit 1
}

shopt -s dotglob nullglob
for entry in "$project_dir"/*; do
  name="$(basename "$entry")"
  case "$name" in
    raw|job.json) continue ;;
  esac
  rm -rf -- "$entry"
  echo "Pruned: $name"
done

echo "Pruned project: $job"

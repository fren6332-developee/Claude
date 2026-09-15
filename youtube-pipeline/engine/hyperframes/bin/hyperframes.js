#!/usr/bin/env node
// CLI entry point for the HyperFrames engine. Skills call HyperFrames
// through this, never by importing src/ directly from outside this package.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { reframe } from '../src/reframe.js';
import { renderGraphics } from '../src/graphics.js';
import { renderCaptions } from '../src/captions.js';
import { spliceBroll } from '../src/broll.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      i++;
    }
  }
  return args;
}

function requireArgs(args, keys, command) {
  const missing = keys.filter((k) => args[k] === undefined);
  if (missing.length > 0) {
    throw new Error(`hyperframes ${command}: missing required --${missing.join(', --')}`);
  }
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);
  const dryRun = Boolean(args['dry-run']);

  switch (command) {
    case 'reframe': {
      requireArgs(args, ['in', 'width', 'height', 'out'], 'reframe');
      const result = await reframe({
        inFile: args.in,
        width: Number(args.width),
        height: Number(args.height),
        outFile: args.out,
        dryRun,
      });
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    case 'graphics': {
      requireArgs(args, ['plan', 'preset', 'base', 'out-dir', 'out', 'width', 'height'], 'graphics');
      const result = await renderGraphics({
        planPath: args.plan,
        presetPath: args.preset,
        baseVideo: args.base,
        outDir: args['out-dir'],
        outFile: args.out,
        width: Number(args.width),
        height: Number(args.height),
        fps: args.fps ? Number(args.fps) : undefined,
        dryRun,
      });
      console.log(JSON.stringify({ beatsRendered: result.beatsRendered, outFile: result.outFile }, null, 2));
      break;
    }
    case 'captions': {
      requireArgs(args, ['transcript', 'corrections', 'preset', 'base', 'out-dir', 'out', 'width', 'height'], 'captions');
      const result = await renderCaptions({
        transcriptPath: args.transcript,
        correctionsPath: args.corrections,
        presetPath: args.preset,
        baseVideo: args.base,
        outDir: args['out-dir'],
        outFile: args.out,
        width: Number(args.width),
        height: Number(args.height),
        fps: args.fps ? Number(args.fps) : undefined,
        dryRun,
      });
      console.log(JSON.stringify({ cuesRendered: result.cuesRendered, outFile: result.outFile }, null, 2));
      break;
    }
    case 'broll': {
      requireArgs(args, ['plan', 'base', 'out'], 'broll');
      const result = await spliceBroll({
        planPath: args.plan,
        baseVideo: args.base,
        outFile: args.out,
        dryRun,
      });
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    default:
      console.error(`Usage: hyperframes <reframe|graphics|captions|broll> [options]

  reframe   --in <file> --width <n> --height <n> --out <file>
  graphics  --plan <graphics-plan.json> --preset <preset.json> --base <video>
            --out-dir <scratch-dir> --out <file> --width <n> --height <n>
            [--fps 30] [--dry-run]
  captions  --transcript <words.json> --corrections <caption-corrections.json>
            --preset <preset.json> --base <video> --out-dir <scratch-dir>
            --out <file> --width <n> --height <n> [--fps 30] [--dry-run]
  broll     --plan <broll-plan.json> --base <video> --out <file> [--dry-run]
`);
      process.exit(command ? 1 : 0);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

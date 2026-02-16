import { EdgeTTS } from 'node-edge-tts';
import { mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';
import { $ } from 'bun';

const VOICE = 'en-US-AndrewMultilingualNeural';
const OUTPUT_DIR = resolve('./public/audio');

// Reel 1 voiceover (natural rate, 950 frames / 31.7s)
//   S1: from=3, dur=50    → 1.67s (audio 1.56s)
//   S2: from=73, dur=118  → 3.93s (audio 3.79s)
//   S3: from=214, dur=235 → 7.83s (audio 7.63s)
//   S4: from=464, dur=145 → 4.83s (audio 4.66s)
//   S5: from=624, dur=179 → 5.97s (audio 5.81s)
//   S6: from=814, dur=128 → 4.27s (audio 4.10s)

// Reel 2 voiceover (natural rate, 1000 frames / 33.3s)
//   S1: from=3, dur=110   → 3.67s (audio 3.29s)
//   S2: from=118, dur=152 → 5.07s (audio 4.73s)
//   S3: from=279, dur=182 → 6.07s (audio 5.71s)
//   S4: from=469, dur=218 → 7.27s (audio 7.01s)
//   S5: from=694, dur=164 → 5.47s (audio 5.26s)
//   S6: from=864, dur=132 → 4.40s (audio 4.10s)

// ─── Reel 1: Clicks to Intent ───────────────────────────────────────────────

const REEL_1_SEGMENTS = [
  {
    id: 'r1-s1-hook',
    text: "Clicks aren't insights.",
    rate: 'default',
    pitch: '-3Hz',
    maxDuration: 1.7,
  },
  {
    id: 'r1-s2-problem',
    text: "Most tools just count clicks. Counting isn't understanding.",
    rate: 'default',
    pitch: 'default',
    maxDuration: 4.0,
  },
  {
    id: 'r1-s3-behavior',
    text: 'Crow captures real behavior. Clicks, forms, scrolls, and product views. All under ten K.',
    rate: 'default',
    pitch: 'default',
    maxDuration: 7.8,
  },
  {
    id: 'r1-s4-edge',
    text: 'Processed at the edge. Global workers. Ultra low latency.',
    rate: 'default',
    pitch: 'default',
    maxDuration: 4.9,
  },
  {
    id: 'r1-s5-intent',
    text: 'AI turns sessions into intent. Browse becomes compare. Search becomes evaluate.',
    rate: 'default',
    pitch: 'default',
    maxDuration: 6.0,
  },
  {
    id: 'r1-s6-cta',
    text: 'Want this on your site? Get started at crow A.I. dot dev.',
    rate: 'default',
    pitch: '-3Hz',
    maxDuration: 4.3,
  },
];

// ─── Reel 2: Plug AI Into Reality ───────────────────────────────────────────

const REEL_2_SEGMENTS = [
  {
    id: 'r2-s1-hook',
    text: "Your AI is smart. But it's missing context.",
    rate: 'default',
    pitch: '-3Hz',
    maxDuration: 3.7,
  },
  {
    id: 'r2-s2-problem',
    text: "It can generate and reason. But it can't observe what your users actually do.",
    rate: 'default',
    pitch: 'default',
    maxDuration: 5.1,
  },
  {
    id: 'r2-s3-reality',
    text: 'Crow exposes reality. Through REST, MCP, and agent to agent.',
    rate: 'default',
    pitch: 'default',
    maxDuration: 6.1,
  },
  {
    id: 'r2-s4-agents',
    text: 'Agents retrieve patterns, then recommend actions. They notify, route, and summarize.',
    rate: 'default',
    pitch: 'default',
    maxDuration: 7.3,
  },
  {
    id: 'r2-s5-trust',
    text: 'Privacy first. You control retention, deletion, and access.',
    rate: 'default',
    pitch: 'default',
    maxDuration: 5.5,
  },
  {
    id: 'r2-s6-cta',
    text: 'Build with Crow. Get started at crow A.I. dot dev.',
    rate: 'default',
    pitch: '-3Hz',
    maxDuration: 4.4,
  },
];

async function getAudioDuration(filePath: string): Promise<number> {
  const result = await $`ffprobe -i ${filePath} -show_entries format=duration -v quiet -of csv=p=0`.text();
  return parseFloat(result.trim());
}

async function trimAudio(filePath: string, maxDuration: number): Promise<void> {
  const tmpPath = filePath.replace('.mp3', '.tmp.mp3');
  await $`ffmpeg -y -i ${filePath} -t ${maxDuration} -af "afade=t=out:st=${maxDuration - 0.15}:d=0.15" -c:a libmp3lame -q:a 2 ${tmpPath}`.quiet();
  await $`mv ${tmpPath} ${filePath}`.quiet();
}

async function generateSegments(segments: typeof REEL_1_SEGMENTS, label: string) {
  console.log(`\n=== Generating ${label} voiceovers ===\n`);

  for (const segment of segments) {
    console.log(`  Generating ${segment.id}...`);
    try {
      const tts = new EdgeTTS({
        voice: VOICE,
        lang: 'en-US',
        outputFormat: 'audio-24khz-96kbitrate-mono-mp3',
        rate: segment.rate || 'default',
        pitch: segment.pitch || 'default',
        saveSubtitles: false,
      });
      const outputPath = resolve(OUTPUT_DIR, `${segment.id}.mp3`);
      await tts.ttsPromise(segment.text, outputPath);

      // Check duration and trim if needed
      const duration = await getAudioDuration(outputPath);
      console.log(`    -> Duration: ${duration.toFixed(2)}s (max: ${segment.maxDuration}s)`);

      if (duration > segment.maxDuration) {
        console.log(`    -> Trimming to ${segment.maxDuration}s...`);
        await trimAudio(outputPath, segment.maxDuration);
        const newDuration = await getAudioDuration(outputPath);
        console.log(`    -> Trimmed to: ${newDuration.toFixed(2)}s`);
      }

      console.log(`    -> Saved: ${outputPath}`);
    } catch (err: any) {
      console.error(`    -> Failed: ${err.message}`);
    }
  }
}

async function main() {
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  await generateSegments(REEL_1_SEGMENTS, 'Reel 1 (Clicks to Intent)');
  await generateSegments(REEL_2_SEGMENTS, 'Reel 2 (Plug AI Into Reality)');

  console.log('\nDone! All reel voiceover segments generated and trimmed.');
}

main().catch(console.error);

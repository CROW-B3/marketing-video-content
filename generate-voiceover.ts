import { EdgeTTS } from 'node-edge-tts';
import { mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

const VOICE = 'en-US-GuyNeural';
const OUTPUT_DIR = resolve('./public/audio');

const SEGMENTS = [
  {
    id: 'intro',
    text: 'This is CROW. Unified customer intelligence, built by B3.',
    rate: '-5%',
  },
  {
    id: 'problem',
    text: 'Your customer data is trapped. Web analytics in one place. Social media in another. Physical retail somewhere else. Three worlds that never speak to each other.',
    rate: 'default',
  },
  {
    id: 'solution',
    text: 'CROW changes that. One platform that pulls every customer signal, web, social, and in-store, into a single source of truth.',
    rate: 'default',
  },
  {
    id: 'features',
    text: 'It starts with a lightweight web S.D.K. that captures every click, scroll, and conversion. Then, AI-powered social intelligence monitors what your customers are really saying. And finally, C.C.T.V. analytics turns your existing cameras into real-time foot traffic sensors.',
    rate: 'default',
  },
  {
    id: 'dashboard',
    text: 'It all comes together in one dashboard. Real-time metrics, trend analysis, and AI insights you can act on immediately.',
    rate: 'default',
  },
  {
    id: 'cta',
    text: 'See every signal. Understand every customer. Get started at crow dot bee-three dot dev.',
    rate: '-10%',
  },
];

async function main() {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const segment of SEGMENTS) {
    console.log(`Generating ${segment.id}...`);

    const tts = new EdgeTTS({
      voice: VOICE,
      lang: 'en-US',
      outputFormat: 'audio-24khz-96kbitrate-mono-mp3',
      rate: segment.rate,
      saveSubtitles: false,
    });

    const outputPath = `${OUTPUT_DIR}/${segment.id}.mp3`;
    await tts.ttsPromise(segment.text, outputPath);
    console.log(`  Saved: ${outputPath}`);
  }

  console.log('\nAll voiceover segments generated successfully!');
}

main().catch(console.error);

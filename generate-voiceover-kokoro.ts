import { KokoroTTS } from 'kokoro-js';
import { mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

const OUTPUT_DIR = resolve('./public/audio/kokoro');
if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

const SEGMENTS = [
  {
    id: 'intro',
    text: 'This is CROW. Unified customer intelligence, built by B3.',
    speed: 0.95,
  },
  {
    id: 'problem',
    text: 'Your customer data is trapped. Web analytics in one place. Social media in another. Physical retail somewhere else. Three worlds that never speak to each other.',
    speed: 0.98,
  },
  {
    id: 'solution',
    text: 'CROW changes that. One platform that pulls every customer signal, web, social, and in-store, into a single source of truth.',
    speed: 0.98,
  },
  {
    id: 'features',
    text: 'It starts with a lightweight web SDK that captures every click, scroll, and conversion. Then, AI-powered social intelligence monitors what your customers are really saying. And finally, CCTV analytics turns your existing cameras into real-time foot traffic sensors.',
    speed: 0.98,
  },
  {
    id: 'dashboard',
    text: 'It all comes together in one dashboard. Real-time metrics, trend analysis, and AI insights you can act on immediately.',
    speed: 0.98,
  },
  {
    id: 'cta',
    text: 'See every signal. Understand every customer. Get started at crow dot b3 dot dev.',
    speed: 0.9,
  },
];

async function main() {
  console.log('Loading Kokoro TTS model (first run downloads ~86MB)...');
  const tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {
    dtype: 'q8',
    device: 'cpu',
  });

  // List available voices (returns void, already printed above)
  await tts.list_voices();

  // Generate with am_michael (deep male) 
  for (const segment of SEGMENTS) {
    console.log(`Generating ${segment.id} with am_michael...`);
    try {
      const audio = await tts.generate(segment.text, {
        voice: 'am_michael',
        speed: segment.speed,
      });
      const outputPath = resolve(OUTPUT_DIR, `${segment.id}.wav`);
      audio.save(outputPath);
      console.log(`  -> Saved: ${outputPath}`);
    } catch (err: any) {
      console.error(`  -> Failed: ${err.message}`);
    }
  }

  console.log('\nDone! Kokoro voiceover saved to public/audio/kokoro/');
}

main().catch(console.error);

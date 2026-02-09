import { EdgeTTS } from 'node-edge-tts';
import { mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

const OUTPUT_DIR_ANDREW = resolve('./public/audio/andrew');
const OUTPUT_DIR_BRIAN = resolve('./public/audio/brian');

const SEGMENTS = [
  {
    id: 'intro',
    text: 'This is CROW. Unified customer intelligence, built by B3.',
    rate: '-5%',
    pitch: '-5Hz',
  },
  {
    id: 'problem',
    text: 'Your customer data is trapped. Web analytics in one place. Social media in another. Physical retail somewhere else. Three worlds that never speak to each other.',
    rate: '-2%',
    pitch: 'default',
  },
  {
    id: 'solution',
    text: 'CROW changes that. One platform that pulls every customer signal — web, social, and in-store — into a single source of truth.',
    rate: '-2%',
    pitch: 'default',
  },
  {
    id: 'features',
    text: 'It starts with a lightweight web S.D.K. that captures every click, scroll, and conversion. Then, AI-powered social intelligence monitors what your customers are really saying. And finally, C.C.T.V. analytics turns your existing cameras into real-time foot traffic sensors.',
    rate: '-2%',
    pitch: 'default',
  },
  {
    id: 'dashboard',
    text: 'It all comes together in one dashboard. Real-time metrics, trend analysis, and AI insights you can act on immediately.',
    rate: '-2%',
    pitch: 'default',
  },
  {
    id: 'cta',
    text: 'See every signal. Understand every customer. Get started at crow dot bee-three dot dev.',
    rate: '-8%',
    pitch: '-3Hz',
  },
];

async function generateForVoice(voice: string, outputDir: string) {
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  console.log(`\n=== Generating with ${voice} ===\n`);

  for (const segment of SEGMENTS) {
    console.log(`  Generating ${segment.id}...`);
    try {
      const tts = new EdgeTTS({
        voice,
        lang: 'en-US',
        outputFormat: 'audio-24khz-96kbitrate-mono-mp3',
        rate: segment.rate || 'default',
        pitch: segment.pitch || 'default',
        saveSubtitles: false,
      });
      const outputPath = resolve(outputDir, `${segment.id}.mp3`);
      await tts.ttsPromise(segment.text, outputPath);
      console.log(`    -> Saved: ${outputPath}`);
    } catch (err: any) {
      console.error(`    -> Failed: ${err.message}`);
    }
  }
}

async function main() {
  await generateForVoice('en-US-AndrewMultilingualNeural', OUTPUT_DIR_ANDREW);
  await generateForVoice('en-US-BrianMultilingualNeural', OUTPUT_DIR_BRIAN);

  // Also regenerate the main audio directory with Andrew (our primary pick)
  const mainDir = resolve('./public/audio');
  console.log(`\n=== Generating main audio with en-US-AndrewMultilingualNeural ===\n`);
  for (const segment of SEGMENTS) {
    console.log(`  Generating ${segment.id}...`);
    try {
      const tts = new EdgeTTS({
        voice: 'en-US-AndrewMultilingualNeural',
        lang: 'en-US',
        outputFormat: 'audio-24khz-96kbitrate-mono-mp3',
        rate: segment.rate || 'default',
        pitch: segment.pitch || 'default',
        saveSubtitles: false,
      });
      const outputPath = resolve(mainDir, `${segment.id}.mp3`);
      await tts.ttsPromise(segment.text, outputPath);
      console.log(`    -> Saved: ${outputPath}`);
    } catch (err: any) {
      console.error(`    -> Failed: ${err.message}`);
    }
  }

  console.log('\nDone! Main audio updated with AndrewMultilingualNeural.');
  console.log('Compare alternatives in public/audio/andrew/ and public/audio/brian/');
}

main().catch(console.error);

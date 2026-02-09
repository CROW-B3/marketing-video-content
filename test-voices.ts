import { EdgeTTS } from 'node-edge-tts';
import { mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

const OUTPUT_DIR = resolve('./public/audio/test');
if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

const TEXT = "This is CROW. Unified customer intelligence, built by B3. Your customer data is trapped. Web analytics in one place. Social media in another.";

const VOICES = [
  'en-US-AndrewMultilingualNeural',
  'en-US-BrianMultilingualNeural',
  'en-US-DavisNeural',
  'en-GB-RyanNeural',
  'en-US-ChristopherNeural',
  'en-US-AndrewNeural',
  'en-US-GuyNeural',
];

async function main() {
  for (const voice of VOICES) {
    console.log(`Generating sample for: ${voice}`);
    try {
      const tts = new EdgeTTS({
        voice,
        lang: 'en-US',
        outputFormat: 'audio-24khz-96kbitrate-mono-mp3',
        rate: 'default',
        saveSubtitles: false,
      });
      const outputPath = resolve(OUTPUT_DIR, `${voice}.mp3`);
      await tts.ttsPromise(TEXT, outputPath);
      console.log(`  -> Saved: ${outputPath}`);
    } catch (err) {
      console.error(`  -> Failed for ${voice}:`, err);
    }
  }
  console.log('\nDone! Compare the files in public/audio/test/');
}

main();

// Original soundtrack for the #8 AEP film, synthesised from scratch (no samples, no licensing).
// Writes a 70 s stereo WAV, then muxes it into the rendered MP4 with ffmpeg:
//   node film/music.js "<path to ffmpeg.exe>"
// The arrangement follows the film: soft intro, beat drops at "How it works" (5 s),
// a lift at each use case, a build into "end to end" and a resolve on the outro.
const fs = require('fs'), path = require('path'), os = require('os');
const { spawnSync } = require('child_process');

const FF = process.argv[2];
const ROOT = path.resolve(__dirname, '..');
const VIDEO = path.join(ROOT, 'assets/video/aep-how-it-works.mp4');
const SR = 44100, DUR = 85, N = SR * DUR;
const BPM = 112, BEAT = 60 / BPM, BAR = BEAT * 4;
const L = new Float32Array(N), R = new Float32Array(N);

// A minor feel, uplifting: Am – F – C – G, two bars each
const CHORDS = [[57, 60, 64, 69], [53, 57, 60, 65], [48, 55, 60, 64], [55, 59, 62, 67]];
const BASS = [45, 41, 48, 43];
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
const chordAt = t => Math.floor(t / (BAR * 2)) % 4;

// Section energy over time (0..1): intro, drop, use cases, build, outro
function energy(t) {
  if (t < 5) return 0.25;
  if (t < 27.4) return 0.7;
  if (t < 58) return 0.88;
  if (t < 68) return 0.95;
  if (t < 73) return 0.8;
  if (t < 79) return 1;
  return Math.max(0, 0.6 - (t - 79) * 0.08);
}
const beatOn = t => t >= 5 && t < 82;
const SCENE_HITS = [5, 27.4, 34, 40, 46, 52, 58, 68, 73, 79];

let seed = 7;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647 * 2 - 1;

// --- pads: detuned saw-ish tones through a one-pole low-pass
(function pads() {
  const voices = [];
  for (let v = 0; v < 4; v++) for (const det of [-0.11, 0, 0.12]) voices.push({ v, det, ph: Math.random() });
  let lpL = 0, lpR = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR, ch = CHORDS[chordAt(t)];
    let sL = 0, sR = 0;
    for (const o of voices) {
      const f = hz(ch[o.v]) * Math.pow(2, o.det / 12);
      o.ph = (o.ph + f / SR) % 1;
      const s = 2 * o.ph - 1;
      if (o.det < 0) sL += s; else if (o.det > 0) sR += s; else { sL += s * .5; sR += s * .5; }
    }
    const cut = 0.025 + 0.05 * energy(t) + 0.015 * Math.sin(t * 0.4);
    lpL += cut * (sL - lpL); lpR += cut * (sR - lpR);
    const fade = Math.min(1, t / 3) * Math.min(1, (DUR - t) / 4);
    L[i] += lpL * 0.05 * fade; R[i] += lpR * 0.05 * fade;
  }
})();

// --- sub bass on every beat (eighth-note pulse), sine with soft envelope
for (let b = 0; b * BEAT / 2 < DUR; b++) {
  const t0 = b * BEAT / 2;
  if (!beatOn(t0)) continue;
  const f = hz(BASS[chordAt(t0)] - 12), len = BEAT / 2 * 0.95;
  for (let j = 0; j < len * SR; j++) {
    const i = Math.floor(t0 * SR) + j; if (i >= N) break;
    const tt = j / SR, env = Math.min(1, tt * 200) * Math.exp(-tt * 5);
    const s = Math.sin(2 * Math.PI * f * tt) * env * 0.22 * energy(t0);
    L[i] += s; R[i] += s;
  }
}

// --- kick on quarters, snare-ish clap on 2 and 4, hats on offbeats
for (let b = 0; b * BEAT < DUR; b++) {
  const t0 = b * BEAT;
  if (!beatOn(t0)) continue;
  const e = energy(t0);
  for (let j = 0; j < 0.35 * SR; j++) {
    const i = Math.floor(t0 * SR) + j; if (i >= N) break;
    const tt = j / SR, f = 48 + 90 * Math.exp(-tt * 28);
    const s = Math.sin(2 * Math.PI * f * tt) * Math.exp(-tt * 9) * 0.5 * e;
    L[i] += s; R[i] += s;
  }
  if (b % 2 === 1 && t0 >= 27.4) {
    for (let j = 0; j < 0.2 * SR; j++) {
      const i = Math.floor(t0 * SR) + j; if (i >= N) break;
      const tt = j / SR, s = rnd() * Math.exp(-tt * 22) * 0.12 * e;
      L[i] += s; R[i] += s * 0.9;
    }
  }
  const th = t0 + BEAT / 2;
  let hp = 0, prev = 0;
  for (let j = 0; j < 0.05 * SR; j++) {
    const i = Math.floor(th * SR) + j; if (i >= N) break;
    const n = rnd(); hp = 0.85 * (hp + n - prev); prev = n;
    const s = hp * Math.exp(-j / SR * 70) * 0.045 * e;
    L[i] += s * 0.7; R[i] += s;
  }
}

// --- plucked arpeggio (sixteenths) from the use cases onward
for (let k = 0; k * BEAT / 4 < DUR; k++) {
  const t0 = k * BEAT / 4;
  if (t0 < 9 || t0 > 80) continue;
  const ch = CHORDS[chordAt(t0)], pat = [0, 2, 1, 3, 2, 1, 3, 2];
  const f = hz(ch[pat[k % 8]] + 12), pan = (k % 2) ? 0.75 : 0.35;
  for (let j = 0; j < 0.25 * SR; j++) {
    const i = Math.floor(t0 * SR) + j; if (i >= N) break;
    const tt = j / SR, env = Math.exp(-tt * 14);
    const s = (Math.sin(2 * Math.PI * f * tt) + 0.3 * Math.sin(4 * Math.PI * f * tt)) * env * 0.05 * energy(t0);
    L[i] += s * (1 - pan); R[i] += s * pan;
  }
}

// --- soft riser into each scene change, and a shimmer hit on it
for (const h of SCENE_HITS) {
  const start = h - 1.2;
  for (let j = 0; j < 1.2 * SR; j++) {
    const i = Math.floor(start * SR) + j; if (i < 0 || i >= N) continue;
    const k = j / (1.2 * SR), s = rnd() * k * k * 0.035;
    L[i] += s; R[i] += s;
  }
  for (let j = 0; j < 1.6 * SR; j++) {
    const i = Math.floor(h * SR) + j; if (i >= N) break;
    const tt = j / SR, env = Math.exp(-tt * 2.6);
    const s = (Math.sin(2 * Math.PI * 1760 * tt) + Math.sin(2 * Math.PI * 2637 * tt) * .6) * env * 0.018;
    L[i] += s; R[i] += s * 0.8;
  }
}

// --- simple stereo echo for space, then soft-clip and normalise
const D = Math.floor(BEAT * 0.75 * SR);
for (let i = D; i < N; i++) { L[i] += R[i - D] * 0.22; R[i] += L[i - D] * 0.22; }
let peak = 0;
for (let i = 0; i < N; i++) { L[i] = Math.tanh(L[i] * 1.2); R[i] = Math.tanh(R[i] * 1.2); peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])); }
const g = 0.89 / peak;

const wav = Buffer.alloc(44 + N * 4);
wav.write('RIFF', 0); wav.writeUInt32LE(36 + N * 4, 4); wav.write('WAVE', 8); wav.write('fmt ', 12);
wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(2, 22); wav.writeUInt32LE(SR, 24);
wav.writeUInt32LE(SR * 4, 28); wav.writeUInt16LE(4, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { wav.writeInt16LE(Math.round(L[i] * g * 32767), 44 + i * 4); wav.writeInt16LE(Math.round(R[i] * g * 32767), 46 + i * 4); }
const WAV = path.join(os.tmpdir(), 'hash8-soundtrack.wav');
fs.writeFileSync(WAV, wav);
console.log('soundtrack written', WAV);

if (FF) {
  const tmp = VIDEO.replace(/\.mp4$/, '.tmp.mp4');
  const r = spawnSync(FF, ['-y', '-loglevel', 'error', '-i', VIDEO, '-i', WAV, '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', tmp], { stdio: 'inherit' });
  if (r.status) process.exit(r.status);
  fs.copyFileSync(tmp, VIDEO); fs.unlinkSync(tmp); // copy, not rename: Windows blocks renaming over a file a browser has open
  console.log('music added to', VIDEO);
}

// Renders film/aep-film.html to assets/video/aep-how-it-works.mp4 (+ poster) frame by frame.
// Needs Microsoft Edge and an ffmpeg binary, e.g. `pip install imageio-ffmpeg`, then:
//   node film/render.js "<path to ffmpeg.exe>" [fps]
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const FF = process.argv[2];
const FPS = +process.argv[3] || 30;
const OUT = path.join(ROOT, 'assets/video/aep-how-it-works.mp4');
const POSTER = path.join(ROOT, 'assets/video/aep-poster.jpg');
const POSTER_AT = 31;
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
if (!FF) { console.error('usage: node film/render.js <ffmpeg> [fps]'); process.exit(1); }

const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' };
const server = http.createServer((q, s) => {
  const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(d); });
});
const sleep = ms => new Promise(r => setTimeout(r, ms));

server.listen(0, async () => {
  const site = 'http://127.0.0.1:' + server.address().port;
  const port = 9500 + Math.floor(Math.random() * 400);
  const browser = spawn(EDGE, ['--headless=new', '--remote-debugging-port=' + port, '--window-size=1920,1080', '--hide-scrollbars',
    '--force-device-scale-factor=1', '--user-data-dir=' + path.join(os.tmpdir(), 'film-prof-' + port), 'about:blank']);
  try {
    let ws;
    for (let i = 0; i < 60 && !ws; i++) {
      try { const j = await (await fetch('http://127.0.0.1:' + port + '/json')).json(); const p = j.find(x => x.type === 'page'); if (p) ws = p.webSocketDebuggerUrl; } catch (e) {}
      if (!ws) await sleep(250);
    }
    const sock = new WebSocket(ws); await new Promise(r => sock.onopen = r);
    let id = 0; const pend = {};
    sock.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pend[d.id]) { pend[d.id](d.result || d.error); delete pend[d.id]; } };
    const send = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; sock.send(JSON.stringify({ id: i, method, params })); });
    const evalJs = async e => (await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result.value;

    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: site + '/film/aep-film.html?capture' });
    for (let i = 0; i < 80 && !(await evalJs('!!window.FILM_READY')); i++) await sleep(250);
    const frames = Math.round((await evalJs('window.FILM_DURATION')) * FPS);

    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    const ff = spawn(FF, ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-vf', 'scale=in_range=pc:out_range=tv,format=yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-profile:v', 'high', '-movflags', '+faststart', OUT], { stdio: ['pipe', 'ignore', 'pipe'] });
    let ffErr = ''; ff.stderr.on('data', d => { ffErr = (ffErr + d).slice(-2000); });

    for (let f = 0; f < frames; f++) {
      const t = f / FPS;
      await evalJs('seek(' + t + ')');
      const buf = Buffer.from((await send('Page.captureScreenshot', { format: 'jpeg', quality: 92 })).data, 'base64');
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (Math.abs(t - POSTER_AT) < 0.5 / FPS) fs.writeFileSync(POSTER, buf);
      if (f % (FPS * 10) === 0) console.log('frame', f, '/', frames);
    }
    ff.stdin.end();
    const code = await new Promise(r => ff.on('close', r));
    if (code) throw new Error('ffmpeg failed: ' + ffErr);
    console.log('wrote', OUT, fs.statSync(OUT).size, 'bytes');
    sock.close();
  } catch (e) {
    console.error(e); process.exitCode = 1;
  } finally {
    browser.kill(); server.close();
  }
});

#!/usr/bin/env node
// Rendu PNG des visuels de posts à partir de post.html (Chrome sans interface, polices du dépôt en file://).
//
// Usage : node docs/marketing/posts-2026-10/fr/render.mjs docs/marketing/posts-2026-10/fr/visuels.json
//   specs.json : un objet ou un tableau d'objets { "id": "it-A", "formats": ["square", "wide"], ...paramètres de post.html }
//   (lang, theme, tone, badge, title, sub, cta, url, ai, a1…a3s, photo, p1, p2, voices, langs, n1, l1, n2, l2, checks).
//   Sortie : <dossier>/<id>-carre.png (1080×1080) et <id>-linkedin.png (1200×627) (par défaut : dossier du fichier specs).
//   Copie du gabarit commun (../gabarit/) : seul le nom des fichiers de sortie change.
// Chaque rendu est contrôlé : dimensions exactes, fichier non vide, polices du site chargées (sinon arrêt en erreur).
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, statSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const TEMPLATE = join(dirname(fileURLToPath(import.meta.url)), 'post.html');
const SIZES = { square: [1080, 1080], wide: [1200, 627] };
const SUFFIX = { square: 'carre', wide: 'linkedin' };

const [specPath, outArg] = process.argv.slice(2);
if (!specPath) { console.error('Usage : node render.mjs <specs.json> [dossier-de-sortie]'); process.exit(2); }
const specs = [].concat(JSON.parse(readFileSync(specPath, 'utf8')));
const outDir = resolve(outArg || dirname(specPath));
mkdirSync(outDir, { recursive: true });
const profile = mkdtempSync(join(tmpdir(), 'post-render-'));

function chrome(args) {
  return execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--user-data-dir=${profile}`, '--virtual-time-budget=4000', ...args],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 32 * 1024 * 1024 });
}

function pngSize(file) {
  const b = readFileSync(file);
  if (b.toString('ascii', 1, 4) !== 'PNG') throw new Error(`${file} n'est pas un PNG`);
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}

let failed = 0;
try {
  for (const spec of specs) {
    const { id, formats = ['square', 'wide'], ...params } = spec;
    if (!id) throw new Error('Chaque spec doit avoir un "id".');
    for (const format of formats) {
      const [w, h] = SIZES[format];
      const url = pathToFileURL(TEMPLATE);
      for (const [k, v] of Object.entries({ ...params, format })) url.searchParams.set(k, String(v));
      // 1. Contrôle des polices : le gabarit écrit data-fonts="ok | …" sur <html> une fois les polices chargées.
      const dom = chrome([`--window-size=${w},${h}`, '--dump-dom', url.href]);
      const fonts = (dom.match(/data-fonts="([^"]*)"/) || [])[1] || 'absent';
      // 2. Capture.
      const out = join(outDir, `${id}-${SUFFIX[format]}.png`);
      chrome([`--window-size=${w},${h}`, `--screenshot=${out}`, url.href]);
      const [pw, ph] = pngSize(out);
      const kb = Math.round(statSync(out).size / 1024);
      const ok = pw === w && ph === h && kb > 40 && fonts.startsWith('ok');
      if (!ok) failed++;
      console.log(`${ok ? 'OK ' : 'ERR'} ${out} ${pw}x${ph} ${kb} Ko — polices : ${fonts.split(' | ')[0]}${ok ? '' : ` (${fonts})`}`);
    }
  }
} finally {
  rmSync(profile, { recursive: true, force: true });
}
process.exit(failed ? 1 : 0);

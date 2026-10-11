// Compila la app: JS (React + código) + CSS (Tailwind) → un solo index.html,
// y genera sw.js con la lista de archivos y una versión única.
//   Uso:  npm install && npm run build      (resultado en /dist)
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const esbuild = await import(process.env.ESBUILD_PATH || 'esbuild');
const dist = 'dist';
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.mkdirSync('.build', { recursive: true });

// 1) JavaScript
const js = await esbuild.build({
  entryPoints: ['src/app.jsx'],
  bundle: true,
  minify: true,
  write: false,
  format: 'iife',
  target: ['es2020'],
  jsx: 'automatic',
  loader: { '.js': 'jsx' },
  legalComments: 'none',
  define: { 'process.env.NODE_ENV': '"production"' },
  nodePaths: process.env.NODE_PATH ? process.env.NODE_PATH.split(':') : [],
});
const jsText = js.outputFiles[0].text;
if (/<\/script/i.test(jsText.replace(/<\\\/script/gi, ''))) throw new Error('El JS contiene </script');

// 2) CSS (Tailwind v3)
const tw = process.env.TAILWIND_CLI;
const twArgs = ['-c', 'tailwind.config.js', '-i', 'src/styles.css', '-o', '.build/tw.css', '--minify'];
if (tw) execFileSync('node', [tw, ...twArgs], { stdio: 'inherit' });
else execFileSync('npx', ['tailwindcss', ...twArgs], { stdio: 'inherit' });
const cssText = fs.readFileSync('.build/tw.css', 'utf8');


// 3) HTML
let html = fs.readFileSync('index.template.html', 'utf8');
html = html.replace('/*__CSS__*/', () => cssText).replace('/*__JS__*/', () => jsText);
fs.writeFileSync(path.join(dist, 'index.html'), html);

// 4) Archivos estáticos
fs.cpSync('public', dist, { recursive: true });

// 5) Service worker con lista de precarga + versión (hash del contenido)
const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]
  );
const files = walk(dist).map((f) => path.relative(dist, f).split(path.sep).join('/')).sort();
const hash = createHash('sha256');
files.forEach((f) => hash.update(f).update(fs.readFileSync(path.join(dist, f))));
const version = hash.digest('hex').slice(0, 10);
const precache = ['./', ...files.map((f) => './' + f)];
const sw = fs
  .readFileSync('sw.template.js', 'utf8')
  .replace('__VERSION__', version)
  .replace('__PRECACHE__', JSON.stringify(precache, null, 2));
fs.writeFileSync(path.join(dist, 'sw.js'), sw);

const kb = (n) => (n / 1024).toFixed(0) + ' KB';
console.log(`\n✔ Build ${version}`);
console.log('  index.html', kb(fs.statSync(path.join(dist, 'index.html')).size));
console.log('  archivos precargados:', precache.length);

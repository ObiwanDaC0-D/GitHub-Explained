import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const base = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, base), 'utf8');
const html = read('index.html');
const js = read('assets/app.js');
const css = read('assets/styles.css');

assert.ok(html.includes('<script src="assets/app.js" defer></script>'), 'App script must be linked');
assert.ok(html.includes('<link rel="stylesheet" href="assets/styles.css">'), 'Stylesheet must be linked');
assert.ok(!html.includes('<script>'), 'No inline app script should remain');
assert.ok(!html.includes('<style>'), 'No inline stylesheet should remain');
new vm.Script(js, { filename: 'assets/app.js' });

const sections = ['learn','workflow','simulator','quiz','path','visual','scenarios','terminal','reference'];
for (const id of sections) {
  assert.ok(html.includes('id="'+id+'"'), 'Missing section: '+id);
  assert.ok(html.includes('data-tab="'+id+'"'), 'Missing navigation: '+id);
}
const referencedIds = [...js.matchAll(/(?:getElementById\(|\$\()\s*["']([^"']+)["']/g)].map(m=>m[1]);
for (const id of new Set(referencedIds)) {
  assert.ok(html.includes('id="'+id+'"'), 'JavaScript references missing DOM id: '+id);
}
assert.ok(js.includes('lab.remote["feature/tuner"]<lab.history.filter'), 'Merge must reject unpublished feature commits');
assert.ok(js.includes('if(sim.edited||sim.staged)'), 'Simulator must reject merge with pending changes');
assert.ok(js.includes('lab.merged?"git push"'), 'Hints should handle completed merge');
assert.ok(html.includes('aria-live="polite"'), 'Status feedback should be announced');
assert.ok(css.includes('@media'), 'Responsive CSS should be present');
assert.ok(existsSync(new URL('.github/workflows/verify.yml', base)), 'CI workflow must exist');
console.log('PASS: linked assets, JavaScript syntax, nine sections, DOM references, safeguards, responsive CSS and CI.');

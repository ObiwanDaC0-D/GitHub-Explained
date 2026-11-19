import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const base = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, base), 'utf8');
const html = read('index.html');
const js = read('assets/app.js');
const css = read('assets/styles.css');
const engine = read('assets/git-simulator.js');

assert.ok(html.includes('<script src="assets/app.js" defer></script>'), 'App script must be linked');
assert.ok(html.indexOf('assets/git-simulator.js')<html.indexOf('assets/app.js'), 'Simulator engine must load before UI');
assert.ok(html.includes('<link rel="stylesheet" href="assets/styles.css">'), 'Stylesheet must be linked');
assert.ok(!html.includes('<script>'), 'No inline app script should remain');
assert.ok(!html.includes('<style>'), 'No inline stylesheet should remain');
new vm.Script(js, { filename: 'assets/app.js' });
new vm.Script(engine, { filename: 'assets/git-simulator.js' });

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
assert.ok(engine.includes('s.edited||s.staged'), 'Simulator must reject merge with pending changes');
assert.ok(js.includes('lab.merged?"git push"'), 'Hints should handle completed merge');
assert.ok(html.includes('aria-live="polite"'), 'Status feedback should be announced');
assert.ok(css.includes('@media'), 'Responsive CSS should be present');
assert.ok(existsSync(new URL('.github/workflows/verify.yml', base)), 'CI workflow must exist');
console.log('PASS: linked assets, JavaScript syntax, nine sections, DOM references, safeguards, responsive CSS and CI.');

const context=vm.createContext({});vm.runInContext(engine+'\nthis.testApi={initialState,transition}',context);
let state=context.testApi.initialState();
const step=(action)=>{const result=context.testApi.transition(state,action);state=result.state;return result.message;};
assert.match(step('commit'),/Clone/);
step('clone');step('branch');step('edit');step('stage');step('commit');
assert.equal(state.local,1);
assert.equal(state.staged,false);
assert.match(step('merge'),/Push/);
step('push');step('merge');assert.equal(state.merged,true);
assert.equal(state.branch,'main');
assert.match(step('edit'),/feature branch/);
state=context.testApi.initialState();step('clone');step('branch');step('edit');step('stage');
assert.match(step('merge'),/pending edits/);
console.log('PASS: Guided simulator state transition regression tests.');

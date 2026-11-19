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
assert.ok(html.includes('id="visMode"'), 'Visual Lab mode toggle should exist');
assert.ok(js.includes('syncLabVisual()'), 'Command Lab must update Visual Lab');
assert.ok(css.includes('@media'), 'Responsive CSS should be present');
assert.ok(existsSync(new URL('.github/workflows/verify.yml', base)), 'CI workflow must exist');
console.log('PASS: linked assets, JavaScript syntax, nine sections, DOM references, safeguards, responsive CSS and CI.');

const context=vm.createContext({});vm.runInContext(engine+'\nthis.testApi={initialState,transition,timelineFromLab,graphFromLab}',context);
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

const timeline=context.testApi.timelineFromLab;
assert.equal(timeline({cloned:false}).step,0);
const lab={cloned:true,branches:['main'],history:[],remote:{},merged:false};
assert.equal(timeline(lab).step,0);
lab.branches.push('feature/tuner');assert.equal(timeline(lab).step,1);
lab.history.push({branch:'feature/tuner'});assert.equal(timeline(lab).step,2);
lab.remote['feature/tuner']=1;assert.equal(timeline(lab).step,3);
lab.merged=true;assert.equal(timeline(lab).step,4);
console.log('PASS: Command Lab to Visual Lab timeline stage mapping.');

const graph=context.testApi.graphFromLab;
assert.equal(graph({cloned:false}).nodes.length,0);
const model={cloned:true,branch:'feature/tuner',branches:['main','feature/tuner'],history:[{branch:'feature/tuner',message:'Tuner'},{branch:'feature/tuner',message:'Fix'}],remote:{main:0,'feature/tuner':1},merged:false};
let g=graph(model);assert.equal(g.nodes.length,3);assert.equal(g.heads['feature/tuner'],'c2');assert.equal(g.remoteHeads['feature/tuner'],'c1');
model.merged=true;g=graph(model);assert.equal(g.heads.main,'c2');assert.equal(g.nodes.length,3); // Fast-forward has no synthetic merge commit
assert.equal(g.nodes.find(n=>n.id==='c2').parents[0],'c1');
const divergent={...model,history:[{branch:'main',message:'Main update'},{branch:'feature/tuner',message:'Feature update'}],remote:{main:0,'feature/tuner':1}};
const merged=graph(divergent);assert.equal(merged.heads.main,'merge');assert.equal(merged.nodes.find(n=>n.id==='merge').parents.length,2);assert.equal(merged.edges.filter(e=>e.type==='merge').length,2);
assert.ok(html.includes('id="commitGraph"'));assert.ok(js.includes('renderCommitGraph()'));
console.log('PASS: Commit graph nodes, branch heads, remote heads and merge edges.');

import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'Application script must exist');
new vm.Script(script,{filename:'index.html inline script'});
const sections=['learn','workflow','simulator','quiz','path','visual','scenarios','terminal','reference'];
for(const id of sections){
 assert.ok(html.includes('id="'+id+'"'),'Missing section: '+id);
 assert.ok(html.includes('data-tab="'+id+'"'),'Missing navigation: '+id);
}
assert.ok(html.includes('lab.remote["feature/tuner"]<lab.history.filter'),'Merge must check unpublished commits');
assert.ok(html.includes('if(sim.edited||sim.staged)'),'Simulator must reject merge with pending changes');
assert.ok(html.includes('lab.merged?"git push"'),'Hints should handle completed merge');
assert.ok(html.includes('git push -u origin '),'Feature branch push command should be present');
assert.ok(html.includes('aria-live="polite"'),'Status feedback should be announced');
console.log('PASS: JavaScript syntax, nine sections, navigation, key simulator safeguards, and status feedback.');

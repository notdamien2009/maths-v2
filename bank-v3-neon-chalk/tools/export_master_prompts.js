#!/usr/bin/env node
/**
 * Read-only evaluation of the planning-data/function prefix of NOVA's canonical
 * master; generates the portable prompts from the SAME functions the master uses.
 * Never executes any browser rendering or touches Git/GitHub.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const src = path.join(root, '00-master', 'nova-master.html');
const dest = path.join(root, '00-master', 'NOVA-MASTER-FOR-OTHER-AI.md');
const html = fs.readFileSync(src, 'utf8');
const marker = '<script>var D=';
const begin = html.indexOf(marker);
if (begin < 0) throw new Error('Cannot locate canonical planning data in master');
const scriptEnd = html.indexOf('</script>', begin);
if (scriptEnd < 0) throw new Error('Master planning script is not closed');
const fullScript = html.slice(begin + '<script>'.length, scriptEnd);
// The first UI method begins after the pure planning/prompt functions.
const end = fullScript.indexOf('function asBlock(');
if (end < 0) throw new Error('Cannot find expected end of master prompt definitions');
const definitions = fullScript.slice(0, end);
const sandbox = {localStorage: {getItem: () => null}, console};
const model = vm.runInNewContext(definitions + '\n({D,LS,AS,AL,pa,pf,pc,pl})', sandbox, {timeout: 30000, filename:'nova-master-planning.js'});
if (!Array.isArray(model.D) || model.D.length !== 19 || !Array.isArray(model.LS) || model.LS.length !== 202 || !Array.isArray(model.AS) || model.AS.length !== 18) {
  throw new Error('Unexpected master family / lesson / assessment counts: refusing generation');
}
const hash = crypto.createHash('sha256').update(html, 'utf8').digest('hex');
const output = [];
output.push('# NOVA KS3 Maths — generated portable production prompts');
output.push('');
output.push('<!-- GENERATED FROM: 00-master/nova-master.html -->');
output.push(`<!-- SOURCE_SHA256: ${hash} -->`);
output.push('<!-- DO NOT EDIT: run node tools/export_master_prompts.js after changing the canonical HTML. -->');
output.push('');
output.push('The HTML master is the only editable production specification. This is its generated copy.');
output.push('Fraction notation is LOCKED: traditional stacked numerator / horizontal bar / denominator in NOVA Chalk. See F5/F5-FRACTION-NOTATION-LOCK.md.');
output.push('Helper artwork is core-native, not a requirement for nonexistent external pose-pack files. See assets/helpers/registry.json.');
output.push('');
for (const family of model.D) {
  const id = family[0];
  output.push(`# Family ${id}: ${family[1]}`, '', '## Family run prompt', '', model.pf(family), '');
  for (let index=0; index<family[3].length; index++) {
    const engine = `${id}-${String(index+1).padStart(2,'0')}`;
    output.push(`## ${engine} ${family[3][index]}`, '', model.pc(engine), '');
  }
}
output.push('# Lesson visual manifests', '');
for (const l of model.LS) output.push(`## ${l[0]} ${l[1]}`, '', model.pl(l[0]), '');
output.push('# Assessment briefs', '');
for (const a of model.AS) output.push(`## ${a[0]}`, '', model.pa(a), '');
const result = output.join('\n').replace(/\n{4,}/g, '\n\n\n') + '\n';
if (process.argv.includes('--check')) {
  if (!fs.existsSync(dest) || fs.readFileSync(dest, 'utf8') !== result) {
    console.error('OUT OF SYNC: portable prompts must be regenerated from the HTML master');
    process.exitCode = 1;
  } else console.log('PASS: portable prompts exactly match master SHA256 '+hash);
} else {
  fs.writeFileSync(dest, result, 'utf8');
  console.log(`Exported ${model.D.length} families, ${model.LS.length} lessons, ${model.AS.length} assessments -> ${dest}`);
}

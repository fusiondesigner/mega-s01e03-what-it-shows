import fs from 'node:fs';
import assert from 'node:assert/strict';
import {uniqueById, groupByCause, sameCause} from '../src/lib/kb/causes.ts';
const raw=JSON.parse(fs.readFileSync('src/lib/data/reports-4471.json'));
const tenants=fs.readdirSync('src/lib/data/tenants').map(f=>JSON.parse(fs.readFileSync('src/lib/data/tenants/'+f)));
const tenantOf=r=>tenants.find(t=>t.handle===r.tenant);
const unique=uniqueById(raw); const merged=unique.filter(r=>r.mergedInto===4471);
const groups=groupByCause(merged,tenantOf);
assert.equal(raw.length,427);assert.equal(unique.length,412);
assert.deepEqual(groups.map(g=>[g.cause,g.reports.length]),[['parser',379],['hint',33]]);
assert.equal(new Set(groups.flatMap(g=>g.reports.map(r=>r.id))).size,412);
// Independently recompute the partition from explicit tenant configuration.
const independent={parser:0,hint:0};for(const r of merged){const t=tenantOf(r);assert(t);const date=new Intl.DateTimeFormat(t.locale).formatToParts(new Date('2026-01-02T12:00:00Z'));assert(date.findIndex(p=>p.type==='day')<date.findIndex(p=>p.type==='month'));independent[r.channel==='form'&&t.form==='booking-v3'?'hint':'parser']++;}
assert.deepEqual(independent,{parser:379,hint:33});
assert.equal(sameCause({channel:'form'},tenantOf({tenant:'alder.physio'}),{channel:'app'},tenantOf({tenant:'alder.physio'})),false);
assert.equal(sameCause({channel:'email'},undefined,{channel:'email'},undefined),false);
for(const g of groups){
 const parser=g.cause==='parser';
 const title=parser?'Shared month-first parser misreads day-first tenant dates — 379 reports':'Booking-v3 MM/DD/YYYY hint conflicts with tenant date order — 33 reports';
 const body=`# ${title}\n\nSplit from course ticket #4471. Snapshot: October 4, 2026.\n\n## Problem and scope\n\n${parser?'The shared parser reads dates month first for day-first tenants. A date such as 5 March becomes 3 May. This group spans app/email paths and form paths not classified as the booking-v3 hint problem.':'On booking-v3 form submissions for day-first tenants, the hint asks for MM/DD/YYYY but the form interprets input using the tenant order. This is a separate UI/input contract failure from the shared parser.'}\n\n**Report count: ${g.reports.length} unique reports**, across ${g.tenants} tenants. Received ${g.firstSeen} through ${g.lastSeen}.\n\n## Evidence and counting\n\nExecute \`node scripts/analyze.mjs\` from the repository root. Deduplicate the overlapping export by report ID, filter mergedInto=4471, join tenant configuration, and run causes.ts. Browser locale, subject and intakeTag are not authoritative. There are 427 raw rows and 412 distinct IDs. The two tickets partition all 412 reports without overlap.\n\nIntake labels in this group: ${JSON.stringify(g.taggedAs)}.\n\n${parser?'Five flagged reports (R-41202, R-41209, R-41236, R-41344, R-41620) remain in this count under the supplied classifier. Their unusual timing/one-day symptoms need investigation; do not assert a confirmed month/day swap or time-zone diagnosis for them.':'Affected tenant handles: '+[...new Set(g.reports.map(r=>r.tenant))].join(', ')+'.'}\n\n## Proposed acceptance checks\n\n${parser?'- Parse representative unambiguous and ambiguous day-first dates according to tenant locale; preserve month-first behavior where applicable.\n- Verify the resulting booking, invite and reminder date on affected channels.\n- Investigate the five anomalous reports using original timestamps and booking records.':'- Make the displayed hint and form parser agree for each supported tenant locale.\n- Reproduce with day/month values both at most 12, then verify stored and displayed dates.\n- Cover all affected booking-v3 tenants and ensure booking-v2 behavior remains correct.'}\n- Reconcile fresh desk reports before changing counts; this export is not the live queue.\n- Record verified fixes; no product fix or deployment is claimed here.\n\n## Report IDs\n\n${g.reports.map(r=>r.id).join(', ')}\n`;
 fs.writeFileSync(`drafts/${g.cause}.md`,body);
}
fs.writeFileSync('drafts/counts.json',JSON.stringify({raw:raw.length,unique:unique.length,groups:groups.map(g=>({...g,reports:g.reports.map(r=>r.id)}))},null,2)+'\n');
console.log('PASS: deduplication, independent counts, complete non-overlapping partition and dedupe counterexamples.');

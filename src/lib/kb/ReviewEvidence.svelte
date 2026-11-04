<script lang="ts">
 import reports from '#lib/data/reports-4471.json';
 import notes from '#lib/data/desk-notes.json';
 import { uniqueById, groupByCause, type Report } from '#lib/kb/causes';
 import {tenantOf} from '#lib/kb/locales';
 const unique=uniqueById(reports as Report[]);
 const merged=unique.filter(r=>r.mergedInto===4471);
 const groups=groupByCause(merged,tenantOf);
 const mismatches=groups.reduce((sum,g)=>sum+g.reports.filter(r=>r.meta.intakeTag!==g.cause).length,0);
 const anomalies=merged.filter(r=>notes.oneDayMove.includes(r.id));
 const beforeJuly=merged.filter(r=>r.receivedAt.slice(0,10)<'2026-07-01').length;
 const firstMerge=merged.map(r=>r.mergedAt).filter(Boolean).sort()[0];
</script>
<p>The export contains <strong>{reports.length}</strong> rows, <strong>{unique.length}</strong> unique report IDs and <strong>{reports.length-unique.length}</strong> overlapping rows. All unique reports belong to #4471. Tenant locale and form version, plus report channel, determine the classification; intake tags disagree on <strong>{mismatches}</strong> reports.</p>
<p><strong>{beforeJuly}</strong> reports arrived before July. The first merge is <strong>{firstMerge}</strong>. The merge spike records desk activity, not the onset of the problem.</p>
<h2>Reports requiring a separate investigation</h2>
<p>These <strong>{anomalies.length}</strong> reports remain included in the parser count by the supplied classification. Their bodies do not establish a month/day swap. Investigate their timestamps, time zones and original booking records before deciding whether to split another cause. Do not count them twice.</p>
<ul>{#each anomalies as r}<li><code>{r.id}</code>: {r.body}</li>{/each}</ul>
<h2>Auditable membership</h2>
{#each groups as g}<details><summary>{g.cause}: {g.reports.length} report IDs</summary><p>{g.reports.map(r=>r.id).join(', ')}</p></details>{/each}

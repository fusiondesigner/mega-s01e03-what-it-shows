# Booking-v3 MM/DD/YYYY hint conflicts with tenant date order — 33 reports

Split from course ticket #4471. Snapshot: October 4, 2026.

## Problem and scope

On booking-v3 form submissions for day-first tenants, the hint asks for MM/DD/YYYY but the form interprets input using the tenant order. This is a separate UI/input contract failure from the shared parser.

**Report count: 33 unique reports**, across 3 tenants. Received 2026-04-17 through 2026-09-22.

## Evidence and counting

Execute `node scripts/analyze.mjs` from the repository root. Deduplicate the overlapping export by report ID, filter mergedInto=4471, join tenant configuration, and run causes.ts. Browser locale, subject and intakeTag are not authoritative. There are 427 raw rows and 412 distinct IDs. The two tickets partition all 412 reports without overlap.

Intake labels in this group: {"parser":15,"hint":18}.

Affected tenant handles: copper.studio, alder.physio, pale.harbour.

## Proposed acceptance checks

- Make the displayed hint and form parser agree for each supported tenant locale.
- Reproduce with day/month values both at most 12, then verify stored and displayed dates.
- Cover all affected booking-v3 tenants and ensure booking-v2 behavior remains correct.
- Reconcile fresh desk reports before changing counts; this export is not the live queue.
- Record verified fixes; no product fix or deployment is claimed here.

## Report IDs

R-41230, R-41241, R-41251, R-41259, R-41262, R-41275, R-41294, R-41305, R-41308, R-41366, R-41372, R-41384, R-41387, R-41396, R-41400, R-41406, R-41415, R-41416, R-41418, R-41428, R-41439, R-41441, R-41449, R-41453, R-41456, R-41460, R-41472, R-41485, R-41493, R-41539, R-41572, R-41582, R-41584

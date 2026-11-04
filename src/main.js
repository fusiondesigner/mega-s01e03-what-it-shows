import { mount, hydrate } from 'svelte';
const pages=import.meta.glob('./routes/**/+page.svx');
const key=`./routes${location.pathname.replace(/\/index\.html$/,'').replace(/\/$/,'') || '/kb'}/+page.svx`;
const page=await (pages[key]||pages['./routes/kb/decisions/0002-dedupe-by-cause/+page.svx'])();
const target=document.getElementById('app');
(target.hasChildNodes()?hydrate:mount)(page.default,{target});

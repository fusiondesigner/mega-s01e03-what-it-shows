import { render } from 'svelte/server';
import fs from 'node:fs';
import path from 'node:path';
const pages=import.meta.glob('/src/routes/**/+page.svx',{eager:true});
fs.mkdirSync('rendered',{recursive:true});
fs.cpSync('dist/assets','rendered/assets',{recursive:true});
const script=fs.readFileSync('dist/index.html','utf8').match(/<script[^>]*src="([^"]+)"/)[1];
const styles=fs.readdirSync('dist/assets').filter(f=>f.endsWith('.css')).map(f=>fs.readFileSync(`dist/assets/${f}`,'utf8')).join('\n');
for(const [file,page] of Object.entries(pages)){
 const route=file.replace('/src/routes','').replace('/+page.svx','');
 const result=render(page.default);
 const dir=`rendered${route}`; fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,'index.html'),`<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${result.head}<style>${styles}</style></head><body><div id="app">${result.body}</div><script type="module" src="${script}"></script></body></html>`);
}
console.log(`Rendered ${Object.keys(pages).length} KB pages with original Svelte components.`);

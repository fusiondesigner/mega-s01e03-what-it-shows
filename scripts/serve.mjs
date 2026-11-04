import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('rendered');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css'};
http.createServer((req,res)=>{let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403).end();return;}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!fs.existsSync(file)){res.writeHead(404).end();return;}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);}).listen(4173,'127.0.0.1',()=>console.log('Rendered KB: http://127.0.0.1:4173/kb/decisions/0002-dedupe-by-cause/'));

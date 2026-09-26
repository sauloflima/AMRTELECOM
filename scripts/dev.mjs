import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stat } from 'node:fs/promises';
import { createReadStream, watch } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { hostingHeaders } from './security.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
const preview=process.argv.includes('--preview');
if(!preview)execFileSync(process.execPath,[path.join(root,'scripts/build.mjs')],{stdio:'inherit'});
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.mp4':'video/mp4','.webm':'video/webm','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
const server=http.createServer(async(req,res)=> {
  try{
    const url=new URL(req.url,'http://localhost');
    const relative=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);
    const file=path.resolve(dist,'.'+relative);
    if(!file.startsWith(dist+path.sep)){res.writeHead(403);res.end('Acesso negado');return;}
    const info=await stat(file);
    if(!info.isFile())throw new Error('not found');
    const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache',...hostingHeaders,'Accept-Ranges':'bytes'};
    const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if(range){const start=Number(range[1]);const end=Math.min(range[2]?Number(range[2]):info.size-1,info.size-1);if(start>end){res.writeHead(416,{'Content-Range':`bytes */${info.size}`});res.end();return;}res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${info.size}`,'Content-Length':end-start+1});if(req.method==='HEAD')res.end();else createReadStream(file,{start,end}).pipe(res);return;}
    res.writeHead(200,{...headers,'Content-Length':info.size});if(req.method==='HEAD')res.end();else createReadStream(file).pipe(res);
  }catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Página não encontrada.');}
});
const port=Number(process.env.PORT || 4173);
const host=process.env.HOST || '127.0.0.1';
server.listen(port,host,()=>console.log(`AMR Telecom: http://${host}:${port}`));
if(!preview){let timer;watch(path.join(root,'src'),{recursive:true},()=>{clearTimeout(timer);timer=setTimeout(()=>{try{execFileSync(process.execPath,[path.join(root,'scripts/build.mjs')],{stdio:'inherit'});}catch{console.error('Falha no build. Corrija o arquivo indicado e salve novamente.');}},150);});}

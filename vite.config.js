import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import path from 'node:path';
export default defineConfig({
 plugins: [svelte({extensions:['.svelte','.svx'],preprocess:mdsvex({extensions:['.svx'],layout:{runbook:path.resolve('src/lib/layouts/runbook.svelte')}})})],
 resolve:{alias:{'#lib':path.resolve('src/lib')}},
 build:{outDir:'dist',rollupOptions:{input:'index.html'}}
});

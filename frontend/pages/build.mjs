import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const publicDirectory = new URL('../public/', import.meta.url);
const outputDirectory = new URL('../../docs/', import.meta.url);
await mkdir(outputDirectory, { recursive: true });
await cp(new URL('assets/', publicDirectory), new URL('assets/', outputDirectory), { recursive: true });
await cp(new URL('favicon.ico', publicDirectory), new URL('favicon.ico', outputDirectory));

const html = (await readFile(new URL('index.html', publicDirectory), 'utf8'))
    .replaceAll('src="/', 'src="./')
    .replaceAll('href="/', 'href="./')
    .replace('View, search, edit, or remove products from your catalog.', 'Explore and search the sample Putahe menu.')
    .replace(/<script>\s*window\.PUTAHE_API_URL = '';\s*<\/script>/, '')
    .replace(/[ \t]+$/gm, '');

const css = await readFile(new URL('style.css', publicDirectory), 'utf8');
const disabledButtonCss = '\nbutton:disabled{opacity:.5;cursor:not-allowed}\n';

await writeFile(new URL('index.html', outputDirectory), html);
await writeFile(new URL('style.css', outputDirectory), css + disabledButtonCss);
await cp(new URL('preview.js', import.meta.url), new URL('script.js', outputDirectory));
await writeFile(new URL('.nojekyll', outputDirectory), '');
console.log(`Read-only GitHub Pages preview built at ${fileURLToPath(outputDirectory)}`);

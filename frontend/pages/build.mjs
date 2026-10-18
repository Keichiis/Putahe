import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const publicDirectory = new URL('../public/', import.meta.url);
const outputDirectory = new URL('../../docs/', import.meta.url);
await mkdir(outputDirectory, { recursive: true });
await cp(new URL('assets/', publicDirectory), new URL('assets/', outputDirectory), { recursive: true });
await cp(new URL('favicon.ico', publicDirectory), new URL('favicon.ico', outputDirectory));

const notice = '<aside class="preview-notice" role="note"><strong>Frontend preview</strong><span>Sample products only. Editing and database features are available in the local Laravel app.</span><a href="https://github.com/Keichiis/Putahe#local-backend-setup">Source code &amp; local setup</a></aside>';
const html = (await readFile(new URL('index.html', publicDirectory), 'utf8'))
    .replaceAll('src="/', 'src="./')
    .replaceAll('href="/', 'href="./')
    .replace('</header>', `</header>\n${notice}`)
    .replace('View, search, edit, or remove products from your catalog.', 'Explore and search the sample Putahe menu.')
    .replace(/<script>\s*window\.PUTAHE_API_URL = '';\s*<\/script>/, '')
    .replace(/[ \t]+$/gm, '');

const css = await readFile(new URL('style.css', publicDirectory), 'utf8');
const previewCss = '\n.preview-notice{display:flex;align-items:center;flex-wrap:wrap;gap:8px 18px;max-width:1200px;margin:18px auto 0;padding:14px 20px;background:#fff5dc;border:1px solid #e7d4ad;border-radius:10px;color:#5e3227;font-size:13px}.preview-notice a{color:#9d1718;font-weight:600}.preview-notice span{flex:1;min-width:220px}button:disabled{opacity:.5;cursor:not-allowed}@media(max-width:1240px){.preview-notice{margin-left:20px;margin-right:20px}}\n';

await writeFile(new URL('index.html', outputDirectory), html);
await writeFile(new URL('style.css', outputDirectory), css + previewCss);
await cp(new URL('preview.js', import.meta.url), new URL('script.js', outputDirectory));
await writeFile(new URL('.nojekyll', outputDirectory), '');
console.log(`Read-only GitHub Pages preview built at ${fileURLToPath(outputDirectory)}`);

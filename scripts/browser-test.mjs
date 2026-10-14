import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(path.join(process.env.AMR_PLAYWRIGHT_ROOT || process.cwd(), 'package.json'));
export const { chromium } = require('playwright');
export const origin = (process.env.AMR_ORIGIN || 'http://127.0.0.1:4173').replace(/\/$/, '');

// Só captura páginas locais de teste; não exporta cookies ou estado de autenticação.
export async function reportFailure(browser, error) {
  const dir = process.env.AMR_BROWSER_EVIDENCE || 'output/playwright';
  const name = path.basename(process.argv[1], '.mjs');
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `${name}-failure.txt`), String(error.stack || error));
  let index = 0;
  for (const context of browser.contexts()) {
    for (const page of context.pages()) {
      if (!page.url().startsWith(origin + '/')) continue;
      await page.screenshot({ path: path.join(dir, `${name}-failure-${index++}.png`), timeout: 5000 }).catch(() => {});
    }
  }
}

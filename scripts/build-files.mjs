import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { config } from '../src/config.mjs';
import { heroAssets } from '../src/components/hero.mjs';
import { homeAssets } from '../src/components/home-sections.mjs';
import { supportAvatar } from '../src/components/support-assistant.mjs';
import { customerAvatar } from '../src/components/customer.mjs';

// Lista explícita compartilhada pelo build e pelo verificador; nunca copiar src/ inteiro.
export const browserModules = [
  'client.mjs', 'config.mjs', 'lib/whatsapp.mjs', 'lib/carousel.mjs',
  'lib/hero-video.mjs', 'lib/support-assistant.mjs',
  'client/navigation.mjs', 'client/contact.mjs', 'client/media.mjs',
];
export const stylesheets = ['styles.css', 'home-refresh.css', 'support-assistant.css'];
export const mediaAssets = [...new Set([
  config.brand.logo, config.brand.logoLight, config.brand.favicon,
  ...heroAssets, ...homeAssets, supportAvatar, customerAvatar,
  '/assets/generated/amr-empresas-equipe.jpg',
])];

export async function assetRevision(root) {
  const hash = createHash('sha256');
  for (const file of [...stylesheets, ...browserModules].map(file => `src/${file}`)) {
    hash.update(file).update('\0').update(await readFile(path.join(root, file))).update('\0');
  }
  return hash.digest('hex').slice(0, 16);
}

export function versionImports(source, revision) {
  // ponytail: cobre imports estáticos em uma linha; ampliar junto com o teste se o grafo adotar outra sintaxe.
  return source.replace(/^(\s*import\s+[^;\n]*?\sfrom\s+['"])(\.[^'"]+)(['"])/gm, `$1$2?v=${revision}$3`);
}

import { access, cp, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const burasi = dirname(fileURLToPath(import.meta.url));
const kaynak = resolve(burasi, '..', 'out');
const hedef = resolve(burasi, '..', '..', 'qr');

try {
  await access(kaynak);
} catch {
  console.error(`Build ciktisi bulunamadi: ${kaynak}`);
  console.error('Once "npm run build" calistirin.');
  process.exit(1);
}

await rm(hedef, { recursive: true, force: true });
await cp(kaynak, hedef, { recursive: true });
console.log(`Kopyalandi: ${kaynak} -> ${hedef}`);

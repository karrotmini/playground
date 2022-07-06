/* eslint-env node */

import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { parse } from 'graphql';

const { 2: baseFile } = process.argv;
if (!baseFile) {
  throw new Error('SDL path is required');
}

const dir = path.dirname(baseFile);
const basename = path.basename(baseFile, '.graphql');
const targetPath = path.join(dir, `${basename}.ts`);

const source = await fs.readFile(
  baseFile,
  'utf-8',
);

const ast = parse(source);

await fs.writeFile(
  targetPath,
  `/* eslint-disable */
import type { DocumentNode } from 'graphql';

const typeDefs: DocumentNode = JSON.parse(\`${JSON.stringify(ast)}\`);
export default typeDefs;`,
  'utf-8',
);

/* eslint-env node */

import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { parse } from 'graphql';

const generatedPath = path.resolve(
  process.cwd(),
  'src/application/__generated__',
);

const source = await fs.readFile(
  path.join(generatedPath, 'schema.graphql'),
  'utf-8',
);

const ast = parse(source);
await fs.writeFile(
  path.join(generatedPath, 'schema.ts'),
  `/* eslint-disable */
import type { DocumentNode } from 'graphql';
export const typeDefs: DocumentNode = JSON.parse(\`${JSON.stringify(ast)}\`);`,
  'utf-8',
);

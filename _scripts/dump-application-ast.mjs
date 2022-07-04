/* eslint-env node */

import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { parse } from 'graphql';

const applicationPath = path.resolve(
  process.cwd(),
  'playground-application/src',
);

const generatedPath = path.resolve(
  applicationPath,
  '__generated__',
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

const typeDefs: DocumentNode = JSON.parse(\`${JSON.stringify(ast)}\`);
export default typeDefs;`,
  'utf-8',
);

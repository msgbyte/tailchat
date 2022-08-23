import { parse, ParserPlugin } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import template from '@babel/template';
import type { Comment } from '@babel/types';
import { program, isFunctionDeclaration } from '@babel/types';
import fs from 'fs-extra';
import _ from 'lodash';

export * from './tsgenerator';

const babelPlugins: ParserPlugin[] = ['jsx', 'typescript'];
const buildNamedExport = template('export function %%name%%(): any', {
  plugins: babelPlugins,
});

interface Options {
  entryPath: string;
  // targetPath: string; // TODO
}
export async function generateFunctionDeclare(options: Options) {
  const sourcecode = await fs.readFile(options.entryPath, 'utf8');

  const exported = getSourceCodeExportedFunction(sourcecode);

  const astList = exported.map((e) => {
    return buildNamedExport({
      name: e.name,
    });
  });

  const code = generate(program(_.flatten(astList))).code;

  return code;
}

interface ExportedItem {
  name: string;
  comments?: string;
}
function getSourceCodeExportedFunction(sourcecode: string): ExportedItem[] {
  const ast = parse(sourcecode, {
    sourceType: 'module',
    plugins: babelPlugins,
  });

  const exported: ExportedItem[] = [];

  traverse(ast, {
    ExportNamedDeclaration({ node }) {
      if (node.declaration) {
        if (isFunctionDeclaration(node.declaration)) {
          const name = node.declaration.id?.name;
          if (typeof name === 'string') {
            exported.push({
              name,
              comments: getCommentStr(node.leadingComments),
            });
          }
        }
      } else {
        const names = node.specifiers.map((s) => {
          const exported = s.exported;
          if (exported.type === 'Identifier') {
            return {
              name: exported.name,
              comments: getCommentStr(node.leadingComments),
            };
          } else {
            return null;
          }
        });
        exported.push(...names.filter((n): n is any => !!n));
      }
    },
  });

  return exported;
}

function getCommentStr(
  comments: readonly Comment[] | null
): string | undefined {
  if (!comments) {
    return undefined;
  }

  return comments.map((c) => c.value).join('\n');
}

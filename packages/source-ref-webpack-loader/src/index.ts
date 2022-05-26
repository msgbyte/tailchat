import type { LoaderContext } from 'webpack';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import { jsxAttribute, jsxIdentifier, stringLiteral } from '@babel/types';

const TRACE_ID = 'data-source';

async function loader(this: LoaderContext<any>, source: string): Promise<void> {
  const done = this.async();

  const { available } = this.getOptions();
  if (!available) {
    // skip if not
    done(null, source);
    return;
  }

  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });
  const filepath = this.resourcePath;
  if (filepath.includes('node_modules')) {
    done(null, source);
    return;
  }

  traverse(ast, {
    JSXOpeningElement(path) {
      const location = path.node.loc;
      if (!location) {
        return;
      }

      if (Array.isArray(location)) {
        return;
      }

      const line = location.start.line;
      const col = location.start.column;

      const attrs = path.node.attributes;
      for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        if (attr.type === 'JSXAttribute' && attr.name.name === TRACE_ID) {
          // existed
          return;
        }
      }

      const traceId = `${filepath}:${line}:${col}`;

      attrs.push(jsxAttribute(jsxIdentifier(TRACE_ID), stringLiteral(traceId)));
    },
  });

  const code = generate(ast).code;

  done(null, code);
}

export default loader;

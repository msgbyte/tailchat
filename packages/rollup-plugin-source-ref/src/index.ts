import type { Plugin } from 'rollup';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import {
  isJSXIdentifier,
  isJSXMemberExpression,
  jsxAttribute,
  jsxIdentifier,
  stringLiteral,
} from '@babel/types';

const TRACE_ID = 'data-source';

export default function sourceRef(): Plugin {
  return {
    name: 'source-ref',
    transform(code, id) {
      const filepath = id;

      const ast = parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      });

      traverse(ast, {
        JSXOpeningElement(path) {
          const location = path.node.loc;
          if (!location) {
            return;
          }

          if (Array.isArray(location)) {
            return;
          }

          const name = path.node.name;
          if (isJSXIdentifier(name) && name.name === 'Fragment') {
            return;
          }
          if (
            isJSXMemberExpression(name) &&
            name.property.name === 'Fragment'
          ) {
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

          attrs.push(
            jsxAttribute(jsxIdentifier(TRACE_ID), stringLiteral(traceId))
          );
        },
      });

      const res = generate(ast);

      return { code: res.code, map: res.map };
    },
  };
}

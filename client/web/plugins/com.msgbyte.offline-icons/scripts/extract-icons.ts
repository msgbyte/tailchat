import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import {
  isArrayExpression,
  isExpression,
  isIdentifier,
  isJSXAttribute,
  isJSXIdentifier,
  isObjectExpression,
  isObjectProperty,
  isStringLiteral,
} from '@babel/types';
import globby from 'globby';
import fs from 'fs-extra';
import path from 'path';
import _ from 'lodash';
import axios from 'axios';

const PROJECT_ROOT = path.resolve(__dirname, '../../../../../');

(async () => {
  const start = Date.now();
  const paths = await globby(['**.tsx'], {
    cwd: PROJECT_ROOT,
  });

  console.log(`extract icons from ${paths.length} files...`);

  const res = await Promise.all(
    paths.map((p) => extractIcons(path.resolve(PROJECT_ROOT, p)))
  );

  const icons = _.uniq(_.flatten(res));

  console.log(`extract ${icons.length} icons, usage: ${Date.now() - start}ms`);

  const group = _.mapValues(
    _.groupBy(icons, (icon) => icon.split(':')[0]),
    (value) => {
      return value.map((item) => item.split(':')[1]);
    }
  );

  console.log(`fetching remote svg....`);

  const svgs = await Promise.all(
    _.map(group, (icons, prefix) => {
      return fetchSvgs(prefix, icons);
    })
  );

  const target = path.resolve(__dirname, '../src/icons.json');
  await fs.writeJSON(target, svgs, { spaces: 2 });

  console.log('DONE! Assets has been write into:', target);
})();

async function extractIcons(filepath: string): Promise<string[]> {
  const code = await fs.readFile(filepath, 'utf-8');

  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });

  const icons = [];

  traverse(ast, {
    JSXOpeningElement(path) {
      const name = path.node.name;
      if (isJSXIdentifier(name) && name.name === 'Icon') {
        path.node.attributes.forEach((attribute) => {
          if (isJSXAttribute(attribute) && attribute.name.name === 'icon') {
            if (isStringLiteral(attribute.value)) {
              icons.push(attribute.value.value);
            }
          }
        });
      }
    },
    CallExpression(path) {
      if (!isIdentifier(path.node.callee)) {
        return;
      }

      if (
        ['regCustomPanel', 'regPluginPanelAction'].includes(
          path.node.callee.name
        )
      ) {
        path.node.arguments.forEach((argument) => {
          if (isObjectExpression(argument)) {
            argument.properties.forEach((property) => {
              if (
                isObjectProperty(property) &&
                isIdentifier(property.key) &&
                property.key.name === 'icon' &&
                isStringLiteral(property.value) &&
                property.value.value // icon maybe empty string in some type
              ) {
                icons.push(property.value.value);
              }
            });
          }
        });
      }

      if (path.node.callee.name === 'regGroupPanel') {
        path.node.arguments.forEach((argument) => {
          if (isObjectExpression(argument)) {
            argument.properties.forEach((property) => {
              if (
                isObjectProperty(property) &&
                isIdentifier(property.key) &&
                property.key.name === 'menus' &&
                isArrayExpression(property.value)
              ) {
                property.value.elements.forEach((element) => {
                  if (isObjectExpression(element)) {
                    element.properties.forEach((property) => {
                      if (
                        isObjectProperty(property) &&
                        isIdentifier(property.key) &&
                        property.key.name === 'icon' &&
                        isStringLiteral(property.value) &&
                        property.value.value // icon maybe empty string in some type
                      ) {
                        icons.push(property.value.value);
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    },
  });

  return icons;
}

async function fetchSvgs(
  prefix: string,
  icons: string[]
): Promise<{
  aliases: any;
  height: number;
  width: number;
  icons: Record<string, { body: string }>;
  lastModified: number;
  prefix: string;
}> {
  const { data } = await axios.get(`/${prefix}.json?icons=${icons.join(',')}`, {
    baseURL: 'https://api.simplesvg.com/', // https://iconify.design/docs/api/#public-api
  });

  return data;
}

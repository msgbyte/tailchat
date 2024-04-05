import globby from 'globby';
import { TcBroker, TcService } from 'tailchat-server-sdk';
import { generateOpenapiPath } from './generateOpenapiPath';
import type { OpenAPIObject } from 'openapi3-ts/oas31';
import SwaggerParser from '@apidevtools/swagger-parser';
import fs from 'fs-extra';
import path from 'path';
import 'ts-node/register';

/**
 * https://ts-morph.com/setup/
 */

/**
 * 扫描服务
 */
async function scanServices(): Promise<OpenAPIObject> {
  const packageJsonPath = path.resolve(__dirname, '../../../../package.json');
  const version = (await fs.readJson(packageJsonPath)).verson || '0.0.0';
  const serviceFiles = await globby(
    ['./services/**/*.service.ts', './plugins/**/*.service.ts'],
    {
      absolute: true,
    }
  );

  console.log('Service List:', serviceFiles);

  const openapiObj: OpenAPIObject = {
    openapi: '3.1.0',
    info: {
      title: 'Tailchat Openapi',
      version,
    },
    paths: {},
  };
  const broker = new TcBroker({
    logger: false,
  });
  for (const servicePath of serviceFiles) {
    const { default: serviceCls } = await import(servicePath);

    if (TcService.prototype.isPrototypeOf(serviceCls.prototype)) {
      const service: TcService = new serviceCls(broker);

      openapiObj.paths = {
        ...openapiObj.paths,
        ...generateOpenapiPath(service),
      };
    }
  }
  broker.stop();

  try {
    await SwaggerParser.validate(openapiObj as any);

    return openapiObj;
  } catch (err) {
    console.error(err);
  }
}

scanServices().then(async (openapiObj) => {
  await fs.writeJSON('./openapi.json', openapiObj, {
    spaces: 2,
  });
  console.log(
    'generate completed, if process not exist auto, you can exit it by yourself'
  );
});

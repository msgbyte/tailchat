import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import fs from 'fs-extra';

/**
 * Checkout editor online with https://editor.swagger.io/
 */

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tailchat API',
      license: {
        name: 'Apache 2.0',
        url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
      },
      version: '1.0.0',
    },
    tags: [
      {
        name: 'user',
        description: '用户服务',
      },
    ],
  },
  apis: [path.resolve(__dirname, '../services/**/*.ts')], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);

const targetPath = path.resolve(__dirname, '../public/swagger.json');
fs.writeFileSync(targetPath, JSON.stringify(openapiSpecification));
console.log('接口配置已写入');

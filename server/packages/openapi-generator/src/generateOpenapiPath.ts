import _ from 'lodash';
import type { TcService } from 'tailchat-server-sdk';
import type { PathsObject, SchemaObject } from 'openapi3-ts/oas31';

export function generateOpenapiPath(service: TcService): PathsObject {
  const serviceName = service.serviceName;
  const actions = service.getActionList();

  const paths: PathsObject = {};

  for (const action of actions) {
    const pathName = '/' + serviceName + '/' + action.name;
    paths[pathName] = {
      post: {
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: generateRequestBodyProperties(action.params),
              },
            },
          },
        },
      },
    };
  }

  return paths;
}

function generateRequestBodyProperties(params: {
  [x: string]: any;
}): Record<string, SchemaObject> {
  return _.mapValues(params, (type) => {
    return type;
  });
}

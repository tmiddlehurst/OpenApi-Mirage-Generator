import type { HandlerConfig } from '../getRouteHandlerConfig';

export default function buildServerFile(handlers: HandlerConfig[]): string {
  let handlerImports = '';
  let routes = '';

  for (const handler of handlers) {
    const mirageSafePath = handler.path.replace(/\{([^}]+)\}/g, ':$1');

    handlerImports += `import ${handler.name} from \'./handlers/${handler.name}\'\n`;
    routes += `this.${handler.method}(\'${mirageSafePath}\', ${handler.name});\n`;
  }

  return `
    import { createServer, JSONAPISerializer } from 'miragejs';
    import { factories } from './factories';
    import { models } from './models';
    ${handlerImports}

    const server = createServer({
      environment: 'test',
      models,
      factories,

      serializers: {
        application: JSONAPISerializer,
      },

      seeds() {},

      routes() {
        ${routes}
      }
    }); `;
}
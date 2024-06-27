import type { OpenAPIV3 } from 'openapi-types';

export function writeRouteHandlerConfig(spec: OpenAPIV3.Document): { handlerImports: string; routes: string; } {
  const handlerImports = '';
  const routes = '';

  return { handlerImports, routes };
}

export function buildServerFile(spec: OpenAPIV3.Document): string {
  const { handlerImports, routes } = writeRouteHandlerConfig(spec);

  return `
    import { createServer, JSONAPISerializer } from 'miragejs';
    import { factories } from './factories';
    import { models } from './models';
    ${handlerImports}

    const server = createServer({
      environment: 'test'
      models,
      factories,

      serializers: {
        application: JSONAPISerializer,
      },

      seeds(server) {},

      routes() {
        ${routes}
      }
    }); `;
}
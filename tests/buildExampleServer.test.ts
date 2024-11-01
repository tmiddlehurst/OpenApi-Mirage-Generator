import { describe, test, expect } from 'bun:test';
import buildServerFile from '../src/buildFile/buildExampleServer';
import { AutogenComment, format } from '../src/utils';

const exampleServer = `
    ${AutogenComment}
    import { createServer, JSONAPISerializer } from 'miragejs';
    import { factories } from './factories';
    import { models } from './models';
    import routeHandlers from './handlers'
    import type { HandlerRequest, MirageRouteHandler } from './handlers'

    // An example of a server config file, you should define this yourself and call \`createServer(serverConfig)\`
    // The generated mirage models, factories and route handlers are exported in a form that enables
    // them to be added to an existing mirage server configuration.

    const serverConfig = {
      environment: 'test',
      // \`models\` and \`factories\` are POJOs so you can merge generated models and factories
      // with your own e.g. \`models: {...models, { myModel }}\`
      models,
      factories,

      serializers: {
        application: JSONAPISerializer,
      },

      seeds() {},

      routes() {
        // This results in each route handler gets defined like \`this.get('/coffee', getCoffeeHandler)\`;
        routeHandlers.forEach((handler: MirageRouteHandler, info: HandlerRequest) => {
          this[info.verb](info.path, handler);
        });
        // your other route handlers can go here
      }
    }`;

describe("Building server file", () => {
  test('builds a server file', async () => {
    const result = buildServerFile();
    const expectedOutput = await format(exampleServer);
    const input = await format(result);

    expect(input).toBe(expectedOutput);
  });

});
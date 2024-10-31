export default function buildServerFile(): string {

  return `
    import { createServer, JSONAPISerializer } from 'miragejs';
    import { factories } from './factories';
    import { models } from './models';
    import routeHandlers from './handlers'
    import type { HandlerRequest, MirageRouteHandler } from './handlers'

    // An example of a server config file, you should define this yourself.
    // The generated mirage config is designed to be plugged in to an existing mirage configuration.
    // Notice how the models, factories and route handlers can be added to an existing mirage server configuration.

    const server = createServer({
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
    }); `;
}
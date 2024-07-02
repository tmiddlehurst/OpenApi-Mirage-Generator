import { describe, test, expect } from 'bun:test';
import buildServerFile from '../src/buildFile/buildServer';
import { format } from '../src/utils';

const exampleServer = `
    import { createServer, JSONAPISerializer } from 'miragejs';
    import { factories } from './factories';
    import { models } from './models';
    import getCatByIdHandler from './handlers/getCatByIdHandler'
    import updateCatByIdHandler from './handlers/updateCatByIdHandler'
    import deleteCatByIdHandler from './handlers/deleteCatByIdHandler'

    const server = createServer({
      environment: 'test',
      models,
      factories,

      serializers: {
        application: JSONAPISerializer,
      },

      seeds() {},

      routes() {
        this.get('/cats/:catId', getCatByIdHandler);
        this.put('/cats/:catId', updateCatByIdHandler);
        this.delete('/cats/:catId', deleteCatByIdHandler);
      }
    }); `;

describe("Building server file", () => {
  test('builds a server file', async () => {
    const result = buildServerFile([{ name: 'getCatByIdHandler', method: 'get', path: '/cats/{catId}' }, { name: 'updateCatByIdHandler', method: 'put', path: '/cats/{catId}' }, { name: 'deleteCatByIdHandler', method: 'delete', path: '/cats/{catId}' }]);
    const expectedOutput = await format(exampleServer);
    const input = await format(result);

    expect(input).toBe(expectedOutput);
  });

  // TODO: test this on a complex schema
  // test('builds a complex server file', () => {})

});
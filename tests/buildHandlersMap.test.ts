import buildHandlersMap from '../src/buildFile/buildHandlersMap';
import { describe, test, expect } from 'bun:test';
import { format } from '../src/utils';
import { HandlerConfig } from '../src/getRouteHandlerConfig';
import { AutogenComment } from '../src/utils';

const HANDLER_CONFIG: HandlerConfig[] = [
  { name: 'getDonutsHandler', path: '/donuts', method: 'get' },
  { name: 'addDonutHandler', path: '/donuts', method: 'post' },
  { name: 'pourCoffeeHandler', path: '/coffee', method: 'put' },
  { name: 'drinkCoffeeHandler', path: '/coffee', method: 'delete' },
];

const EXPECTED = `
${AutogenComment}
import drinkCoffeeHandler from './handlers/drinkCoffeeHandler';
import pourCoffeeHandler from './handlers/pourCoffeeHandler';
import addDonutHandler from './handlers/addDonutHandler';
import getDonutsHandler from './handlers/getDonutsHandler';

export type HandlerRequest = {
  verb: 'get' | 'post' | 'put' | 'patch' | 'delete';
  path: string;
};

const handlersMap = new Map<HandlerRequest, (schema: any, request: Request) => any>;
handlersMap.set({ verb: \"delete\", path: \"/coffee\" }, drinkCoffeeHandler);
handlersMap.set({ verb: \"put\", path: \"/coffee\" }, pourCoffeeHandler);
handlersMap.set({ verb: \"post\", path: \"/donuts\" }, addDonutHandler);
handlersMap.set({ verb: \"get\", path: \"/donuts\" }, getDonutsHandler);

export default handlersMap;`;

describe('building map of route handlers', () => {
  test('builds map of handlers', async () => {
    const expected = await format(EXPECTED);
    const input = await format(buildHandlersMap(HANDLER_CONFIG));
    expect(input).toBe(expected);
  });
});
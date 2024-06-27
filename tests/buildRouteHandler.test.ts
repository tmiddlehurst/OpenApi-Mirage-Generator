import { expect, test, describe } from 'bun:test';
import type { OpenAPIV3 } from 'openapi-types';
import { getBody, getHeaders } from '../src/buildFiles/buildRouteHandler';

const exampleRouteHandlerNoContent = `

  import { Request, Response } from 'miragejs';

  export default (schema, request: Request) => {
    const headers = {};
    const body = {};

    return new Response(200, headers, body);
  };
`;

describe('Building a route handler file', () => {

  test('builds headers for response with headers', () => {
    const exampleResponse = require('./test-specs/responses/200-with-headers-and-content.json');
    const expected = '{ \"x-rate-limit-limit\": 1, \"x-api-key\": "val", \"x-rate-limit-reset\": 1,  }';

    expect(getHeaders(exampleResponse)).toEqual(expected);
  });

  test('builds headers for response without headers', () => {
    const exampleResponse = require('./test-specs/responses/200-empty.json');
    const expected = '{  }';

    expect(getHeaders(exampleResponse)).toEqual(expected);
  });

  test('builds body for empty response', () => {
    const exampleResponse = require('./test-specs/responses/200-empty.json');
    const expected = '{  }';
    expect(getBody(exampleResponse)).toEqual(expected);
  });

  test('builds body for response', () => {
    const exampleResponse = require('./test-specs/responses/200-with-headers-and-content.json');
    const expected = '{  }';
    expect(getBody(exampleResponse)).toEqual(expected);
  });


  // test('builds an handler file', () => {
  //   const exampleOperation = require('./test-specs/responses/200-with-headers-and-content.json');
  // });
  // // test('builds an handler file with refs', () => {});
  // test('builds an handler file returning a model', () => {});
});
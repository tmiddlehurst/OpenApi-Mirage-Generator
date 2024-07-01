import { getWithNestedPath, resolveRefs } from '../src/resolveRefs';
import { test, describe, expect } from 'bun:test';

const shallowRefs = require('./test-specs/resolving-refs/shallow-refs.json');
const nestedRefs = require('./test-specs/resolving-refs/nested-refs.json');

const aShallowInput = () => {
  return { ...shallowRefs };
};
const aNestedInput = () => {
  return { ...nestedRefs };
};

test('getting with a nested path', () => {
  const input = JSON.parse(`{
    "paths": {
      "/pets/{id}": {
        "delete": {
          "responses": {
            "default": {
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        }
      }
    },
    "components": {
      "schemas": {
        "Error": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string"
            }
          }
        }
      }
    }
  }`);
  expect(getWithNestedPath(input, ['paths', '/pets/{id}', 'delete', 'responses', 'default', 'content', 'application/json', 'schema', '$ref'])).toEqual("#/components/schemas/Error");
});

describe('resolving $refs in document', () => {
  test('resolves shallow $refs', () => {
    const input = aShallowInput();
    expect(resolveRefs(input).paths).toEqual({
      // @ts-expect-error this is a test case so not a real openapi doc
      "/pets/{id}": {
        delete: {
          responses: {
            default: {
              content: {
                "application/json": {
                  schema: {
                    properties: {
                      message: {
                        type: "string",
                      },
                    },
                    type: "object",
                  },
                },
              },
            },
          },
        },
      },
    });
  });

  test('resolves nested $refs', () => {
    const input = aNestedInput();
    expect(resolveRefs(input).paths).toEqual({
      // @ts-expect-error this is a test case so not a real openapi doc
      "/pets/{id}": {
        delete: {
          responses: {
            default: {
              content: {
                "application/json": {
                  schema: {
                    properties: {
                      code: {
                        type: 'string',
                        enum: [
                          "400",
                          "401",
                          "404"
                        ]
                      }
                    },
                    type: "object",
                  },
                },
              },
            },
          },
        },
      },
    });
  });
});
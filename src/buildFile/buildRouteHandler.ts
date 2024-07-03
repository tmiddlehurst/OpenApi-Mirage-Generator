import { OpenAPIV3 } from 'openapi-types';
import _ from 'lodash';
import getExampleValue from '../getExampleValue';

export default function buildRouteHandler(operationObject: OpenAPIV3.OperationObject, name?: string): string {
  let headers = '{ }';
  let body = '{ }';
  const first2xxResponse: string | undefined = Object.keys(operationObject.responses).find((key: string) => key.startsWith('20'));
  if (first2xxResponse) {
    const response = operationObject.responses[first2xxResponse] as OpenAPIV3.ResponseObject;
    headers = getHeaders(response);
    body = getBody(response);
  } else {
    console.error(`No success response for handler ${name}`);
  }

  return `
  import { Request, Response } from 'miragejs';

  export default (schema, request: Request) => {
    const headers = ${headers};
    const body = ${body};

    return new Response(200, headers, body);
  };
`;
}

export function getBody(response: OpenAPIV3.ResponseObject): string {
  let body: string = '';
  if (response.content && response.content["application/json"]) {
    console.log('getting body, calling getExampleValue() with ', response.content["application/json"].schema);
    return getExampleValue(response.content["application/json"].schema as OpenAPIV3.SchemaObject);
  }
  return `{ ${body} }`;
}

export function getHeaders(response: OpenAPIV3.ResponseObject): string {
  let headers: string = '';
  console.log('RESPONSE: ', response);
  if (response.headers) {
    for (const headerName in response.headers) {
      // @ts-expect-error references have been removed
      const exampleValue = response.headers[headerName].schema.type === 'integer' ? 1 : '\"val\"';
      headers += `\"${headerName.toLowerCase()}\": ${exampleValue}, `;
    }
  }
  return `{ ${headers} }`;
};
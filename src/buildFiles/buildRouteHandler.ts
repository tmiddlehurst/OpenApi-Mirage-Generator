import { OpenAPIV3 } from 'openapi-types';
import _ from 'lodash';

export function buildRouteHandler(operationObject: OpenAPIV3.OperationObject): string {
  const response = operationObject.responses["200"] as OpenAPIV3.ResponseObject;
  let headers = getHeaders(response.headers);
  let body = '';

  return `
  import { Request, Response } from 'miragejs';

  export default (schema, request: Request) => {
    const headers = ${headers};
    const body = ${body};

    return new Response(200, headers, body);
  };
`;
}

// uses "content" property
export function getBody(response: OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject): string {
  let body: string = '';
  if (response.content && response["application/json"]) {
    // return getObjectProperties()
  }
  return `{ ${body} }`;
}

export function getHeaders(response: OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject | undefined): string {
  let headers: string = '';
  if (response.headers) {
    for (const headerName in response.headers) {
      const exampleValue = response.headers[headerName].schema.type === 'integer' ? 1 : '\"val\"';
      headers += `\"${headerName.toLowerCase()}\": ${exampleValue}, `;
    }
  }
  return `{ ${headers} }`;
};
// export function buildResponse();
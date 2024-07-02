import { Request, Response } from 'miragejs';

export default (schema, request: Request) => {
  const headers = {};
  const body = {};

  return new Response(200, headers, body);
};

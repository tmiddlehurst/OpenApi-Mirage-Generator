import { Request, Response } from 'miragejs';

export default (schema, request: Request) => {
  const headers = {};
  const body = { id: 2222100657995776, name: 'palm', tag: 'reader' };

  return new Response(200, headers, body);
};

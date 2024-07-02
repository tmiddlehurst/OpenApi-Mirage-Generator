import { Request, Response } from 'miragejs';

export default (schema, request: Request) => {
  const headers = {};
  const body = {
    id: 2526869960261632,
    name: 'pumpernickel',
    tag: 'ex-husband'
  };

  return new Response(200, headers, body);
};

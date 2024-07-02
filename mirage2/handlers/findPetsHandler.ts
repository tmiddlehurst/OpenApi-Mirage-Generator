import { Request, Response } from 'miragejs';

export default (schema, request: Request) => {
  const headers = {
    'x-rate-limit-limit': 1,
    'x-rate-limit-remaining': 1,
    'x-rate-limit-reset': 1
  };
  const body = [
    { id: 3701302305488896, name: 'suede', tag: 'wallet' },
    { id: 3466655661293568, name: 'ziggurat', tag: 'bulb' },
    { id: 6176420166369280, name: 'hometown', tag: 'disposer' },
    { id: 3192922832896000, name: 'preface', tag: 'port' }
  ];

  return new Response(200, headers, body);
};

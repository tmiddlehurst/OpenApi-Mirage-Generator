import { HandlerConfig } from '../getRouteHandlerConfig';
import { AutogenComment } from '../utils';

export default function (handlers: HandlerConfig[]): string {
  const imports = handlers.reduce((fileString, handler) => {
    return `import ${handler.name} from \'./handlers/${handler.name}\'\n${fileString}`;
  }, '');

  const mapPuts = handlers.reduce((fileString, handler) => {
    const config = { verb: handler.method, path: handler.path };
    return `handlersMap.set(${JSON.stringify(config)}, ${handler.name})\n${fileString}`;
  }, '');

  return `${AutogenComment}
  ${imports}
  export type HandlerRequest = {
    verb: 'get' | 'post' | 'put' | 'patch' | 'delete';
    path: string;
  };
  export type MirageRouteHandler = (schema: any, request: Request) => any;

  const handlersMap = new Map<HandlerRequest, MirageRouteHandler>();
  ${mapPuts}

  export default handlersMap;`;
}
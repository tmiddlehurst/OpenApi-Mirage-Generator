import type { OpenAPIV3 } from 'openapi-types';

/**
 * Iterate through all keys of object `object` once,
 * recursively call again if any object is found
 * for any key named `$ref`, replace its value with the value at the path.
 * Return count of `$ref`s found.
 */
function recursiveReplace(baseObject: Record<string, any>, current?: Record<string, any>): number {
  let refsFound = 0;
  current = current || baseObject;
  for (const key in current) {
    if (typeof current[key] === 'object' && !Array.isArray(current[key])) {
      recursiveReplace(baseObject, current[key]);
    } else {
      if (key === '$ref') {
        refsFound += 1;
        // Local Reference support only, e.g. references to items within the same document.
        // Use a tool like redocly to combine them into one file
        // https://redocly.com/docs/cli/commands/bundle
        if (current[key].startsWith('#/')) {
          const pathSegments = current[key].split('#/')[1].split('/');
          const propsFromRef = getWithNestedPath(baseObject, pathSegments);
          delete current[key];

          for (const key in propsFromRef) {
            current[key] = propsFromRef[key];
          }
        }
      }
    }
  }
  return refsFound;
}

/**
 * Given "nestedPath" as `pathSegments`, return value from `object` at a "nestedPath"
 */
export function getWithNestedPath(object: Record<string, any>, pathSegments: string[]): any {
  while (pathSegments.length > 0) {
    const key = pathSegments[0];
    // console.log('current: ', object);
    console.log('key: ', key);
    console.log('value: ', object[key]);
    object = object[key];
    pathSegments.shift();
  }
  return object;
}

export function resolveRefs(doc: OpenAPIV3.Document): OpenAPIV3.Document {
  const refs = recursiveReplace(doc);
  doc = refs === 0 ? doc : resolveRefs(doc);
  return doc;
}
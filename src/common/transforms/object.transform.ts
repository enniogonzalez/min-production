export function ObjectTransform<T = any>(value: T): any {
  let valToReturn = null;

  if (typeof value['value'] === 'string') {
    try {
      valToReturn =
        value['value'] === 'null' ? null : JSON.parse(value['value'].trim());
    } catch {
      valToReturn = value['value'];
    }
  } else {
    valToReturn = value['value'];
  }

  return valToReturn;
}

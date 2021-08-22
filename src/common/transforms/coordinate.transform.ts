import { CoordinateInterface } from '../interfaces/coordinate.interface';
import { getCoordinateFromObject } from '../libs/coordinate.lib';

export function CoordinateTransform<T = any>(value: T): CoordinateInterface {
  let obj = value['value'];

  if (typeof value['value'] === 'string') {
    if (value['value'] === 'null') {
      return null;
    }

    try {
      obj = JSON.parse(value['value'].trim());
    } catch (error) {
      obj = null;
    }
  }

  if (!obj) {
    return null;
  }

  return getCoordinateFromObject(obj);
}

import { CoordinateInterface } from '../interfaces/coordinate.interface';
import { DatabaseCoordinateInterface } from '../interfaces/databaseCoordinate.interface';

/**
 * Get Coordinate From any object (if exists, if not, return null)
 * @param {Record<string, unknown>} obj - objet to search the coordinate
 * @returns {Promise<CoordinateInterface>} - coordinate found
 */
export function getCoordinateFromObject(
  obj: Record<string, unknown>,
): CoordinateInterface {
  const latitude: number = isNaN(+obj.latitude) ? NaN : +obj.latitude;
  const longitude: number = isNaN(+obj.longitude) ? NaN : +obj.longitude;

  return generateCoordinate(latitude, longitude);
}

/**
 * Get Coordinate from database field
 * @param {string | CoordinateInterface | DatabaseCoordinateInterface} coordinate - coordinate database field
 * @returns {Promise<CoordinateInterface>} - coordinate generated
 */
export function getCoordinateFromDatabaseField(
  coordinate: string | CoordinateInterface | DatabaseCoordinateInterface,
): CoordinateInterface {
  if (typeof coordinate === 'string') {
    return convertStringToCoordinate(coordinate);
  }

  const latitude = isNaN(+coordinate['x'])
    ? isNaN(+coordinate['latitude'])
      ? null
      : +coordinate['latitude']
    : +coordinate['x'];

  const longitude = isNaN(+coordinate['y'])
    ? isNaN(+coordinate['longitude'])
      ? null
      : +coordinate['longitude']
    : +coordinate['y'];

  return generateCoordinate(latitude, longitude);
}

/**
 * Convert string to Coordinate
 * @param {string} strCoordinate - string coordinate
 * @returns {Promise<CoordinateInterface>} - coordinate generated
 */
function convertStringToCoordinate(strCoordinate: string): CoordinateInterface {
  const coordinates = strCoordinate.split(',');

  if (coordinates.length !== 2) {
    return null;
  }

  const latitude: number = isNaN(+coordinates[0]) ? NaN : +coordinates[0];
  const longitude: number = isNaN(+coordinates[1]) ? NaN : +coordinates[1];

  return generateCoordinate(latitude, longitude);
}

/**
 * Generate coordinate given a latitude and a longitude
 * @param {number} latitude - latitude
 * @param {number} longitude - longitude
 * @returns {Promise<CoordinateInterface>} - coordinate generated
 */
function generateCoordinate(
  latitude: number,
  longitude: number,
): CoordinateInterface {
  if (isNaN(latitude) || isNaN(longitude)) {
    return null;
  }

  return { latitude, longitude };
}

/** From https://en.wikipedia.org/wiki/GeoJSON
 *  Stored as [ longitude, latitude ]
 */
export interface GeoPoint {
  type: 'Point';
  coordinates: number[];
}

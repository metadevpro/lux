/** From https://en.wikipedia.org/wiki/GeoJSON
 *  Stored as [ longitude, latitude ]
 */
export interface Geopoint {
  type: 'Point';
  coordinates: number[];
}

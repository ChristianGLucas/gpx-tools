import { KmlToGeoJsonInput } from '../gen/messages_pb';
import { kmlToGeoJson } from './kml_to_geo_json';
import { SAMPLE_KML } from './lib/fixtures';
import { testContext } from './lib/test_context';
import { makeDoc } from './lib/test_input';

function input(xml: string): KmlToGeoJsonInput {
  const inp = new KmlToGeoJsonInput();
  inp.setDoc(makeDoc(xml));
  return inp;
}

describe('KmlToGeoJson', () => {
  it('emits a bare GeometryCollection (not a Feature/FeatureCollection) for geo-tools compatibility', () => {
    const result = kmlToGeoJson(testContext, input(SAMPLE_KML));
    expect(result.getError()).toBe('');
    const parsed = JSON.parse(result.getGeojson());
    expect(parsed.type).toBe('GeometryCollection');
    expect(Array.isArray(parsed.geometries)).toBe(true);
  });

  // INDEPENDENT ORACLE: 5 member geometries expected (Point x3 — City Hall
  // plus MultiSpot's two Points — LineString x1, Polygon x1 with its outer
  // and inner rings assembled into ONE Polygon's coordinates array), each
  // coordinate in [lon, lat, elev] order per RFC 7946 — derived by hand
  // from the fixture text, independent of this package's own code.
  it('assembles a Polygon\'s outer + inner rings into one Polygon geometry (RFC 7946 independent oracle)', () => {
    const result = kmlToGeoJson(testContext, input(SAMPLE_KML));
    const parsed = JSON.parse(result.getGeojson());
    expect(parsed.geometries).toHaveLength(5);

    const polygon = parsed.geometries.find((g: { type: string }) => g.type === 'Polygon');
    expect(polygon.coordinates).toHaveLength(2); // outer ring + 1 inner ring, NOT 2 separate Polygons
    expect(polygon.coordinates[0]).toEqual([
      [-122.6, 45.6, 0],
      [-122.5, 45.6, 0],
      [-122.5, 45.7, 0],
      [-122.6, 45.7, 0],
      [-122.6, 45.6, 0],
    ]);
    expect(polygon.coordinates[1][0]).toEqual([-122.58, 45.62, 0]);

    const lineString = parsed.geometries.find((g: { type: string }) => g.type === 'LineString');
    expect(lineString.coordinates).toEqual([
      [-122.7, 45.5, 10],
      [-122.69, 45.51, 15],
      [-122.68, 45.52, 20],
    ]);

    const points = parsed.geometries.filter((g: { type: string }) => g.type === 'Point');
    expect(points).toHaveLength(3);
  });

  it('returns an empty GeometryCollection (ok, not an error) for a KML document with no placemarks', () => {
    const empty = '<kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>Empty</name></Document></kml>';
    const result = kmlToGeoJson(testContext, input(empty));
    expect(result.getError()).toBe('');
    expect(JSON.parse(result.getGeojson())).toEqual({ type: 'GeometryCollection', geometries: [] });
  });

  it('returns a structured error when the root element is not <kml>', () => {
    const result = kmlToGeoJson(testContext, input('<gpx version="1.1"></gpx>'));
    expect(result.getError()).toContain('WRONG_ROOT_ELEMENT');
  });
});

import { AxiomContext } from '../gen/axiomContext';
import { GeoJson, KmlToGeoJsonInput } from '../gen/messages_pb';
import { kmlToGeometryCollection } from './lib/geojson';
import { loadKmlDocument } from './lib/parse_doc';

/**
 * Convert every geometry across every KML placemark to a single GeoJSON
 * (RFC 7946) GeometryCollection — one member geometry per Point/LineString/
 * Polygon (rings assembled into a single Polygon per placemark's
 * geometry), coordinates in [longitude, latitude] axis order. Emitting a
 * bare GeometryCollection rather than a Feature/FeatureCollection keeps
 * this directly compatible with christiangeorgelucas/geo-tools'
 * Geometry.geojson field, which carries a bare RFC 7946 geometry object. A
 * document with no placemarks returns an empty GeometryCollection
 * (ok=true), not an error.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function kmlToGeoJson(ax: AxiomContext, input: KmlToGeoJsonInput): GeoJson {
  const xml = input.getDoc()?.getXml() ?? '';
  const out = new GeoJson();

  const loaded = loadKmlDocument(xml);
  if ('error' in loaded) {
    out.setError(`${loaded.error.code}: ${loaded.error.message}`);
    return out;
  }

  const result = kmlToGeometryCollection(loaded.root);
  out.setGeojson(result.geojson);
  out.setError(result.error);
  return out;
}

// GeoJSON (RFC 7946) conversion helpers. Coordinates are always emitted in
// [longitude, latitude] axis order (RFC 7946 §3.1.1) — the same axis order
// christiangeorgelucas/geo-tools' Geometry.geojson field documents — so
// output from this package composes directly with that package's nodes.

import { PointData } from './gpx';
import { GeoJsonGeom, collectPlacemarksRaw, extractGeoJsonGeometries } from './kml';
import { XmlDocRoot } from './xml_parser';

export interface GeoJsonResult {
  geojson: string;
  error: string;
}

function pointToCoordArray(p: PointData, includeElevation: boolean): number[] {
  return includeElevation && p.elevation !== null ? [p.lon, p.lat, p.elevation] : [p.lon, p.lat];
}

/** true only if EVERY point carries an elevation — GeoJSON requires uniform
 * coordinate dimensionality within one geometry, so a partial elevation set
 * is dropped rather than silently mixed 2D/3D positions. */
function allHaveElevation(points: PointData[]): boolean {
  return points.length > 0 && points.every((p) => p.elevation !== null);
}

/** A GPX track's flattened points -> a GeoJSON LineString geometry. */
export function lineStringGeoJson(points: PointData[]): GeoJsonResult {
  if (points.length < 2) {
    return { geojson: '', error: 'EMPTY_GEOMETRY: a LineString requires at least 2 positions.' };
  }
  const includeElevation = allHaveElevation(points);
  const coordinates = points.map((p) => pointToCoordArray(p, includeElevation));
  return { geojson: JSON.stringify({ type: 'LineString', coordinates }), error: '' };
}

function geomToGeoJson(g: GeoJsonGeom): Record<string, unknown> | null {
  if (g.kind === 'Point') {
    if (g.coords.length === 0) return null;
    return { type: 'Point', coordinates: pointToCoordArray(g.coords[0], allHaveElevation(g.coords)) };
  }
  if (g.kind === 'LineString') {
    if (g.coords.length < 2) return null;
    const includeElevation = allHaveElevation(g.coords);
    return { type: 'LineString', coordinates: g.coords.map((p) => pointToCoordArray(p, includeElevation)) };
  }
  // Polygon: every ring needs >= 4 positions (closed ring, RFC 7946 §3.1.6).
  const validRings = g.rings.filter((r) => r.length >= 4);
  if (validRings.length === 0) return null;
  const includeElevation = validRings.every((r) => allHaveElevation(r));
  return {
    type: 'Polygon',
    coordinates: validRings.map((r) => r.map((p) => pointToCoordArray(p, includeElevation))),
  };
}

/** Every geometry across every placemark of a parsed KML root -> a single
 * GeoJSON GeometryCollection (a bare RFC 7946 Geometry, not a Feature/
 * FeatureCollection, for direct compatibility with geo-tools' envelope). */
export function kmlToGeometryCollection(root: XmlDocRoot): GeoJsonResult {
  const rawPlacemarks: XmlDocRoot[] = [];
  collectPlacemarksRaw(root, rawPlacemarks);

  const geometries: Record<string, unknown>[] = [];
  for (const pm of rawPlacemarks) {
    for (const g of extractGeoJsonGeometries(pm)) {
      const converted = geomToGeoJson(g);
      if (converted) geometries.push(converted);
    }
  }
  return { geojson: JSON.stringify({ type: 'GeometryCollection', geometries }), error: '' };
}

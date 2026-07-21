// KML-schema-aware extraction from the generic object fast-xml-parser
// produces (see xml_parser.ts). This is the package's own format knowledge,
// kept independent of protobuf so it is trivially unit-testable on its own.
//
// Placemarks are collected by a recursive search for the "Placemark" key
// at ANY depth in the parsed tree, rather than a fixed list of expected
// paths (kml.Document.Placemark, kml.Document.Folder.Placemark, ...) —
// real-world KML (Google Earth exports especially) nests Placemarks inside
// arbitrarily many levels of <Folder>, and a fixed-path list would silently
// miss them.

import { PointData } from './gpx';
import { XmlDocRoot, asArray, textOf, toFiniteNumber } from './xml_parser';

const MAX_GEOMETRY_RECURSION = 32; // MultiGeometry-of-MultiGeometry is legal but never deep in practice.

export interface KmlGeometryData {
  // 'Point' | 'LineString' | 'outerBoundaryIs' | 'innerBoundaryIs'
  geometryType: string;
  coordinates: PointData[];
}

export interface PlacemarkData {
  name: string;
  description: string;
  // Collapsed single type: 'Point' | 'LineString' | 'Polygon' | 'MultiGeometry' | ''.
  geometryType: string;
  // Collapsed coordinates: the first ring (Polygon) or first child geometry
  // (MultiGeometry) only — see `geometries` for every individual geometry.
  coordinates: PointData[];
  geometries: KmlGeometryData[];
  index: number;
}

export interface KmlDocument {
  documentName: string;
  placemarks: PlacemarkData[];
}

/** KML <coordinates> text: whitespace-separated "lon,lat[,alt]" tuples. */
export function parseCoordinatesText(text: string): PointData[] {
  const trimmed = (text || '').trim();
  if (!trimmed) return [];
  const tuples = trimmed.split(/\s+/);
  const out: PointData[] = [];
  for (const tuple of tuples) {
    const parts = tuple.split(',');
    if (parts.length < 2) continue;
    const lon = toFiniteNumber(parts[0]);
    const lat = toFiniteNumber(parts[1]);
    if (lat === null || lon === null) continue;
    const elevation = parts.length >= 3 ? toFiniteNumber(parts[2]) : null;
    out.push({ lat, lon, elevation, time: '', segmentIndex: 0 });
  }
  return out;
}

function extractPolygonGeometries(v: XmlDocRoot): KmlGeometryData[] {
  const out: KmlGeometryData[] = [];
  const outer = v.outerBoundaryIs;
  if (outer && typeof outer === 'object') {
    const ring = ((outer as XmlDocRoot).LinearRing ?? {}) as XmlDocRoot;
    out.push({ geometryType: 'outerBoundaryIs', coordinates: parseCoordinatesText(textOf(ring.coordinates)) });
  }
  for (const inner of asArray<unknown>(v.innerBoundaryIs as never)) {
    const innerObj = (inner ?? {}) as XmlDocRoot;
    const ring = (innerObj.LinearRing ?? {}) as XmlDocRoot;
    out.push({ geometryType: 'innerBoundaryIs', coordinates: parseCoordinatesText(textOf(ring.coordinates)) });
  }
  return out;
}

/** Every geometry directly under a placemark (or a MultiGeometry), recursing
 * into nested MultiGeometry up to MAX_GEOMETRY_RECURSION levels. */
function extractGeometries(v: XmlDocRoot, depth: number): KmlGeometryData[] {
  if (depth > MAX_GEOMETRY_RECURSION) return [];
  const out: KmlGeometryData[] = [];
  for (const p of asArray<unknown>(v.Point as never)) {
    const obj = (p ?? {}) as XmlDocRoot;
    out.push({ geometryType: 'Point', coordinates: parseCoordinatesText(textOf(obj.coordinates)) });
  }
  for (const l of asArray<unknown>(v.LineString as never)) {
    const obj = (l ?? {}) as XmlDocRoot;
    out.push({ geometryType: 'LineString', coordinates: parseCoordinatesText(textOf(obj.coordinates)) });
  }
  for (const poly of asArray<unknown>(v.Polygon as never)) {
    out.push(...extractPolygonGeometries((poly ?? {}) as XmlDocRoot));
  }
  for (const mg of asArray<unknown>(v.MultiGeometry as never)) {
    out.push(...extractGeometries((mg ?? {}) as XmlDocRoot, depth + 1));
  }
  return out;
}

export type GeoJsonGeom =
  | { kind: 'Point'; coords: PointData[] }
  | { kind: 'LineString'; coords: PointData[] }
  | { kind: 'Polygon'; rings: PointData[][] };

/** Like extractGeometries, but keeps a Polygon's outer + inner rings grouped
 * into ONE entry (rings: PointData[][]) instead of flattening them into
 * separate outerBoundaryIs/innerBoundaryIs entries — the shape GeoJSON's
 * Polygon type actually needs (coordinates: one array of rings). Used only
 * by geojson.ts's KML->GeoJSON conversion. */
export function extractGeoJsonGeometries(v: XmlDocRoot, depth = 0): GeoJsonGeom[] {
  if (depth > MAX_GEOMETRY_RECURSION) return [];
  const out: GeoJsonGeom[] = [];
  for (const p of asArray<unknown>(v.Point as never)) {
    const obj = (p ?? {}) as XmlDocRoot;
    out.push({ kind: 'Point', coords: parseCoordinatesText(textOf(obj.coordinates)) });
  }
  for (const l of asArray<unknown>(v.LineString as never)) {
    const obj = (l ?? {}) as XmlDocRoot;
    out.push({ kind: 'LineString', coords: parseCoordinatesText(textOf(obj.coordinates)) });
  }
  for (const poly of asArray<unknown>(v.Polygon as never)) {
    const polyObj = (poly ?? {}) as XmlDocRoot;
    const rings: PointData[][] = [];
    const outer = polyObj.outerBoundaryIs;
    if (outer && typeof outer === 'object') {
      const ring = ((outer as XmlDocRoot).LinearRing ?? {}) as XmlDocRoot;
      rings.push(parseCoordinatesText(textOf(ring.coordinates)));
    }
    for (const inner of asArray<unknown>(polyObj.innerBoundaryIs as never)) {
      const innerObj = (inner ?? {}) as XmlDocRoot;
      const ring = (innerObj.LinearRing ?? {}) as XmlDocRoot;
      rings.push(parseCoordinatesText(textOf(ring.coordinates)));
    }
    if (rings.length > 0) out.push({ kind: 'Polygon', rings });
  }
  for (const mg of asArray<unknown>(v.MultiGeometry as never)) {
    out.push(...extractGeoJsonGeometries((mg ?? {}) as XmlDocRoot, depth + 1));
  }
  return out;
}

function collapsedGeometryType(v: XmlDocRoot): string {
  if (asArray<unknown>(v.Point as never).length > 0) return 'Point';
  if (asArray<unknown>(v.LineString as never).length > 0) return 'LineString';
  if (asArray<unknown>(v.Polygon as never).length > 0) return 'Polygon';
  if (asArray<unknown>(v.MultiGeometry as never).length > 0) return 'MultiGeometry';
  return '';
}

function extractPlacemark(v: XmlDocRoot, index: number): PlacemarkData {
  const name = textOf(v.name);
  const description = textOf(v.description);
  const geometries = extractGeometries(v, 0);
  const geometryType = geometries.length > 0 ? collapsedGeometryType(v) : '';
  const coordinates = geometries.length > 0 ? geometries[0].coordinates : [];
  return { name, description, geometryType, coordinates, geometries, index };
}

function findDocumentName(root: XmlDocRoot): string {
  const doc = root.Document;
  if (doc && typeof doc === 'object') return textOf((doc as XmlDocRoot).name);
  const folder = root.Folder;
  if (folder && typeof folder === 'object') return textOf((folder as XmlDocRoot).name);
  return textOf(root.name);
}

/** Recursively collect every <Placemark> anywhere in the tree, regardless of
 * how many <Folder> levels it is nested under, in document order. */
export function collectPlacemarksRaw(node: unknown, acc: XmlDocRoot[]): void {
  if (node === null || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const item of node) collectPlacemarksRaw(item, acc);
    return;
  }
  const obj = node as XmlDocRoot;
  for (const key of Object.keys(obj)) {
    if (key === 'Placemark') {
      for (const pm of asArray<unknown>(obj[key] as never)) acc.push((pm ?? {}) as XmlDocRoot);
    } else {
      collectPlacemarksRaw(obj[key], acc);
    }
  }
}

export function parseKmlDocument(root: XmlDocRoot): KmlDocument {
  const documentName = findDocumentName(root);
  const rawPlacemarks: XmlDocRoot[] = [];
  collectPlacemarksRaw(root, rawPlacemarks);
  const placemarks = rawPlacemarks.map((pm, idx) => extractPlacemark(pm, idx));
  return { documentName, placemarks };
}

/** Every coordinate across every geometry of every placemark, flattened. */
export function allCoordinatesInKml(doc: KmlDocument): PointData[] {
  const out: PointData[] = [];
  for (const pm of doc.placemarks) {
    for (const geom of pm.geometries) out.push(...geom.coordinates);
  }
  return out;
}

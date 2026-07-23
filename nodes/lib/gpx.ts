// GPX 1.0/1.1-schema-aware extraction from the generic object fast-xml-parser
// produces (see xml_parser.ts). This is the package's own format knowledge —
// the value-add on top of "a library that tokenizes XML" — kept independent
// of protobuf so it is trivially unit-testable on its own.
//
// GPX 1.1 wraps document-level fields in <metadata>; GPX 1.0 (older Garmin
// exports) puts the same fields directly on the root <gpx> element. Both
// shapes are handled: metadata fields are read from <metadata> when present,
// else from the gpx root itself.

import { XmlDocRoot, asArray, textOf, toFiniteNumber } from './xml_parser';

export interface PointData {
  lat: number;
  lon: number;
  elevation: number | null;
  time: string;
  segmentIndex: number;
}

export interface TrackSegmentData {
  points: PointData[];
}

export interface TrackData {
  name: string;
  segments: TrackSegmentData[];
}

export interface RouteData {
  name: string;
  points: PointData[];
}

export interface WaypointData {
  lat: number;
  lon: number;
  elevation: number | null;
  time: string;
  name: string;
  symbol: string;
}

export interface BoundsData {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

export interface GpxMetadata {
  name: string;
  description: string;
  author: string;
  time: string;
  bounds: BoundsData | null;
}

export interface GpxDocument {
  metadata: GpxMetadata;
  waypoints: WaypointData[];
  routes: RouteData[];
  tracks: TrackData[];
}

function extractAuthorName(v: unknown): string {
  if (v === undefined || v === null) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'object') {
    const obj = v as XmlDocRoot;
    if ('name' in obj) return textOf(obj.name);
    if ('#text' in obj) return textOf(obj as Record<string, unknown>);
  }
  return '';
}

function extractBounds(v: unknown): BoundsData | null {
  if (!v || typeof v !== 'object') return null;
  const obj = v as XmlDocRoot;
  const minLat = toFiniteNumber(obj['@_minlat']);
  const minLon = toFiniteNumber(obj['@_minlon']);
  const maxLat = toFiniteNumber(obj['@_maxlat']);
  const maxLon = toFiniteNumber(obj['@_maxlon']);
  if (minLat === null || minLon === null || maxLat === null || maxLon === null) return null;
  return { minLat, maxLat, minLon, maxLon };
}

function extractPoint(v: XmlDocRoot, segmentIndex = 0): PointData | null {
  const lat = toFiniteNumber(v['@_lat']);
  const lon = toFiniteNumber(v['@_lon']);
  if (lat === null || lon === null) return null;
  const elevation = toFiniteNumber(textOf(v.ele));
  const time = textOf(v.time);
  return { lat, lon, elevation, time, segmentIndex };
}

function extractWaypoint(v: XmlDocRoot): WaypointData | null {
  const pt = extractPoint(v);
  if (!pt) return null;
  return { lat: pt.lat, lon: pt.lon, elevation: pt.elevation, time: pt.time, name: textOf(v.name), symbol: textOf(v.sym) };
}

function extractTrack(v: XmlDocRoot): TrackData {
  const name = textOf(v.name);
  const segRaw = asArray<unknown>(v.trkseg as never);
  let segments: TrackSegmentData[];
  if (segRaw.length === 0) {
    // A bare <trk> with no <trkseg> children parses as one implicit empty
    // segment (see the TrackSegment proto doc comment).
    segments = [{ points: [] }];
  } else {
    segments = segRaw.map((seg) => {
      const segObj = (seg ?? {}) as XmlDocRoot;
      const ptsRaw = asArray<unknown>(segObj.trkpt as never);
      const points = ptsRaw
        .map((p) => extractPoint((p ?? {}) as XmlDocRoot))
        .filter((p): p is PointData => p !== null);
      return { points };
    });
  }
  return { name, segments };
}

function extractRoute(v: XmlDocRoot): RouteData {
  const name = textOf(v.name);
  const ptsRaw = asArray<unknown>(v.rtept as never);
  const points = ptsRaw
    .map((p) => extractPoint((p ?? {}) as XmlDocRoot))
    .filter((p): p is PointData => p !== null);
  return { name, points };
}

export function parseGpxDocument(root: XmlDocRoot): GpxDocument {
  const metaContainer: XmlDocRoot =
    root.metadata && typeof root.metadata === 'object' ? (root.metadata as XmlDocRoot) : root;

  const metadata: GpxMetadata = {
    name: textOf(metaContainer.name),
    description: textOf(metaContainer.desc),
    author: extractAuthorName(metaContainer.author),
    time: textOf(metaContainer.time),
    bounds: extractBounds(metaContainer.bounds),
  };

  const waypoints = asArray<unknown>(root.wpt as never)
    .map((w) => extractWaypoint((w ?? {}) as XmlDocRoot))
    .filter((w): w is WaypointData => w !== null);

  const routes = asArray<unknown>(root.rte as never).map((r) => extractRoute((r ?? {}) as XmlDocRoot));

  const tracks = asArray<unknown>(root.trk as never).map((t) => extractTrack((t ?? {}) as XmlDocRoot));

  return { metadata, waypoints, routes, tracks };
}

/** Every point of a track, segments flattened in document order, each
 * point's segmentIndex recording which <trkseg> it came from. */
export function flattenTrackPoints(track: TrackData): PointData[] {
  const out: PointData[] = [];
  track.segments.forEach((seg, segIdx) => {
    seg.points.forEach((p) => out.push({ ...p, segmentIndex: segIdx }));
  });
  return out;
}

/** Every point anywhere in the document: all waypoints, all route points,
 * and every track point across every track/segment.
 *
 * Appends element-by-element rather than `out.push(...points)` — spreading a
 * large array into a function call's arguments can overflow the JS engine's
 * call stack ("Maximum call stack size exceeded") well before any real
 * memory limit is reached, which would crash the node instead of returning
 * its result. A large-but-valid document must never crash. */
export function allPointsInDocument(doc: GpxDocument): PointData[] {
  const out: PointData[] = [];
  for (const w of doc.waypoints) out.push({ lat: w.lat, lon: w.lon, elevation: w.elevation, time: w.time, segmentIndex: 0 });
  for (const r of doc.routes) for (const p of r.points) out.push(p);
  for (const t of doc.tracks) for (const p of flattenTrackPoints(t)) out.push(p);
  return out;
}

export interface Bounds {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

/** Pure min/max bounding box over a set of points — no distance/area math. */
export function computeBoundsFromPoints(points: PointData[]): Bounds | null {
  if (points.length === 0) return null;
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLon = Infinity;
  let maxLon = -Infinity;
  for (const p of points) {
    if (p.lat < minLat) minLat = p.lat;
    if (p.lat > maxLat) maxLat = p.lat;
    if (p.lon < minLon) minLon = p.lon;
    if (p.lon > maxLon) maxLon = p.lon;
  }
  return { minLat, maxLat, minLon, maxLon };
}

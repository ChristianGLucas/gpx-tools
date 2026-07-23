// Shared XML parsing plumbing for both GPX and KML, built on fast-xml-parser
// (MIT, NaturalIntelligence). fast-xml-parser owns the actual XML
// tokenizing/parsing "hard part"; this file only configures it safely and
// shapes its generic object output for the gpx.ts / kml.ts extraction layers.
//
// Security note: fast-xml-parser does not resolve external entities or DTDs
// at all — it throws ("External entities are not supported" / similar)
// rather than silently inlining file/network content, so this wrapper is
// XXE-safe by construction. We surface that throw as a structured error
// instead of letting it crash the node.

import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { GuardError } from './guard';

// Tag names that are always treated as arrays, regardless of how many times
// they actually occur (0, 1, or many) and regardless of nesting depth. This
// removes the classic fast-xml-parser landmine where a single occurrence
// parses as a bare object while two or more parse as an array — every
// consumer below can assume these are always JS arrays.
const ALWAYS_ARRAY = new Set([
  // GPX
  'wpt',
  'rte',
  'rtept',
  'trk',
  'trkseg',
  'trkpt',
  // KML
  'Placemark',
  'Point',
  'LineString',
  'Polygon',
  'MultiGeometry',
  'innerBoundaryIs',
]);

function buildParser(): XMLParser {
  return new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    // Keep every value a raw string — callers convert types (lat/lon/ele ->
    // number) explicitly, rather than letting the parser guess and silently
    // coerce a value that merely *looks* numeric.
    parseTagValue: false,
    parseAttributeValue: false,
    trimValues: true,
    isArray: (name: string) => ALWAYS_ARRAY.has(name),
  });
}

export type XmlDocRoot = Record<string, unknown>;

export interface ParsedXml {
  // The single root element's tag name ("gpx", "kml", or whatever the
  // document actually declares).
  rootKey: string;
  // The root element's children (attributes + nested elements), never the
  // wrapping root key itself.
  root: XmlDocRoot;
}

/**
 * Validate, then parse, an XML document. Returns a structured error for
 * empty/malformed XML or an XML construct fast-xml-parser refuses to
 * process (external entities, DTDs).
 */
export function parseXml(xml: string): ParsedXml | { error: GuardError } {
  const validation = XMLValidator.validate(xml, { allowBooleanAttributes: true });
  if (validation !== true) {
    return {
      error: {
        code: 'PARSE_ERROR',
        message: `Malformed XML: ${validation.err.msg} (line ${validation.err.line ?? '?'}).`,
      },
    };
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = buildParser().parse(xml);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return { error: { code: 'XML_UNSAFE_ENTITY', message } };
  }

  const rootKeys = Object.keys(parsed).filter((k) => k !== '?xml' && !k.startsWith('#'));
  if (rootKeys.length !== 1) {
    return {
      error: {
        code: 'PARSE_ERROR',
        message: `Expected exactly one root element, found ${rootKeys.length} (${rootKeys.join(', ') || 'none'}).`,
      },
    };
  }

  const rootKey = rootKeys[0];
  const root = (parsed[rootKey] ?? {}) as XmlDocRoot;
  return { rootKey, root };
}

/** "gpx", "kml", or "unknown", from the parsed document's root element name. */
export function detectFormatFromRootKey(rootKey: string): 'gpx' | 'kml' | 'unknown' {
  if (rootKey === 'gpx') return 'gpx';
  if (rootKey === 'kml') return 'kml';
  return 'unknown';
}

export function toStr(v: unknown): string {
  if (v === undefined || v === null) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'object') return ''; // an element with attribute-children but no text; treat as absent text
  return String(v);
}

/** Text content of a tag that may (attributes present -> {"#text": ...}) or
 * may not (no attributes -> plain string) be wrapped, per fast-xml-parser's
 * documented shape. */
export function textOf(v: unknown): string {
  if (v === undefined || v === null) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'object' && '#text' in (v as Record<string, unknown>)) {
    return toStr((v as Record<string, unknown>)['#text']);
  }
  return '';
}

/** Parse a finite decimal number from XML text; returns null (never NaN/Infinity) on failure. */
export function toFiniteNumber(v: unknown): number | null {
  const s = typeof v === 'string' ? v.trim() : v;
  if (s === '' || s === undefined || s === null) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** Normalize a possibly-absent, possibly-scalar, possibly-array field to an array. */
export function asArray<T>(v: T | T[] | undefined): T[] {
  if (v === undefined) return [];
  return Array.isArray(v) ? v : [v];
}

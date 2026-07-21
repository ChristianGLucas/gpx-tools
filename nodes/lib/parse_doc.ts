// Orchestration glue shared by every node: guard the raw text, parse it as
// XML, and (for format-specific nodes) require the right root element.

import { GpxDocument, parseGpxDocument } from './gpx';
import { checkEmpty, checkSize, GuardError } from './guard';
import { KmlDocument, parseKmlDocument } from './kml';
import { MAX_XML_BYTES, XmlDocRoot, detectFormatFromRootKey, parseXml } from './xml_parser';

export interface LoadedXml {
  root: XmlDocRoot;
  rootKey: string;
}

export function loadAndParseXml(xml: string): LoadedXml | { error: GuardError } {
  const emptyErr = checkEmpty(xml, 'doc.xml');
  if (emptyErr) return { error: emptyErr };

  const sizeErr = checkSize(xml, MAX_XML_BYTES, 'doc.xml');
  if (sizeErr) return { error: sizeErr };

  const parsed = parseXml(xml);
  if ('error' in parsed) return { error: parsed.error };

  return { root: parsed.root, rootKey: parsed.rootKey };
}

export function loadGpxDocument(xml: string): { doc: GpxDocument } | { error: GuardError } {
  const loaded = loadAndParseXml(xml);
  if ('error' in loaded) return loaded;
  if (loaded.rootKey !== 'gpx') {
    return {
      error: { code: 'WRONG_ROOT_ELEMENT', message: `Expected root element <gpx>, found <${loaded.rootKey}>.` },
    };
  }
  return { doc: parseGpxDocument(loaded.root) };
}

export function loadKmlDocument(xml: string): { doc: KmlDocument; root: XmlDocRoot } | { error: GuardError } {
  const loaded = loadAndParseXml(xml);
  if ('error' in loaded) return loaded;
  if (loaded.rootKey !== 'kml') {
    return {
      error: { code: 'WRONG_ROOT_ELEMENT', message: `Expected root element <kml>, found <${loaded.rootKey}>.` },
    };
  }
  return { doc: parseKmlDocument(loaded.root), root: loaded.root };
}

export { detectFormatFromRootKey };

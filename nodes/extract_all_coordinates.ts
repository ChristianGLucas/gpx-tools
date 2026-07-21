import { AxiomContext } from '../gen/axiomContext';
import { ExtractAllCoordinatesInput, ExtractAllCoordinatesOutput, LatLon } from '../gen/messages_pb';
import { allPointsInDocument, parseGpxDocument } from './lib/gpx';
import { allCoordinatesInKml, parseKmlDocument } from './lib/kml';
import { toGpxError } from './lib/pb';
import { loadAndParseXml } from './lib/parse_doc';
import { MAX_POINTS } from './lib/xml_parser';

/**
 * Extract every coordinate — from waypoints, route points, track points, or
 * KML placemark geometries — out of a GPX or KML document as one flat
 * lat/lon list, auto-detecting the format. The simplest node for a caller
 * that just wants "every point this file mentions" without caring about
 * GPX/KML structure. Capped at 20,000 coordinates (truncated=true past the
 * cap).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractAllCoordinates(ax: AxiomContext, input: ExtractAllCoordinatesInput): ExtractAllCoordinatesOutput {
  const xml = input.getDoc()?.getXml() ?? '';
  const out = new ExtractAllCoordinatesOutput();

  const loaded = loadAndParseXml(xml);
  if ('error' in loaded) {
    out.setOk(false);
    out.setError(toGpxError(loaded.error.code, loaded.error.message));
    return out;
  }

  let points;
  if (loaded.rootKey === 'gpx') {
    out.setFormat('gpx');
    points = allPointsInDocument(parseGpxDocument(loaded.root));
  } else if (loaded.rootKey === 'kml') {
    out.setFormat('kml');
    points = allCoordinatesInKml(parseKmlDocument(loaded.root));
  } else {
    out.setOk(false);
    out.setError(toGpxError('UNSUPPORTED_FORMAT', `Root element <${loaded.rootKey}> is neither GPX nor KML.`));
    return out;
  }

  const truncated = points.length > MAX_POINTS;
  const capped = truncated ? points.slice(0, MAX_POINTS) : points;

  out.setCoordinatesList(
    capped.map((p) => {
      const msg = new LatLon();
      msg.setLat(p.lat);
      msg.setLon(p.lon);
      return msg;
    })
  );
  out.setTruncated(truncated);
  out.setOk(true);
  return out;
}

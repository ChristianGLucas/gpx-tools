import { AxiomContext } from '../gen/axiomContext';
import { GetSummaryInput, GetSummaryOutput } from '../gen/messages_pb';
import { flattenTrackPoints } from './lib/gpx';
import { parseKmlDocument } from './lib/kml';
import { toGpxError } from './lib/pb';
import { loadAndParseXml } from './lib/parse_doc';
import { parseGpxDocument } from './lib/gpx';

/**
 * Summarize a GPX or KML document's counts in one call: format, track
 * count, route count, waypoint count, total track points, total route
 * points, and (KML only) placemark count. Auto-detects format the same way
 * DetectFormat does.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function getSummary(ax: AxiomContext, input: GetSummaryInput): GetSummaryOutput {
  const xml = input.getDoc()?.getXml() ?? '';
  const out = new GetSummaryOutput();

  const loaded = loadAndParseXml(xml);
  if ('error' in loaded) {
    out.setOk(false);
    out.setError(toGpxError(loaded.error.code, loaded.error.message));
    return out;
  }

  if (loaded.rootKey === 'gpx') {
    const doc = parseGpxDocument(loaded.root);
    out.setFormat('gpx');
    out.setTrackCount(doc.tracks.length);
    out.setRouteCount(doc.routes.length);
    out.setWaypointCount(doc.waypoints.length);
    out.setTotalTrackPoints(doc.tracks.reduce((sum, t) => sum + flattenTrackPoints(t).length, 0));
    out.setTotalRoutePoints(doc.routes.reduce((sum, r) => sum + r.points.length, 0));
    out.setPlacemarkCount(0);
    out.setOk(true);
    return out;
  }

  if (loaded.rootKey === 'kml') {
    const doc = parseKmlDocument(loaded.root);
    out.setFormat('kml');
    out.setPlacemarkCount(doc.placemarks.length);
    out.setOk(true);
    return out;
  }

  out.setOk(false);
  out.setError(
    toGpxError('UNSUPPORTED_FORMAT', `Root element <${loaded.rootKey}> is neither GPX nor KML.`)
  );
  return out;
}

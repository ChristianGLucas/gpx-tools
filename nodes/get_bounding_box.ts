import { AxiomContext } from '../gen/axiomContext';
import { GetBoundingBoxInput, GetBoundingBoxOutput } from '../gen/messages_pb';
import { allPointsInDocument, computeBoundsFromPoints, flattenTrackPoints } from './lib/gpx';
import { toBoundingBoxMsg, toGpxError } from './lib/pb';
import { loadGpxDocument } from './lib/parse_doc';

/**
 * Compute the min/max latitude/longitude bounding box over a set of points
 * — pure min/max, no distance or area math. Pass has_track_index=true with
 * a track_index to scope to one track's points; otherwise the box covers
 * every waypoint, route point, and track point in the whole document.
 * Returns EMPTY_GEOMETRY when the scoped point set is empty.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function getBoundingBox(ax: AxiomContext, input: GetBoundingBoxInput): GetBoundingBoxOutput {
  const xml = input.getDoc()?.getXml() ?? '';
  const out = new GetBoundingBoxOutput();

  const loaded = loadGpxDocument(xml);
  if ('error' in loaded) {
    out.setOk(false);
    out.setError(toGpxError(loaded.error.code, loaded.error.message));
    return out;
  }

  let points;
  if (input.getHasTrackIndex()) {
    const trackIndex = input.getTrackIndex();
    const { tracks } = loaded.doc;
    if (trackIndex < 0 || trackIndex >= tracks.length) {
      out.setOk(false);
      out.setError(
        toGpxError(
          'TRACK_INDEX_OUT_OF_RANGE',
          `track_index ${trackIndex} is out of range; document has ${tracks.length} track(s).`
        )
      );
      return out;
    }
    points = flattenTrackPoints(tracks[trackIndex]);
  } else {
    points = allPointsInDocument(loaded.doc);
  }

  const bounds = computeBoundsFromPoints(points);
  if (!bounds) {
    out.setOk(false);
    out.setError(toGpxError('EMPTY_GEOMETRY', 'The scoped point set is empty; no bounding box can be computed.'));
    return out;
  }

  out.setBounds(toBoundingBoxMsg(bounds));
  out.setOk(true);
  return out;
}

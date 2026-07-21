import { AxiomContext } from '../gen/axiomContext';
import { ElevationPoint, GetElevationProfileInput, GetElevationProfileOutput } from '../gen/messages_pb';
import { flattenTrackPoints } from './lib/gpx';
import { toGpxError } from './lib/pb';
import { loadGpxDocument } from './lib/parse_doc';
import { MAX_POINTS } from './lib/xml_parser';

/**
 * Extract a GPX track's elevation profile: the ordered elevation values
 * together with each point's index (position in the flattened point
 * sequence) and timestamp. Points with no <ele> element carry
 * has_elevation=false rather than a fabricated 0. Capped at 20,000 points
 * (truncated=true past the cap).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function getElevationProfile(ax: AxiomContext, input: GetElevationProfileInput): GetElevationProfileOutput {
  const xml = input.getDoc()?.getXml() ?? '';
  const trackIndex = input.getTrackIndex();
  const out = new GetElevationProfileOutput();

  const loaded = loadGpxDocument(xml);
  if ('error' in loaded) {
    out.setOk(false);
    out.setError(toGpxError(loaded.error.code, loaded.error.message));
    return out;
  }

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

  const points = flattenTrackPoints(tracks[trackIndex]);
  const truncated = points.length > MAX_POINTS;
  const capped = truncated ? points.slice(0, MAX_POINTS) : points;

  out.setPointsList(
    capped.map((p, index) => {
      const msg = new ElevationPoint();
      msg.setIndex(index);
      if (p.elevation !== null) {
        msg.setElevation(p.elevation);
        msg.setHasElevation(true);
      }
      if (p.time) {
        msg.setTime(p.time);
        msg.setHasTime(true);
      }
      return msg;
    })
  );
  out.setTruncated(truncated);
  out.setOk(true);
  return out;
}

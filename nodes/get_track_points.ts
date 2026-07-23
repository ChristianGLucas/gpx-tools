import { AxiomContext } from '../gen/axiomContext';
import { GetTrackPointsInput, GetTrackPointsOutput } from '../gen/messages_pb';
import { flattenTrackPoints } from './lib/gpx';
import { toGpxError, toPointMsg } from './lib/pb';
import { loadGpxDocument } from './lib/parse_doc';

/**
 * Extract one GPX track's points — lat, lon, elevation, and time — as a
 * flat array, segments concatenated in document order with each point's
 * segment_index recording which <trkseg> it came from. An out-of-range
 * track_index returns a structured TRACK_INDEX_OUT_OF_RANGE error.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function getTrackPoints(ax: AxiomContext, input: GetTrackPointsInput): GetTrackPointsOutput {
  const xml = input.getDoc()?.getXml() ?? '';
  const trackIndex = input.getTrackIndex();
  const out = new GetTrackPointsOutput();

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

  out.setPointsList(points.map((p) => toPointMsg(p)));
  out.setOk(true);
  return out;
}

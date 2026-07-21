import { AxiomContext } from '../gen/axiomContext';
import { GetTimeRangeInput, GetTimeRangeOutput } from '../gen/messages_pb';
import { flattenTrackPoints } from './lib/gpx';
import { toGpxError } from './lib/pb';
import { loadGpxDocument } from './lib/parse_doc';

/**
 * Extract a GPX track's time range: the first and last point timestamps in
 * document order, read verbatim from the file (never generated or
 * reformatted). has_range=false when the track has no timestamped points
 * at all.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function getTimeRange(ax: AxiomContext, input: GetTimeRangeInput): GetTimeRangeOutput {
  const xml = input.getDoc()?.getXml() ?? '';
  const trackIndex = input.getTrackIndex();
  const out = new GetTimeRangeOutput();

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

  const timestamped = flattenTrackPoints(tracks[trackIndex]).filter((p) => p.time !== '');
  if (timestamped.length === 0) {
    out.setHasRange(false);
    out.setOk(true);
    return out;
  }

  out.setStartTime(timestamped[0].time);
  out.setEndTime(timestamped[timestamped.length - 1].time);
  out.setHasRange(true);
  out.setOk(true);
  return out;
}

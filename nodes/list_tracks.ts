import { AxiomContext } from '../gen/axiomContext';
import { ListTracksInput, ListTracksOutput, TrackSummary } from '../gen/messages_pb';
import { flattenTrackPoints } from './lib/gpx';
import { toGpxError } from './lib/pb';
import { loadGpxDocument } from './lib/parse_doc';

/**
 * List every <trk> in a GPX document as a lightweight summary — name,
 * segment count, point count, and its 0-based index — without the full
 * point data ParseGpx/GetTrackPoints return. The index this returns is the
 * track_index every other track-scoped node (GetTrackPoints,
 * GetBoundingBox, GetElevationProfile, GetTimeRange, GpxTrackToGeoJson)
 * expects.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listTracks(ax: AxiomContext, input: ListTracksInput): ListTracksOutput {
  const xml = input.getDoc()?.getXml() ?? '';
  const out = new ListTracksOutput();

  const loaded = loadGpxDocument(xml);
  if ('error' in loaded) {
    out.setOk(false);
    out.setError(toGpxError(loaded.error.code, loaded.error.message));
    return out;
  }

  out.setTracksList(
    loaded.doc.tracks.map((t, index) => {
      const msg = new TrackSummary();
      msg.setName(t.name);
      msg.setSegmentCount(t.segments.length);
      msg.setPointCount(flattenTrackPoints(t).length);
      msg.setIndex(index);
      return msg;
    })
  );
  out.setOk(true);
  return out;
}

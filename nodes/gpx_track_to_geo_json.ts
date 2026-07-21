import { AxiomContext } from '../gen/axiomContext';
import { GeoJson, GpxTrackToGeoJsonInput } from '../gen/messages_pb';
import { flattenTrackPoints } from './lib/gpx';
import { lineStringGeoJson } from './lib/geojson';
import { loadGpxDocument } from './lib/parse_doc';

/**
 * Convert one GPX track's points to a GeoJSON (RFC 7946) LineString
 * geometry — coordinates in [longitude, latitude] axis order, elevation
 * included as the optional third coordinate when every point in the track
 * has one. Output is compatible with christiangeorgelucas/geo-tools'
 * Geometry.geojson field for direct flow composition. A track with fewer
 * than 2 points returns a structured EMPTY_GEOMETRY error (a LineString
 * requires at least 2 positions).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function gpxTrackToGeoJson(ax: AxiomContext, input: GpxTrackToGeoJsonInput): GeoJson {
  const xml = input.getDoc()?.getXml() ?? '';
  const trackIndex = input.getTrackIndex();
  const out = new GeoJson();

  const loaded = loadGpxDocument(xml);
  if ('error' in loaded) {
    out.setError(`${loaded.error.code}: ${loaded.error.message}`);
    return out;
  }

  const { tracks } = loaded.doc;
  if (trackIndex < 0 || trackIndex >= tracks.length) {
    out.setError(
      `TRACK_INDEX_OUT_OF_RANGE: track_index ${trackIndex} is out of range; document has ${tracks.length} track(s).`
    );
    return out;
  }

  const points = flattenTrackPoints(tracks[trackIndex]);
  const result = lineStringGeoJson(points);
  out.setGeojson(result.geojson);
  out.setError(result.error);
  return out;
}

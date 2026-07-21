import { GpxTrackToGeoJsonInput } from '../gen/messages_pb';
import { gpxTrackToGeoJson } from './gpx_track_to_geo_json';
import { SAMPLE_GPX } from './lib/fixtures';
import { testContext } from './lib/test_context';
import { makeDoc } from './lib/test_input';

function input(xml: string, trackIndex: number): GpxTrackToGeoJsonInput {
  const inp = new GpxTrackToGeoJsonInput();
  inp.setDoc(makeDoc(xml));
  inp.setTrackIndex(trackIndex);
  return inp;
}

describe('GpxTrackToGeoJson', () => {
  // INDEPENDENT ORACLE: expected value derived directly from RFC 7946
  // §3.1.1 (position = [longitude, latitude, elevation]) and §3.1.4
  // (LineString = an array of >= 2 positions) applied by hand to track 0's
  // three points (45.07/-122.63/100, 45.08/-122.62/110, 45.09/-122.61/120)
  // — independent of this package's own GeoJSON-serialization code.
  it('emits a GeoJSON LineString with [lon, lat, elevation] axis order (RFC 7946 independent oracle)', () => {
    const result = gpxTrackToGeoJson(testContext, input(SAMPLE_GPX, 0));
    expect(result.getError()).toBe('');
    const parsed = JSON.parse(result.getGeojson());
    expect(parsed).toEqual({
      type: 'LineString',
      coordinates: [
        [-122.63, 45.07, 100],
        [-122.62, 45.08, 110],
        [-122.61, 45.09, 120],
      ],
    });
  });

  it('drops elevation entirely (2D positions) when not every point in the track has one', () => {
    const mixed = `<gpx version="1.1"><trk><name>Mixed</name><trkseg>
      <trkpt lat="1" lon="2"><ele>5</ele></trkpt>
      <trkpt lat="3" lon="4"/>
    </trkseg></trk></gpx>`;
    const result = gpxTrackToGeoJson(testContext, input(mixed, 0));
    expect(result.getError()).toBe('');
    const parsed = JSON.parse(result.getGeojson());
    expect(parsed.coordinates).toEqual([
      [2, 1],
      [4, 3],
    ]);
  });

  it('returns EMPTY_GEOMETRY for a track with fewer than 2 points', () => {
    const result = gpxTrackToGeoJson(testContext, input(SAMPLE_GPX, 1)); // "Evening Walk" has 1 point
    expect(result.getGeojson()).toBe('');
    expect(result.getError()).toContain('EMPTY_GEOMETRY');
  });

  it('returns a structured error for an out-of-range track_index', () => {
    const result = gpxTrackToGeoJson(testContext, input(SAMPLE_GPX, 9));
    expect(result.getError()).toContain('TRACK_INDEX_OUT_OF_RANGE');
  });
});

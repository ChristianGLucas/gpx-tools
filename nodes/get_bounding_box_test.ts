import { GetBoundingBoxInput } from '../gen/messages_pb';
import { getBoundingBox } from './get_bounding_box';
import { SAMPLE_GPX } from './lib/fixtures';
import { testContext } from './lib/test_context';
import { makeDoc } from './lib/test_input';

function wholeDocInput(xml: string): GetBoundingBoxInput {
  const inp = new GetBoundingBoxInput();
  inp.setDoc(makeDoc(xml));
  inp.setHasTrackIndex(false);
  return inp;
}

function trackInput(xml: string, trackIndex: number): GetBoundingBoxInput {
  const inp = new GetBoundingBoxInput();
  inp.setDoc(makeDoc(xml));
  inp.setHasTrackIndex(true);
  inp.setTrackIndex(trackIndex);
  return inp;
}

describe('GetBoundingBox', () => {
  // INDEPENDENT ORACLE: min/max computed by hand directly from the fixture
  // text's lat/lon values (every wpt/rtept/trkpt coordinate — see
  // fixtures.ts), independent of this package's own parsing/computation
  // code. lat values: 45.05, 45.06 (wpt); 45.00, 45.01, 45.02 (rtept);
  // 45.07, 45.08, 45.09 (trk0); 45.10 (trk1) -> min 45.00, max 45.10.
  // lon values: -122.65, -122.64; -122.70, -122.69, -122.68; -122.63,
  // -122.62, -122.61; -122.60 -> min -122.70, max -122.60.
  it('computes the whole-document bounding box matching a hand-derived min/max over every point (independent oracle)', () => {
    const result = getBoundingBox(testContext, wholeDocInput(SAMPLE_GPX));
    expect(result.getOk()).toBe(true);
    const b = result.getBounds()!;
    expect(b.getMinLat()).toBeCloseTo(45.0);
    expect(b.getMaxLat()).toBeCloseTo(45.1);
    expect(b.getMinLon()).toBeCloseTo(-122.7);
    expect(b.getMaxLon()).toBeCloseTo(-122.6);
  });

  // Same independent-hand-derivation method, scoped to just track 0's
  // points (45.07/-122.63, 45.08/-122.62, 45.09/-122.61).
  it('computes a bounding box scoped to one track when has_track_index=true (independent oracle)', () => {
    const result = getBoundingBox(testContext, trackInput(SAMPLE_GPX, 0));
    expect(result.getOk()).toBe(true);
    const b = result.getBounds()!;
    expect(b.getMinLat()).toBeCloseTo(45.07);
    expect(b.getMaxLat()).toBeCloseTo(45.09);
    expect(b.getMinLon()).toBeCloseTo(-122.63);
    expect(b.getMaxLon()).toBeCloseTo(-122.61);
  });

  it('returns EMPTY_GEOMETRY for a document with zero points', () => {
    const empty = '<gpx version="1.1"><metadata><name>N</name></metadata></gpx>';
    const result = getBoundingBox(testContext, wholeDocInput(empty));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('EMPTY_GEOMETRY');
  });

  it('returns a structured error for an out-of-range track_index', () => {
    const result = getBoundingBox(testContext, trackInput(SAMPLE_GPX, 9));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('TRACK_INDEX_OUT_OF_RANGE');
  });
});

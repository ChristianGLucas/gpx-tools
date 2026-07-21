import { GetElevationProfileInput } from '../gen/messages_pb';
import { getElevationProfile } from './get_elevation_profile';
import { SAMPLE_GPX } from './lib/fixtures';
import { testContext } from './lib/test_context';
import { makeDoc } from './lib/test_input';

function input(xml: string, trackIndex: number): GetElevationProfileInput {
  const inp = new GetElevationProfileInput();
  inp.setDoc(makeDoc(xml));
  inp.setTrackIndex(trackIndex);
  return inp;
}

describe('GetElevationProfile', () => {
  it('extracts ordered elevation values with their point index and time', () => {
    const result = getElevationProfile(testContext, input(SAMPLE_GPX, 0));
    expect(result.getOk()).toBe(true);
    const points = result.getPointsList();
    expect(points).toHaveLength(3);

    expect(points[0].getIndex()).toBe(0);
    expect(points[0].getElevation()).toBeCloseTo(100);
    expect(points[0].getTime()).toBe('2024-05-01T09:00:00Z');

    expect(points[1].getIndex()).toBe(1);
    expect(points[1].getElevation()).toBeCloseTo(110);

    expect(points[2].getIndex()).toBe(2);
    expect(points[2].getElevation()).toBeCloseTo(120);
    expect(points[2].getTime()).toBe('2024-05-01T09:10:00Z');
  });

  it('reports has_elevation=false rather than a fabricated 0 for a point with no <ele>', () => {
    const result = getElevationProfile(testContext, input(SAMPLE_GPX, 1)); // "Evening Walk" has no <ele>
    expect(result.getOk()).toBe(true);
    const points = result.getPointsList();
    expect(points).toHaveLength(1);
    expect(points[0].getHasElevation()).toBe(false);
  });

  it('returns a structured error for an out-of-range track_index', () => {
    const result = getElevationProfile(testContext, input(SAMPLE_GPX, 9));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('TRACK_INDEX_OUT_OF_RANGE');
  });
});

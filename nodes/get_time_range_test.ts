import { GetTimeRangeInput } from '../gen/messages_pb';
import { getTimeRange } from './get_time_range';
import { SAMPLE_GPX } from './lib/fixtures';
import { testContext } from './lib/test_context';
import { makeDoc } from './lib/test_input';

function input(xml: string, trackIndex: number): GetTimeRangeInput {
  const inp = new GetTimeRangeInput();
  inp.setDoc(makeDoc(xml));
  inp.setTrackIndex(trackIndex);
  return inp;
}

describe('GetTimeRange', () => {
  it('extracts the first and last timestamps of a track in document order', () => {
    const result = getTimeRange(testContext, input(SAMPLE_GPX, 0));
    expect(result.getOk()).toBe(true);
    expect(result.getHasRange()).toBe(true);
    expect(result.getStartTime()).toBe('2024-05-01T09:00:00Z');
    expect(result.getEndTime()).toBe('2024-05-01T09:10:00Z');
  });

  it('returns the same timestamp for start and end on a single-point track', () => {
    const result = getTimeRange(testContext, input(SAMPLE_GPX, 1));
    expect(result.getOk()).toBe(true);
    expect(result.getHasRange()).toBe(true);
    expect(result.getStartTime()).toBe('2024-05-01T18:00:00Z');
    expect(result.getEndTime()).toBe('2024-05-01T18:00:00Z');
  });

  it('reports has_range=false for a track with no timestamped points', () => {
    const noTimes = '<gpx version="1.1"><trk><name>T</name><trkseg><trkpt lat="1" lon="2"/></trkseg></trk></gpx>';
    const result = getTimeRange(testContext, input(noTimes, 0));
    expect(result.getOk()).toBe(true);
    expect(result.getHasRange()).toBe(false);
  });

  it('returns a structured error for an out-of-range track_index', () => {
    const result = getTimeRange(testContext, input(SAMPLE_GPX, 9));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('TRACK_INDEX_OUT_OF_RANGE');
  });
});

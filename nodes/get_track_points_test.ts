import { GetTrackPointsInput } from '../gen/messages_pb';
import { getTrackPoints } from './get_track_points';
import { SAMPLE_GPX } from './lib/fixtures';
import { testContext } from './lib/test_context';
import { makeDoc } from './lib/test_input';

function input(xml: string, trackIndex: number): GetTrackPointsInput {
  const inp = new GetTrackPointsInput();
  inp.setDoc(makeDoc(xml));
  inp.setTrackIndex(trackIndex);
  return inp;
}

describe('GetTrackPoints', () => {
  it('flattens a multi-segment track into one ordered array, tagging each point with its segment_index', () => {
    const result = getTrackPoints(testContext, input(SAMPLE_GPX, 0));
    expect(result.getOk()).toBe(true);
    expect(result.getTruncated()).toBe(false);

    const points = result.getPointsList();
    expect(points).toHaveLength(3);
    expect(points[0].getLat()).toBeCloseTo(45.07);
    expect(points[0].getSegmentIndex()).toBe(0);
    expect(points[1].getSegmentIndex()).toBe(0);
    expect(points[2].getLat()).toBeCloseTo(45.09);
    expect(points[2].getSegmentIndex()).toBe(1); // second <trkseg>
    expect(points[2].getElevation()).toBeCloseTo(120);
    expect(points[2].getTime()).toBe('2024-05-01T09:10:00Z');
  });

  it('returns a structured error for an out-of-range track_index', () => {
    const result = getTrackPoints(testContext, input(SAMPLE_GPX, 5));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('TRACK_INDEX_OUT_OF_RANGE');
  });

  it('returns a structured error for a negative track_index', () => {
    const result = getTrackPoints(testContext, input(SAMPLE_GPX, -1));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('TRACK_INDEX_OUT_OF_RANGE');
  });

  it('caps points at MAX_POINTS and reports truncated=true', () => {
    let xml = '<gpx version="1.1"><trk><name>Huge</name><trkseg>';
    for (let i = 0; i < 20005; i++) {
      xml += `<trkpt lat="${(i % 90).toFixed(4)}" lon="${(i % 180).toFixed(4)}"/>`;
    }
    xml += '</trkseg></trk></gpx>';
    expect(Buffer.byteLength(xml, 'utf8')).toBeLessThan(3 * 1024 * 1024);

    const result = getTrackPoints(testContext, input(xml, 0));
    expect(result.getOk()).toBe(true);
    expect(result.getTruncated()).toBe(true);
    expect(result.getPointsList()).toHaveLength(20000);
  });

  it('is deterministic across repeated calls with the same input', () => {
    const r1 = getTrackPoints(testContext, input(SAMPLE_GPX, 0));
    const r2 = getTrackPoints(testContext, input(SAMPLE_GPX, 0));
    expect(r1.toObject()).toEqual(r2.toObject());
  });
});

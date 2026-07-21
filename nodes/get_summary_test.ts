import { GetSummaryInput } from '../gen/messages_pb';
import { getSummary } from './get_summary';
import { NOT_GPX_OR_KML_XML, SAMPLE_GPX, SAMPLE_KML } from './lib/fixtures';
import { testContext } from './lib/test_context';
import { makeDoc } from './lib/test_input';

function input(xml: string): GetSummaryInput {
  const inp = new GetSummaryInput();
  inp.setDoc(makeDoc(xml));
  return inp;
}

describe('GetSummary', () => {
  it('summarizes a GPX document: 2 tracks (4 total points), 1 route (3 points), 2 waypoints', () => {
    const result = getSummary(testContext, input(SAMPLE_GPX));
    expect(result.getOk()).toBe(true);
    expect(result.getFormat()).toBe('gpx');
    expect(result.getTrackCount()).toBe(2);
    expect(result.getRouteCount()).toBe(1);
    expect(result.getWaypointCount()).toBe(2);
    expect(result.getTotalTrackPoints()).toBe(4); // 3 (track 0) + 1 (track 1)
    expect(result.getTotalRoutePoints()).toBe(3);
    expect(result.getPlacemarkCount()).toBe(0);
  });

  it('summarizes a KML document: 4 placemarks, all GPX counts 0', () => {
    const result = getSummary(testContext, input(SAMPLE_KML));
    expect(result.getOk()).toBe(true);
    expect(result.getFormat()).toBe('kml');
    expect(result.getPlacemarkCount()).toBe(4);
    expect(result.getTrackCount()).toBe(0);
    expect(result.getRouteCount()).toBe(0);
    expect(result.getWaypointCount()).toBe(0);
  });

  it('returns UNSUPPORTED_FORMAT for a well-formed document that is neither GPX nor KML', () => {
    const result = getSummary(testContext, input(NOT_GPX_OR_KML_XML));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('UNSUPPORTED_FORMAT');
  });

  it('returns a structured error for empty input', () => {
    const result = getSummary(testContext, input(''));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('EMPTY_INPUT');
  });
});

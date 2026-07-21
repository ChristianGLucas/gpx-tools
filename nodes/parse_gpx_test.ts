import { ParseGpxInput } from '../gen/messages_pb';
import { parseGpx } from './parse_gpx';
import { MALFORMED_XML, SAMPLE_GPX, SAMPLE_KML, XXE_ATTEMPT_XML } from './lib/fixtures';
import { testContext } from './lib/test_context';
import { makeDoc } from './lib/test_input';

function input(xml: string): ParseGpxInput {
  const inp = new ParseGpxInput();
  inp.setDoc(makeDoc(xml));
  return inp;
}

describe('ParseGpx', () => {
  it('parses metadata, waypoints, routes, and tracks — every value hand-verified against the fixture text', () => {
    const result = parseGpx(testContext, input(SAMPLE_GPX));
    expect(result.getOk()).toBe(true);

    expect(result.getName()).toBe('Sample Ride');
    expect(result.getDescription()).toBe('A hand-built GPX fixture for gpx-tools tests');
    expect(result.getAuthor()).toBe('Test Author');
    expect(result.getTime()).toBe('2024-05-01T08:00:00Z');
    expect(result.getHasBounds()).toBe(true);
    expect(result.getBounds()!.getMinLat()).toBeCloseTo(45.0);
    expect(result.getBounds()!.getMaxLat()).toBeCloseTo(45.1);
    expect(result.getBounds()!.getMinLon()).toBeCloseTo(-122.7);
    expect(result.getBounds()!.getMaxLon()).toBeCloseTo(-122.6);

    const waypoints = result.getWaypointsList();
    expect(waypoints).toHaveLength(2);
    expect(waypoints[0].getName()).toBe('Trailhead');
    expect(waypoints[0].getLat()).toBeCloseTo(45.05);
    expect(waypoints[0].getLon()).toBeCloseTo(-122.65);
    expect(waypoints[0].getHasElevation()).toBe(true);
    expect(waypoints[0].getElevation()).toBeCloseTo(50.5);
    expect(waypoints[0].getSymbol()).toBe('Flag, Blue');
    expect(waypoints[1].getName()).toBe('Overlook');
    expect(waypoints[1].getHasElevation()).toBe(false);

    const routes = result.getRoutesList();
    expect(routes).toHaveLength(1);
    expect(routes[0].getName()).toBe('Planned Loop');
    expect(routes[0].getPointsList()).toHaveLength(3);
    expect(routes[0].getPointsList()[1].getElevation()).toBeCloseTo(15);

    const tracks = result.getTracksList();
    expect(tracks).toHaveLength(2);
    expect(tracks[0].getName()).toBe('Morning Run');
    expect(tracks[0].getSegmentsList()).toHaveLength(2);
    expect(tracks[0].getSegmentsList()[0].getPointsList()).toHaveLength(2);
    expect(tracks[0].getSegmentsList()[1].getPointsList()).toHaveLength(1);
    expect(tracks[1].getName()).toBe('Evening Walk');
    expect(tracks[1].getSegmentsList()).toHaveLength(1);
  });

  it('returns a structured error when the root element is not <gpx>', () => {
    const result = parseGpx(testContext, input(SAMPLE_KML));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('WRONG_ROOT_ELEMENT');
  });

  it('rejects external XML entities (XXE) with a structured error, not a crash', () => {
    const result = parseGpx(testContext, input(XXE_ATTEMPT_XML));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('XML_UNSAFE_ENTITY');
  });

  it('returns a structured error for malformed XML', () => {
    const result = parseGpx(testContext, input(MALFORMED_XML));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('PARSE_ERROR');
  });

  it('returns a structured error for empty input', () => {
    const result = parseGpx(testContext, input(''));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('EMPTY_INPUT');
  });

  it('handles a GPX 1.0-style document with no <metadata> wrapper, reading fields from the root', () => {
    const gpx10 = `<gpx version="1.0"><name>Root Name</name><desc>Root Desc</desc><time>2024-01-01T00:00:00Z</time>
      <wpt lat="1" lon="2"><name>W</name></wpt></gpx>`;
    const result = parseGpx(testContext, input(gpx10));
    expect(result.getOk()).toBe(true);
    expect(result.getName()).toBe('Root Name');
    expect(result.getDescription()).toBe('Root Desc');
    expect(result.getWaypointsList()).toHaveLength(1);
  });

  it('is deterministic across repeated calls with the same input', () => {
    const r1 = parseGpx(testContext, input(SAMPLE_GPX));
    const r2 = parseGpx(testContext, input(SAMPLE_GPX));
    expect(r1.toObject()).toEqual(r2.toObject());
  });
});

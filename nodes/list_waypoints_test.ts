import { ListWaypointsInput } from '../gen/messages_pb';
import { listWaypoints } from './list_waypoints';
import { SAMPLE_GPX } from './lib/fixtures';
import { testContext } from './lib/test_context';
import { makeDoc } from './lib/test_input';

function input(xml: string): ListWaypointsInput {
  const inp = new ListWaypointsInput();
  inp.setDoc(makeDoc(xml));
  return inp;
}

describe('ListWaypoints', () => {
  it('lists every waypoint with lat/lon/elevation/name/symbol/time', () => {
    const result = listWaypoints(testContext, input(SAMPLE_GPX));
    expect(result.getOk()).toBe(true);
    const wpts = result.getWaypointsList();
    expect(wpts).toHaveLength(2);

    expect(wpts[0].getName()).toBe('Trailhead');
    expect(wpts[0].getLat()).toBeCloseTo(45.05);
    expect(wpts[0].getLon()).toBeCloseTo(-122.65);
    expect(wpts[0].getHasElevation()).toBe(true);
    expect(wpts[0].getElevation()).toBeCloseTo(50.5);
    expect(wpts[0].getSymbol()).toBe('Flag, Blue');
    expect(wpts[0].getHasTime()).toBe(true);
    expect(wpts[0].getTime()).toBe('2024-05-01T08:01:00Z');

    expect(wpts[1].getName()).toBe('Overlook');
    expect(wpts[1].getHasElevation()).toBe(false);
    expect(wpts[1].getHasTime()).toBe(false);
  });

  it('returns an empty list for a GPX document with no waypoints', () => {
    const noWpts = '<gpx version="1.1"><trk><name>T</name></trk></gpx>';
    const result = listWaypoints(testContext, input(noWpts));
    expect(result.getOk()).toBe(true);
    expect(result.getWaypointsList()).toHaveLength(0);
  });

  it('returns a structured error for empty input', () => {
    const result = listWaypoints(testContext, input(''));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('EMPTY_INPUT');
  });
});

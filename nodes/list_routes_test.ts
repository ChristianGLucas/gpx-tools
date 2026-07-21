import { ListRoutesInput } from '../gen/messages_pb';
import { listRoutes } from './list_routes';
import { SAMPLE_GPX } from './lib/fixtures';
import { testContext } from './lib/test_context';
import { makeDoc } from './lib/test_input';

function input(xml: string): ListRoutesInput {
  const inp = new ListRoutesInput();
  inp.setDoc(makeDoc(xml));
  return inp;
}

describe('ListRoutes', () => {
  it('lists every route with its name and ordered points', () => {
    const result = listRoutes(testContext, input(SAMPLE_GPX));
    expect(result.getOk()).toBe(true);
    const routes = result.getRoutesList();
    expect(routes).toHaveLength(1);
    expect(routes[0].getName()).toBe('Planned Loop');

    const points = routes[0].getPointsList();
    expect(points).toHaveLength(3);
    expect(points[0].getLat()).toBeCloseTo(45.0);
    expect(points[0].getElevation()).toBeCloseTo(10);
    expect(points[2].getLon()).toBeCloseTo(-122.68);
  });

  it('returns an empty list for a GPX document with no routes', () => {
    const noRoutes = '<gpx version="1.1"><wpt lat="1" lon="2"/></gpx>';
    const result = listRoutes(testContext, input(noRoutes));
    expect(result.getOk()).toBe(true);
    expect(result.getRoutesList()).toHaveLength(0);
  });

  it('returns a structured error for empty input', () => {
    const result = listRoutes(testContext, input(''));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('EMPTY_INPUT');
  });
});

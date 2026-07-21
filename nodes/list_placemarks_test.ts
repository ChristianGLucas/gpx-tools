import { ListPlacemarksInput, PlacemarkSummary } from '../gen/messages_pb';
import { listPlacemarks } from './list_placemarks';
import { SAMPLE_KML } from './lib/fixtures';
import { testContext } from './lib/test_context';
import { makeDoc } from './lib/test_input';

function input(xml: string): ListPlacemarksInput {
  const inp = new ListPlacemarksInput();
  inp.setDoc(makeDoc(xml));
  return inp;
}

function byName(placemarks: PlacemarkSummary[], name: string): PlacemarkSummary {
  const found = placemarks.find((p) => p.getName() === name);
  if (!found) throw new Error(`no placemark named ${name}`);
  return found;
}

describe('ListPlacemarks', () => {
  it('lists every placemark as a lightweight summary with coordinate_count instead of full coordinates', () => {
    const result = listPlacemarks(testContext, input(SAMPLE_KML));
    expect(result.getOk()).toBe(true);
    const placemarks = result.getPlacemarksList();
    expect(placemarks).toHaveLength(4);

    expect(byName(placemarks, 'City Hall').getCoordinateCount()).toBe(1);
    expect(byName(placemarks, 'River Trail').getCoordinateCount()).toBe(3);
    expect(byName(placemarks, 'Park Boundary').getCoordinateCount()).toBe(5); // outer ring only
    expect(byName(placemarks, 'River Trail').getDescription()).toBe('A line');
  });

  it('returns a structured error for empty input', () => {
    const result = listPlacemarks(testContext, input(''));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('EMPTY_INPUT');
  });
});

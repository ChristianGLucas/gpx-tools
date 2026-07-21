import { GetKmlGeometriesInput, KmlGeometry } from '../gen/messages_pb';
import { getKmlGeometries } from './get_kml_geometries';
import { SAMPLE_KML } from './lib/fixtures';
import { testContext } from './lib/test_context';
import { makeDoc } from './lib/test_input';

function input(xml: string): GetKmlGeometriesInput {
  const inp = new GetKmlGeometriesInput();
  inp.setDoc(makeDoc(xml));
  return inp;
}

function byPlacemarkName(geoms: KmlGeometry[], name: string): KmlGeometry[] {
  return geoms.filter((g) => g.getPlacemarkName() === name);
}

describe('GetKmlGeometries', () => {
  it('splits a hole-bearing Polygon into separate outerBoundaryIs/innerBoundaryIs entries', () => {
    const result = getKmlGeometries(testContext, input(SAMPLE_KML));
    expect(result.getOk()).toBe(true);
    const all = result.getGeometriesList();

    const parkGeoms = byPlacemarkName(all, 'Park Boundary');
    expect(parkGeoms).toHaveLength(2);
    expect(parkGeoms.map((g) => g.getGeometryType()).sort()).toEqual(['innerBoundaryIs', 'outerBoundaryIs']);
    const outer = parkGeoms.find((g) => g.getGeometryType() === 'outerBoundaryIs')!;
    expect(outer.getCoordinatesList()).toHaveLength(5);
    const inner = parkGeoms.find((g) => g.getGeometryType() === 'innerBoundaryIs')!;
    expect(inner.getCoordinatesList()).toHaveLength(5);
  });

  it("splits a MultiGeometry's children into separate entries sharing the same placemark_index", () => {
    const result = getKmlGeometries(testContext, input(SAMPLE_KML));
    const multiGeoms = byPlacemarkName(result.getGeometriesList(), 'Multi Spot');
    expect(multiGeoms).toHaveLength(2);
    expect(multiGeoms.every((g) => g.getGeometryType() === 'Point')).toBe(true);
    expect(new Set(multiGeoms.map((g) => g.getPlacemarkIndex())).size).toBe(1);
  });

  it('returns every individual geometry across all 4 placemarks: 1+2+1+2 = 6 entries, 16 coordinates total', () => {
    const result = getKmlGeometries(testContext, input(SAMPLE_KML));
    const all = result.getGeometriesList();
    expect(all).toHaveLength(6);
    const totalCoords = all.reduce((sum, g) => sum + g.getCoordinatesList().length, 0);
    expect(totalCoords).toBe(16);
  });

  it('returns a structured error for empty input', () => {
    const result = getKmlGeometries(testContext, input(''));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('EMPTY_INPUT');
  });
});

import { Placemark } from '../gen/messages_pb';
import { ParseKmlInput } from '../gen/messages_pb';
import { parseKml } from './parse_kml';
import { MALFORMED_XML, SAMPLE_GPX, SAMPLE_KML, XXE_ATTEMPT_XML } from './lib/fixtures';
import { testContext } from './lib/test_context';
import { makeDoc } from './lib/test_input';

function input(xml: string): ParseKmlInput {
  const inp = new ParseKmlInput();
  inp.setDoc(makeDoc(xml));
  return inp;
}

function byName(placemarks: Placemark[], name: string): Placemark {
  const found = placemarks.find((p) => p.getName() === name);
  if (!found) throw new Error(`no placemark named ${name}`);
  return found;
}

describe('ParseKml', () => {
  it('parses the document name and every placemark, regardless of Folder nesting depth', () => {
    const result = parseKml(testContext, input(SAMPLE_KML));
    expect(result.getOk()).toBe(true);
    expect(result.getDocumentName()).toBe('Sample Places');

    const placemarks = result.getPlacemarksList();
    // All 4 placemarks found even though "River Trail" is nested one Folder
    // deep and "Park Boundary" is nested two Folders deep.
    expect(placemarks).toHaveLength(4);

    const cityHall = byName(placemarks, 'City Hall');
    expect(cityHall.getGeometryType()).toBe('Point');
    expect(cityHall.getCoordinatesList()).toHaveLength(1);
    expect(cityHall.getCoordinatesList()[0].getLat()).toBeCloseTo(45.52);
    expect(cityHall.getCoordinatesList()[0].getLon()).toBeCloseTo(-122.675);
    expect(cityHall.getCoordinatesList()[0].getElevation()).toBeCloseTo(30);

    const riverTrail = byName(placemarks, 'River Trail');
    expect(riverTrail.getGeometryType()).toBe('LineString');
    expect(riverTrail.getCoordinatesList()).toHaveLength(3);

    // Polygon: ParseKml collapses to the outer-boundary ring only (5 points,
    // a closed ring) — the inner hole is reachable via GetKmlGeometries.
    const parkBoundary = byName(placemarks, 'Park Boundary');
    expect(parkBoundary.getGeometryType()).toBe('Polygon');
    expect(parkBoundary.getCoordinatesList()).toHaveLength(5);

    const multiSpot = byName(placemarks, 'Multi Spot');
    expect(multiSpot.getGeometryType()).toBe('MultiGeometry');
  });

  it('returns a structured error when the root element is not <kml>', () => {
    const result = parseKml(testContext, input(SAMPLE_GPX));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('WRONG_ROOT_ELEMENT');
  });

  it('rejects external XML entities (XXE) with a structured error, not a crash', () => {
    const result = parseKml(testContext, input(XXE_ATTEMPT_XML.replace('gpx', 'kml')));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('XML_UNSAFE_ENTITY');
  });

  it('returns a structured error for malformed XML', () => {
    const result = parseKml(testContext, input(MALFORMED_XML));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('PARSE_ERROR');
  });

  it('is deterministic across repeated calls with the same input', () => {
    const r1 = parseKml(testContext, input(SAMPLE_KML));
    const r2 = parseKml(testContext, input(SAMPLE_KML));
    expect(r1.toObject()).toEqual(r2.toObject());
  });
});

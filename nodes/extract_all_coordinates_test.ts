import { ExtractAllCoordinatesInput } from '../gen/messages_pb';
import { extractAllCoordinates } from './extract_all_coordinates';
import { NOT_GPX_OR_KML_XML, SAMPLE_GPX, SAMPLE_KML } from './lib/fixtures';
import { testContext } from './lib/test_context';
import { makeDoc } from './lib/test_input';

function input(xml: string): ExtractAllCoordinatesInput {
  const inp = new ExtractAllCoordinatesInput();
  inp.setDoc(makeDoc(xml));
  return inp;
}

describe('ExtractAllCoordinates', () => {
  it('extracts every coordinate from a GPX document: 2 waypoints + 3 route points + 4 track points = 9', () => {
    const result = extractAllCoordinates(testContext, input(SAMPLE_GPX));
    expect(result.getOk()).toBe(true);
    expect(result.getFormat()).toBe('gpx');
    expect(result.getCoordinatesList()).toHaveLength(9);
    expect(result.getTruncated()).toBe(false);
  });

  it('extracts every coordinate from a KML document: 16 total across all placemark geometries', () => {
    const result = extractAllCoordinates(testContext, input(SAMPLE_KML));
    expect(result.getOk()).toBe(true);
    expect(result.getFormat()).toBe('kml');
    expect(result.getCoordinatesList()).toHaveLength(16);
  });

  it('returns UNSUPPORTED_FORMAT for a document that is neither GPX nor KML', () => {
    const result = extractAllCoordinates(testContext, input(NOT_GPX_OR_KML_XML));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('UNSUPPORTED_FORMAT');
  });

  it('returns a structured error for empty input', () => {
    const result = extractAllCoordinates(testContext, input(''));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('EMPTY_INPUT');
  });

  it('is deterministic across repeated calls with the same input', () => {
    const r1 = extractAllCoordinates(testContext, input(SAMPLE_GPX));
    const r2 = extractAllCoordinates(testContext, input(SAMPLE_GPX));
    expect(r1.toObject()).toEqual(r2.toObject());
  });
});

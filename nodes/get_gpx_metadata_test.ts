import { GetGpxMetadataInput } from '../gen/messages_pb';
import { getGpxMetadata } from './get_gpx_metadata';
import { SAMPLE_GPX } from './lib/fixtures';
import { testContext } from './lib/test_context';
import { makeDoc } from './lib/test_input';

function input(xml: string): GetGpxMetadataInput {
  const inp = new GetGpxMetadataInput();
  inp.setDoc(makeDoc(xml));
  return inp;
}

describe('GetGpxMetadata', () => {
  it('extracts name/description/author/time/bounds from <metadata>', () => {
    const result = getGpxMetadata(testContext, input(SAMPLE_GPX));
    expect(result.getOk()).toBe(true);
    expect(result.getName()).toBe('Sample Ride');
    expect(result.getDescription()).toBe('A hand-built GPX fixture for gpx-tools tests');
    expect(result.getAuthor()).toBe('Test Author');
    expect(result.getHasTime()).toBe(true);
    expect(result.getTime()).toBe('2024-05-01T08:00:00Z');
    expect(result.getHasBounds()).toBe(true);
    expect(result.getBounds()!.getMinLat()).toBeCloseTo(45.0);
    expect(result.getBounds()!.getMaxLon()).toBeCloseTo(-122.6);
  });

  it('reports has_bounds=false when the document has no <bounds> element', () => {
    const noBounds = '<gpx version="1.1"><metadata><name>N</name></metadata></gpx>';
    const result = getGpxMetadata(testContext, input(noBounds));
    expect(result.getOk()).toBe(true);
    expect(result.getHasBounds()).toBe(false);
  });

  it('returns a structured error for empty input', () => {
    const result = getGpxMetadata(testContext, input(''));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('EMPTY_INPUT');
  });
});

import { DetectFormatInput } from '../gen/messages_pb';
import { detectFormat } from './detect_format';
import { MALFORMED_XML, NOT_GPX_OR_KML_XML, SAMPLE_GPX, SAMPLE_KML, XXE_ATTEMPT_XML } from './lib/fixtures';
import { testContext } from './lib/test_context';
import { makeDoc } from './lib/test_input';

function input(xml: string): DetectFormatInput {
  const inp = new DetectFormatInput();
  inp.setDoc(makeDoc(xml));
  return inp;
}

describe('DetectFormat', () => {
  it('detects a GPX document by its root element', () => {
    const result = detectFormat(testContext, input(SAMPLE_GPX));
    expect(result.getOk()).toBe(true);
    expect(result.getFormat()).toBe('gpx');
  });

  it('detects a KML document by its root element', () => {
    const result = detectFormat(testContext, input(SAMPLE_KML));
    expect(result.getOk()).toBe(true);
    expect(result.getFormat()).toBe('kml');
  });

  it('returns format="unknown" (ok=true, not an error) for a well-formed non-GPX/KML document', () => {
    const result = detectFormat(testContext, input(NOT_GPX_OR_KML_XML));
    expect(result.getOk()).toBe(true);
    expect(result.getFormat()).toBe('unknown');
  });

  it('rejects external XML entities (XXE) with a structured error, not a crash', () => {
    const result = detectFormat(testContext, input(XXE_ATTEMPT_XML));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('XML_UNSAFE_ENTITY');
  });

  it('returns a structured error for malformed XML', () => {
    const result = detectFormat(testContext, input(MALFORMED_XML));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('PARSE_ERROR');
  });

  it('returns a structured error for empty input', () => {
    const result = detectFormat(testContext, input(''));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('EMPTY_INPUT');
  });

  it('is deterministic across repeated calls with the same input', () => {
    const r1 = detectFormat(testContext, input(SAMPLE_GPX));
    const r2 = detectFormat(testContext, input(SAMPLE_GPX));
    expect(r1.toObject()).toEqual(r2.toObject());
  });
});

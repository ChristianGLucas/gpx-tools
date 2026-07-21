import { MAX_XML_DEPTH, exceedsMaxDepth, parseXml } from './xml_parser';

describe('exceedsMaxDepth', () => {
  it('does not flag a normal shallow document', () => {
    expect(exceedsMaxDepth('<gpx><metadata><name>x</name></metadata><wpt lat="1" lon="2"/></gpx>', MAX_XML_DEPTH)).toBe(
      false
    );
  });

  it('does not inflate depth for self-closing sibling tags (a large flat document of many <trkpt/>)', () => {
    // A real, large, FLAT GPX file — thousands of sibling self-closing
    // <trkpt/> elements at the SAME nesting level — must never be flagged;
    // a naive "count every '<' as +1 depth" scan would wrongly reject it.
    let xml = '<gpx><trk><trkseg>';
    for (let i = 0; i < 5000; i++) xml += '<trkpt lat="1" lon="2"/>';
    xml += '</trkseg></trk></gpx>';
    expect(exceedsMaxDepth(xml, MAX_XML_DEPTH)).toBe(false);
  });

  it('flags a document built almost entirely of one repeated nested empty-element tag', () => {
    const depth = MAX_XML_DEPTH + 50;
    const xml = '<a>'.repeat(depth) + '</a>'.repeat(depth);
    expect(exceedsMaxDepth(xml, MAX_XML_DEPTH)).toBe(true);
  });

  it('does not flag a document exactly at the cap', () => {
    const xml = '<a>'.repeat(MAX_XML_DEPTH) + 'x' + '</a>'.repeat(MAX_XML_DEPTH);
    expect(exceedsMaxDepth(xml, MAX_XML_DEPTH)).toBe(false);
  });
});

describe('parseXml — EXCESSIVE_NESTING guard', () => {
  it('rejects pathologically deep nesting BEFORE the real parser runs, with a structured error', () => {
    const depth = MAX_XML_DEPTH + 100;
    const xml = '<a>'.repeat(depth) + '</a>'.repeat(depth);
    const result = parseXml(xml);
    expect('error' in result).toBe(true);
    if ('error' in result) {
      expect(result.error.code).toBe('EXCESSIVE_NESTING');
    }
  });
});

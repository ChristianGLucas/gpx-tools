import { allCoordinatesInKml, parseCoordinatesText } from './kml';

describe('parseCoordinatesText', () => {
  it('parses whitespace/newline-separated "lon,lat,alt" tuples', () => {
    const points = parseCoordinatesText('-122.4,37.8,10 -122.5,37.9,20\n-122.6,38.0,30');
    expect(points).toEqual([
      { lat: 37.8, lon: -122.4, elevation: 10, time: '', segmentIndex: 0 },
      { lat: 37.9, lon: -122.5, elevation: 20, time: '', segmentIndex: 0 },
      { lat: 38.0, lon: -122.6, elevation: 30, time: '', segmentIndex: 0 },
    ]);
  });

  it('handles a 2-tuple (no altitude) as elevation=null', () => {
    const points = parseCoordinatesText('-122.4,37.8');
    expect(points).toEqual([{ lat: 37.8, lon: -122.4, elevation: null, time: '', segmentIndex: 0 }]);
  });

  it('returns an empty array for empty/whitespace-only text', () => {
    expect(parseCoordinatesText('')).toEqual([]);
    expect(parseCoordinatesText('   \n  ')).toEqual([]);
  });

  it('skips a malformed tuple (fewer than 2 comma-separated values) rather than throwing', () => {
    const points = parseCoordinatesText('-122.4,37.8 garbage -122.5,37.9');
    expect(points).toHaveLength(2);
  });

  it('skips a tuple with a non-numeric lon/lat rather than propagating NaN', () => {
    const points = parseCoordinatesText('notanumber,37.8 -122.5,37.9');
    expect(points).toHaveLength(1);
    expect(points[0].lon).toBeCloseTo(-122.5);
  });
});

describe('allCoordinatesInKml', () => {
  it('does not crash on a single LineString with a very large coordinate count (no size cap; must not stack-overflow via array spread)', () => {
    const n = 150000;
    const parts: string[] = [];
    for (let i = 0; i < n; i++) parts.push(`${-122 + (i % 100) * 0.001},${37 + (i % 100) * 0.001}`);
    const doc = {
      documentName: 'Huge',
      placemarks: [
        {
          name: 'Huge Line',
          description: '',
          geometryType: 'LineString',
          coordinates: [],
          index: 0,
          geometries: [{ geometryType: 'LineString', coordinates: parseCoordinatesText(parts.join(' ')) }],
        },
      ],
    };
    const coords = allCoordinatesInKml(doc);
    expect(coords).toHaveLength(n);
  });
});

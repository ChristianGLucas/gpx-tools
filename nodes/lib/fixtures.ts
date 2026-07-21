// Shared hand-built GPX/KML fixtures used by every node test, plus their
// hand-verified expected values (independent of this package's own code —
// derived by reading the fixture text and applying the GPX 1.1 / KML 2.2
// spec rules directly, then cross-checked once against actual output; see
// the retrospective for the one real surprise that check caught: KML
// Placemarks collect in fast-xml-parser's *key-first-encountered* order,
// not strict document order, whenever a repeated tag name is interrupted by
// a different sibling tag — SAMPLE_KML is built to exercise exactly that).
//
// SAMPLE_GPX: 1 metadata block, 2 waypoints, 1 route (3 points), 2 tracks
// (track 0 has 2 segments/3 points total, track 1 has 1 segment/1 point).
export const SAMPLE_GPX = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="AxiomTest" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>Sample Ride</name>
    <desc>A hand-built GPX fixture for gpx-tools tests</desc>
    <author><name>Test Author</name></author>
    <time>2024-05-01T08:00:00Z</time>
    <bounds minlat="45.000000" minlon="-122.700000" maxlat="45.100000" maxlon="-122.600000"/>
  </metadata>
  <wpt lat="45.050000" lon="-122.650000">
    <ele>50.5</ele>
    <time>2024-05-01T08:01:00Z</time>
    <name>Trailhead</name>
    <sym>Flag, Blue</sym>
  </wpt>
  <wpt lat="45.060000" lon="-122.640000">
    <name>Overlook</name>
  </wpt>
  <rte>
    <name>Planned Loop</name>
    <rtept lat="45.000000" lon="-122.700000"><ele>10</ele></rtept>
    <rtept lat="45.010000" lon="-122.690000"><ele>15</ele></rtept>
    <rtept lat="45.020000" lon="-122.680000"><ele>20</ele></rtept>
  </rte>
  <trk>
    <name>Morning Run</name>
    <trkseg>
      <trkpt lat="45.070000" lon="-122.630000">
        <ele>100</ele>
        <time>2024-05-01T09:00:00Z</time>
      </trkpt>
      <trkpt lat="45.080000" lon="-122.620000">
        <ele>110</ele>
        <time>2024-05-01T09:05:00Z</time>
      </trkpt>
    </trkseg>
    <trkseg>
      <trkpt lat="45.090000" lon="-122.610000">
        <ele>120</ele>
        <time>2024-05-01T09:10:00Z</time>
      </trkpt>
    </trkseg>
  </trk>
  <trk>
    <name>Evening Walk</name>
    <trkseg>
      <trkpt lat="45.100000" lon="-122.600000">
        <time>2024-05-01T18:00:00Z</time>
      </trkpt>
    </trkseg>
  </trk>
</gpx>`;

// SAMPLE_KML: a Document containing (in document order) a Point placemark, a
// Folder with a LineString placemark and a nested Folder with a
// hole-bearing Polygon placemark, then a trailing MultiGeometry placemark —
// deliberately interleaving Placemark and Folder siblings so the recursive
// collector's actual behavior (verified empirically, see note above) is
// exercised, not merely assumed.
export const SAMPLE_KML = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Sample Places</name>
    <Placemark>
      <name>City Hall</name>
      <description>A single point</description>
      <Point>
        <coordinates>-122.6750,45.5200,30</coordinates>
      </Point>
    </Placemark>
    <Folder>
      <name>Trails</name>
      <Placemark>
        <name>River Trail</name>
        <description>A line</description>
        <LineString>
          <coordinates>
            -122.700,45.500,10 -122.690,45.510,15 -122.680,45.520,20
          </coordinates>
        </LineString>
      </Placemark>
      <Folder>
        <name>Nested</name>
        <Placemark>
          <name>Park Boundary</name>
          <description>A polygon with a hole</description>
          <Polygon>
            <outerBoundaryIs>
              <LinearRing>
                <coordinates>
                  -122.60,45.60,0 -122.50,45.60,0 -122.50,45.70,0 -122.60,45.70,0 -122.60,45.60,0
                </coordinates>
              </LinearRing>
            </outerBoundaryIs>
            <innerBoundaryIs>
              <LinearRing>
                <coordinates>
                  -122.58,45.62,0 -122.52,45.62,0 -122.52,45.68,0 -122.58,45.68,0 -122.58,45.62,0
                </coordinates>
              </LinearRing>
            </innerBoundaryIs>
          </Polygon>
        </Placemark>
      </Folder>
    </Folder>
    <Placemark>
      <name>Multi Spot</name>
      <MultiGeometry>
        <Point><coordinates>-122.4,45.4,0</coordinates></Point>
        <Point><coordinates>-122.3,45.3,0</coordinates></Point>
      </MultiGeometry>
    </Placemark>
  </Document>
</kml>`;

export const MALFORMED_XML = '<gpx><wpt lat="1" lon="2"></gpx>'; // mismatched close tag

export const XXE_ATTEMPT_XML = `<?xml version="1.0"?>
<!DOCTYPE gpx [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
<gpx version="1.1"><metadata><name>&xxe;</name></metadata></gpx>`;

export const NOT_GPX_OR_KML_XML = '<root><item>hello</item></root>';

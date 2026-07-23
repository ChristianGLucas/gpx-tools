# gpx-tools

Deterministic parsing and structural inspection of GPS track and geographic
markup files — **GPX** (GPS Exchange Format: tracks, routes, waypoints from
Garmin/Strava/fitness devices) and **KML** (Keyhole Markup Language: Google
Earth placemarks and geometries) — over caller-supplied **text only**. No
network, no wall-clock (timestamps are read verbatim from the document,
never generated), no randomness.

This package **parses the file formats**; it does not reimplement
coordinate math. For distance/bearing/area/etc., compose its GeoJSON output
into [`geo-tools`](https://github.com/ChristianGLucas/geo-tools).

Built for the [Axiom](https://axiomide.com) marketplace, handle
`christiangeorgelucas`.

## What it wraps

- **[fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser)**
  (MIT, NaturalIntelligence) — parses the XML. External entities and DTDs
  are rejected outright (no XXE) rather than resolved. This package's own
  value-add is the GPX/KML schema knowledge layered on top.

## Nodes

**GPX**

| Node | What it does |
|---|---|
| `DetectFormat` | Classify a document as `gpx`, `kml`, or `unknown` by root element. |
| `ParseGpx` | Full structured parse: metadata, waypoints, routes, tracks (with segments/points). |
| `ListTracks` | Every track's name, segment count, point count, and index. |
| `GetTrackPoints` | One track's points (lat/lon/elevation/time), segments flattened. |
| `ListWaypoints` | Every waypoint: lat/lon/elevation/name/symbol/time. |
| `ListRoutes` | Every route: name + ordered route points. |
| `GetGpxMetadata` | Just the `<metadata>` block: name/description/author/time/bounds. |
| `GetBoundingBox` | Min/max lat/lon over a track or the whole document — pure min/max, no distance math. |
| `GetElevationProfile` | A track's ordered elevation values with point index/time. |
| `GetTimeRange` | A track's first/last point timestamps. |
| `GetSummary` | Counts (tracks/routes/waypoints/points/placemarks) for a GPX or KML document. |
| `GpxTrackToGeoJson` | A track → a GeoJSON LineString (RFC 7946, `[lon,lat]`), geo-tools-compatible. |
| `ExtractAllCoordinates` | Every coordinate in the document as a flat lat/lon list. |

**KML**

| Node | What it does |
|---|---|
| `ParseKml` | Document name + every placemark (name/description/geometry type/coordinates), regardless of `<Folder>` nesting depth. |
| `ListPlacemarks` | Lightweight per-placemark summary (geometry type + coordinate count). |
| `GetKmlGeometries` | Every individual geometry, including each Polygon ring and MultiGeometry child separately. |
| `KmlToGeoJson` | Every placemark geometry → one GeoJSON GeometryCollection (RFC 7946, `[lon,lat]`), geo-tools-compatible. |

## Safety

- Malformed input always returns a structured `{code, message}` error —
  never a crash.
- Every node is a pure, stateless, single-input-to-single-output transform.
  Size, memory, and resource limits are the Axiom platform's concern, not
  this package's.

## License

MIT — Copyright (c) 2026 Christian George Lucas.

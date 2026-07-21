import { AxiomContext } from '../gen/axiomContext';
import { GetKmlGeometriesInput, GetKmlGeometriesOutput, KmlGeometry } from '../gen/messages_pb';
import { toGpxError, toPointMsg } from './lib/pb';
import { loadKmlDocument } from './lib/parse_doc';
import { MAX_POINTS } from './lib/xml_parser';

/**
 * Extract every geometry from every KML placemark individually, including
 * every ring of a Polygon (outerBoundaryIs and each innerBoundaryIs
 * separately) and every child geometry of a MultiGeometry — where
 * ParseKml/ListPlacemarks collapse a placemark to one geometry_type, this
 * returns one entry per actual geometry element, each tagged with the
 * placemark it belongs to. Capped at 20,000 coordinates total
 * (truncated=true past the cap).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function getKmlGeometries(ax: AxiomContext, input: GetKmlGeometriesInput): GetKmlGeometriesOutput {
  const xml = input.getDoc()?.getXml() ?? '';
  const out = new GetKmlGeometriesOutput();

  const loaded = loadKmlDocument(xml);
  if ('error' in loaded) {
    out.setOk(false);
    out.setError(toGpxError(loaded.error.code, loaded.error.message));
    return out;
  }

  const entries: { geometryType: string; coordinates: ReturnType<typeof toPointMsg>[]; placemarkIndex: number; placemarkName: string }[] = [];
  let totalCoords = 0;
  let truncated = false;

  outer: for (const pm of loaded.doc.placemarks) {
    for (const geom of pm.geometries) {
      if (totalCoords >= MAX_POINTS) {
        truncated = true;
        break outer;
      }
      const remaining = MAX_POINTS - totalCoords;
      const coordsSlice = geom.coordinates.length > remaining ? geom.coordinates.slice(0, remaining) : geom.coordinates;
      if (coordsSlice.length < geom.coordinates.length) truncated = true;
      totalCoords += coordsSlice.length;
      entries.push({
        geometryType: geom.geometryType,
        coordinates: coordsSlice.map((c) => toPointMsg(c)),
        placemarkIndex: pm.index,
        placemarkName: pm.name,
      });
    }
  }

  out.setGeometriesList(
    entries.map((e) => {
      const msg = new KmlGeometry();
      msg.setGeometryType(e.geometryType);
      msg.setCoordinatesList(e.coordinates);
      msg.setPlacemarkIndex(e.placemarkIndex);
      msg.setPlacemarkName(e.placemarkName);
      return msg;
    })
  );
  out.setTruncated(truncated);
  out.setOk(true);
  return out;
}

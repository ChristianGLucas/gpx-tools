import { AxiomContext } from '../gen/axiomContext';
import { GetKmlGeometriesInput, GetKmlGeometriesOutput, KmlGeometry } from '../gen/messages_pb';
import { toGpxError, toPointMsg } from './lib/pb';
import { loadKmlDocument } from './lib/parse_doc';

/**
 * Extract every geometry from every KML placemark individually, including
 * every ring of a Polygon (outerBoundaryIs and each innerBoundaryIs
 * separately) and every child geometry of a MultiGeometry — where
 * ParseKml/ListPlacemarks collapse a placemark to one geometry_type, this
 * returns one entry per actual geometry element, each tagged with the
 * placemark it belongs to.
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

  for (const pm of loaded.doc.placemarks) {
    for (const geom of pm.geometries) {
      entries.push({
        geometryType: geom.geometryType,
        coordinates: geom.coordinates.map((c) => toPointMsg(c)),
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
  out.setOk(true);
  return out;
}

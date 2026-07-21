import { AxiomContext } from '../gen/axiomContext';
import { Placemark, ParseKmlInput, ParseKmlOutput } from '../gen/messages_pb';
import { toGpxError, toPointMsg } from './lib/pb';
import { loadKmlDocument } from './lib/parse_doc';

/**
 * Parse a KML document into its document name and every <Placemark>: name,
 * description, geometry type (Point/LineString/Polygon/MultiGeometry), and
 * flattened coordinates. For a Polygon this returns only the outer-
 * boundary ring's coordinates and for a MultiGeometry only its first child
 * geometry — use GetKmlGeometries for every ring and every child geometry
 * individually. A document whose root element is not <kml> returns a
 * structured WRONG_ROOT_ELEMENT error.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function parseKml(ax: AxiomContext, input: ParseKmlInput): ParseKmlOutput {
  const xml = input.getDoc()?.getXml() ?? '';
  const out = new ParseKmlOutput();

  const loaded = loadKmlDocument(xml);
  if ('error' in loaded) {
    out.setOk(false);
    out.setError(toGpxError(loaded.error.code, loaded.error.message));
    return out;
  }

  out.setDocumentName(loaded.doc.documentName);
  out.setPlacemarksList(
    loaded.doc.placemarks.map((pm) => {
      const msg = new Placemark();
      msg.setName(pm.name);
      msg.setDescription(pm.description);
      msg.setGeometryType(pm.geometryType);
      msg.setCoordinatesList(pm.coordinates.map((c) => toPointMsg(c)));
      msg.setIndex(pm.index);
      return msg;
    })
  );
  out.setOk(true);
  return out;
}

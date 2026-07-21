import { AxiomContext } from '../gen/axiomContext';
import { ListPlacemarksInput, ListPlacemarksOutput, PlacemarkSummary } from '../gen/messages_pb';
import { toGpxError } from './lib/pb';
import { loadKmlDocument } from './lib/parse_doc';

/**
 * List every KML <Placemark> as a lightweight summary — name, description,
 * geometry type, coordinate count, and its 0-based index — without the
 * full coordinate arrays ParseKml/GetKmlGeometries return.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listPlacemarks(ax: AxiomContext, input: ListPlacemarksInput): ListPlacemarksOutput {
  const xml = input.getDoc()?.getXml() ?? '';
  const out = new ListPlacemarksOutput();

  const loaded = loadKmlDocument(xml);
  if ('error' in loaded) {
    out.setOk(false);
    out.setError(toGpxError(loaded.error.code, loaded.error.message));
    return out;
  }

  out.setPlacemarksList(
    loaded.doc.placemarks.map((pm) => {
      const msg = new PlacemarkSummary();
      msg.setName(pm.name);
      msg.setDescription(pm.description);
      msg.setGeometryType(pm.geometryType);
      msg.setCoordinateCount(pm.coordinates.length);
      msg.setIndex(pm.index);
      return msg;
    })
  );
  out.setOk(true);
  return out;
}

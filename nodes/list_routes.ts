import { AxiomContext } from '../gen/axiomContext';
import { ListRoutesInput, ListRoutesOutput, Route } from '../gen/messages_pb';
import { toGpxError, toPointMsg } from './lib/pb';
import { loadGpxDocument } from './lib/parse_doc';

/**
 * List every <rte> in a GPX document: its name and its ordered route points
 * (a planned path, distinct from a recorded <trk> track).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listRoutes(ax: AxiomContext, input: ListRoutesInput): ListRoutesOutput {
  const xml = input.getDoc()?.getXml() ?? '';
  const out = new ListRoutesOutput();

  const loaded = loadGpxDocument(xml);
  if ('error' in loaded) {
    out.setOk(false);
    out.setError(toGpxError(loaded.error.code, loaded.error.message));
    return out;
  }

  out.setRoutesList(
    loaded.doc.routes.map((r) => {
      const msg = new Route();
      msg.setName(r.name);
      msg.setPointsList(r.points.map((p) => toPointMsg(p)));
      return msg;
    })
  );
  out.setOk(true);
  return out;
}

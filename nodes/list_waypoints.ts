import { AxiomContext } from '../gen/axiomContext';
import { ListWaypointsInput, ListWaypointsOutput, Waypoint } from '../gen/messages_pb';
import { toGpxError } from './lib/pb';
import { loadGpxDocument } from './lib/parse_doc';

/**
 * List every <wpt> in a GPX document: lat, lon, elevation, name, symbol
 * (the GPX <sym> display-icon name), and time.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listWaypoints(ax: AxiomContext, input: ListWaypointsInput): ListWaypointsOutput {
  const xml = input.getDoc()?.getXml() ?? '';
  const out = new ListWaypointsOutput();

  const loaded = loadGpxDocument(xml);
  if ('error' in loaded) {
    out.setOk(false);
    out.setError(toGpxError(loaded.error.code, loaded.error.message));
    return out;
  }

  out.setWaypointsList(
    loaded.doc.waypoints.map((w) => {
      const msg = new Waypoint();
      msg.setLat(w.lat);
      msg.setLon(w.lon);
      if (w.elevation !== null) {
        msg.setElevation(w.elevation);
        msg.setHasElevation(true);
      }
      msg.setName(w.name);
      msg.setSymbol(w.symbol);
      if (w.time) {
        msg.setTime(w.time);
        msg.setHasTime(true);
      }
      return msg;
    })
  );
  out.setOk(true);
  return out;
}

import { AxiomContext } from '../gen/axiomContext';
import { ParseGpxInput, ParseGpxOutput, Route, Track, TrackSegment, Waypoint } from '../gen/messages_pb';
import { toBoundingBoxMsg, toGpxError, toPointMsg } from './lib/pb';
import { loadGpxDocument } from './lib/parse_doc';

/**
 * Parse a full GPX 1.0/1.1 document into its normalized structure in one
 * call: document-level metadata (name, description, author, time, bounds),
 * every waypoint, every route, and every track (with its segments and
 * points). The general-purpose parse the other GPX nodes are specialized
 * views of. A document whose root element is not <gpx> returns a
 * structured WRONG_ROOT_ELEMENT error.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function parseGpx(ax: AxiomContext, input: ParseGpxInput): ParseGpxOutput {
  const xml = input.getDoc()?.getXml() ?? '';
  const out = new ParseGpxOutput();

  const loaded = loadGpxDocument(xml);
  if ('error' in loaded) {
    out.setOk(false);
    out.setError(toGpxError(loaded.error.code, loaded.error.message));
    return out;
  }

  const { doc } = loaded;
  out.setName(doc.metadata.name);
  out.setDescription(doc.metadata.description);
  out.setAuthor(doc.metadata.author);
  if (doc.metadata.time) {
    out.setTime(doc.metadata.time);
    out.setHasTime(true);
  }
  if (doc.metadata.bounds) {
    out.setBounds(toBoundingBoxMsg(doc.metadata.bounds));
    out.setHasBounds(true);
  }

  out.setWaypointsList(
    doc.waypoints.map((w) => {
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

  out.setRoutesList(
    doc.routes.map((r) => {
      const msg = new Route();
      msg.setName(r.name);
      msg.setPointsList(r.points.map(toPointMsg));
      return msg;
    })
  );

  out.setTracksList(
    doc.tracks.map((t) => {
      const msg = new Track();
      msg.setName(t.name);
      msg.setSegmentsList(
        t.segments.map((seg) => {
          const segMsg = new TrackSegment();
          segMsg.setPointsList(seg.points.map((p) => toPointMsg(p)));
          return segMsg;
        })
      );
      return msg;
    })
  );

  out.setOk(true);
  return out;
}

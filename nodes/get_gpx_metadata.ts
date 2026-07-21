import { AxiomContext } from '../gen/axiomContext';
import { GetGpxMetadataInput, GetGpxMetadataOutput } from '../gen/messages_pb';
import { toBoundingBoxMsg, toGpxError } from './lib/pb';
import { loadGpxDocument } from './lib/parse_doc';

/**
 * Extract just the GPX <metadata> block — name, description, author, time,
 * and bounds — without waypoints/routes/tracks. has_bounds is false when
 * the document has no <bounds> element (bounds are optional in GPX and not
 * every producer emits them); use GetBoundingBox to compute one from the
 * actual points instead.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function getGpxMetadata(ax: AxiomContext, input: GetGpxMetadataInput): GetGpxMetadataOutput {
  const xml = input.getDoc()?.getXml() ?? '';
  const out = new GetGpxMetadataOutput();

  const loaded = loadGpxDocument(xml);
  if ('error' in loaded) {
    out.setOk(false);
    out.setError(toGpxError(loaded.error.code, loaded.error.message));
    return out;
  }

  const { metadata } = loaded.doc;
  out.setName(metadata.name);
  out.setDescription(metadata.description);
  out.setAuthor(metadata.author);
  if (metadata.time) {
    out.setTime(metadata.time);
    out.setHasTime(true);
  }
  if (metadata.bounds) {
    out.setBounds(toBoundingBoxMsg(metadata.bounds));
    out.setHasBounds(true);
  }
  out.setOk(true);
  return out;
}

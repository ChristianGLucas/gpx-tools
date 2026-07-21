import { AxiomContext } from '../gen/axiomContext';
import { DetectFormatInput, DetectFormatOutput } from '../gen/messages_pb';
import { toGpxError } from './lib/pb';
import { loadAndParseXml } from './lib/parse_doc';
import { detectFormatFromRootKey } from './lib/xml_parser';

/**
 * Detect whether a document's root element identifies it as GPX or KML.
 * Returns format="unknown" (ok=true) rather than an error when the root
 * element is neither — callers that need a hard failure should check the
 * returned format themselves.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function detectFormat(ax: AxiomContext, input: DetectFormatInput): DetectFormatOutput {
  const xml = input.getDoc()?.getXml() ?? '';
  const out = new DetectFormatOutput();

  const loaded = loadAndParseXml(xml);
  if ('error' in loaded) {
    out.setOk(false);
    out.setError(toGpxError(loaded.error.code, loaded.error.message));
    return out;
  }

  out.setFormat(detectFormatFromRootKey(loaded.rootKey));
  out.setOk(true);
  return out;
}

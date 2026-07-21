// Tiny shared test helper: build a Doc message from raw XML text. Used by
// every node test file instead of each hand-rolling `new Doc(); ...setXml`.

import { Doc } from '../../gen/messages_pb';

export function makeDoc(xml: string): Doc {
  const doc = new Doc();
  doc.setXml(xml);
  return doc;
}

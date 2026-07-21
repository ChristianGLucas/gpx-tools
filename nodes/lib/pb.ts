// Shared internal-shape -> protobuf-message conversion helpers, used by
// every node so the getX/setX/hasX field-population logic exists in one
// place rather than being re-typed 17 times.

import { BoundingBox as BoundingBoxMsg, GpxError as GpxErrorMsg, Point as PointMsg } from '../../gen/messages_pb';
import { Bounds, PointData } from './gpx';

export function toPointMsg(p: PointData): PointMsg {
  const msg = new PointMsg();
  msg.setLat(p.lat);
  msg.setLon(p.lon);
  if (p.elevation !== null) {
    msg.setElevation(p.elevation);
    msg.setHasElevation(true);
  }
  if (p.time) {
    msg.setTime(p.time);
    msg.setHasTime(true);
  }
  msg.setSegmentIndex(p.segmentIndex);
  return msg;
}

export function toGpxError(code: string, message: string): GpxErrorMsg {
  const err = new GpxErrorMsg();
  err.setCode(code);
  err.setMessage(message);
  return err;
}

export function toBoundingBoxMsg(b: Bounds): BoundingBoxMsg {
  const msg = new BoundingBoxMsg();
  msg.setMinLat(b.minLat);
  msg.setMaxLat(b.maxLat);
  msg.setMinLon(b.minLon);
  msg.setMaxLon(b.maxLon);
  return msg;
}

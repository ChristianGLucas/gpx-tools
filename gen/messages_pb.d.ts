// package: christiangeorgelucas.gpx_tools
// file: messages.proto

import * as jspb from "google-protobuf";

export class Doc extends jspb.Message {
  getXml(): string;
  setXml(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Doc.AsObject;
  static toObject(includeInstance: boolean, msg: Doc): Doc.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Doc, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Doc;
  static deserializeBinaryFromReader(message: Doc, reader: jspb.BinaryReader): Doc;
}

export namespace Doc {
  export type AsObject = {
    xml: string,
  }
}

export class GpxError extends jspb.Message {
  getCode(): string;
  setCode(value: string): void;

  getMessage(): string;
  setMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GpxError.AsObject;
  static toObject(includeInstance: boolean, msg: GpxError): GpxError.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GpxError, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GpxError;
  static deserializeBinaryFromReader(message: GpxError, reader: jspb.BinaryReader): GpxError;
}

export namespace GpxError {
  export type AsObject = {
    code: string,
    message: string,
  }
}

export class Point extends jspb.Message {
  getLat(): number;
  setLat(value: number): void;

  getLon(): number;
  setLon(value: number): void;

  getElevation(): number;
  setElevation(value: number): void;

  getHasElevation(): boolean;
  setHasElevation(value: boolean): void;

  getTime(): string;
  setTime(value: string): void;

  getHasTime(): boolean;
  setHasTime(value: boolean): void;

  getSegmentIndex(): number;
  setSegmentIndex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Point.AsObject;
  static toObject(includeInstance: boolean, msg: Point): Point.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Point, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Point;
  static deserializeBinaryFromReader(message: Point, reader: jspb.BinaryReader): Point;
}

export namespace Point {
  export type AsObject = {
    lat: number,
    lon: number,
    elevation: number,
    hasElevation: boolean,
    time: string,
    hasTime: boolean,
    segmentIndex: number,
  }
}

export class TrackSegment extends jspb.Message {
  clearPointsList(): void;
  getPointsList(): Array<Point>;
  setPointsList(value: Array<Point>): void;
  addPoints(value?: Point, index?: number): Point;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrackSegment.AsObject;
  static toObject(includeInstance: boolean, msg: TrackSegment): TrackSegment.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TrackSegment, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrackSegment;
  static deserializeBinaryFromReader(message: TrackSegment, reader: jspb.BinaryReader): TrackSegment;
}

export namespace TrackSegment {
  export type AsObject = {
    pointsList: Array<Point.AsObject>,
  }
}

export class Track extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  clearSegmentsList(): void;
  getSegmentsList(): Array<TrackSegment>;
  setSegmentsList(value: Array<TrackSegment>): void;
  addSegments(value?: TrackSegment, index?: number): TrackSegment;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Track.AsObject;
  static toObject(includeInstance: boolean, msg: Track): Track.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Track, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Track;
  static deserializeBinaryFromReader(message: Track, reader: jspb.BinaryReader): Track;
}

export namespace Track {
  export type AsObject = {
    name: string,
    segmentsList: Array<TrackSegment.AsObject>,
  }
}

export class Route extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  clearPointsList(): void;
  getPointsList(): Array<Point>;
  setPointsList(value: Array<Point>): void;
  addPoints(value?: Point, index?: number): Point;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Route.AsObject;
  static toObject(includeInstance: boolean, msg: Route): Route.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Route, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Route;
  static deserializeBinaryFromReader(message: Route, reader: jspb.BinaryReader): Route;
}

export namespace Route {
  export type AsObject = {
    name: string,
    pointsList: Array<Point.AsObject>,
  }
}

export class Waypoint extends jspb.Message {
  getLat(): number;
  setLat(value: number): void;

  getLon(): number;
  setLon(value: number): void;

  getElevation(): number;
  setElevation(value: number): void;

  getHasElevation(): boolean;
  setHasElevation(value: boolean): void;

  getName(): string;
  setName(value: string): void;

  getSymbol(): string;
  setSymbol(value: string): void;

  getTime(): string;
  setTime(value: string): void;

  getHasTime(): boolean;
  setHasTime(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Waypoint.AsObject;
  static toObject(includeInstance: boolean, msg: Waypoint): Waypoint.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Waypoint, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Waypoint;
  static deserializeBinaryFromReader(message: Waypoint, reader: jspb.BinaryReader): Waypoint;
}

export namespace Waypoint {
  export type AsObject = {
    lat: number,
    lon: number,
    elevation: number,
    hasElevation: boolean,
    name: string,
    symbol: string,
    time: string,
    hasTime: boolean,
  }
}

export class BoundingBox extends jspb.Message {
  getMinLat(): number;
  setMinLat(value: number): void;

  getMaxLat(): number;
  setMaxLat(value: number): void;

  getMinLon(): number;
  setMinLon(value: number): void;

  getMaxLon(): number;
  setMaxLon(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BoundingBox.AsObject;
  static toObject(includeInstance: boolean, msg: BoundingBox): BoundingBox.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BoundingBox, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BoundingBox;
  static deserializeBinaryFromReader(message: BoundingBox, reader: jspb.BinaryReader): BoundingBox;
}

export namespace BoundingBox {
  export type AsObject = {
    minLat: number,
    maxLat: number,
    minLon: number,
    maxLon: number,
  }
}

export class GeoJson extends jspb.Message {
  getGeojson(): string;
  setGeojson(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GeoJson.AsObject;
  static toObject(includeInstance: boolean, msg: GeoJson): GeoJson.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GeoJson, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GeoJson;
  static deserializeBinaryFromReader(message: GeoJson, reader: jspb.BinaryReader): GeoJson;
}

export namespace GeoJson {
  export type AsObject = {
    geojson: string,
    error: string,
  }
}

export class DetectFormatInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): Doc | undefined;
  setDoc(value?: Doc): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DetectFormatInput.AsObject;
  static toObject(includeInstance: boolean, msg: DetectFormatInput): DetectFormatInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DetectFormatInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DetectFormatInput;
  static deserializeBinaryFromReader(message: DetectFormatInput, reader: jspb.BinaryReader): DetectFormatInput;
}

export namespace DetectFormatInput {
  export type AsObject = {
    doc?: Doc.AsObject,
  }
}

export class DetectFormatOutput extends jspb.Message {
  getFormat(): string;
  setFormat(value: string): void;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): GpxError | undefined;
  setError(value?: GpxError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DetectFormatOutput.AsObject;
  static toObject(includeInstance: boolean, msg: DetectFormatOutput): DetectFormatOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DetectFormatOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DetectFormatOutput;
  static deserializeBinaryFromReader(message: DetectFormatOutput, reader: jspb.BinaryReader): DetectFormatOutput;
}

export namespace DetectFormatOutput {
  export type AsObject = {
    format: string,
    ok: boolean,
    error?: GpxError.AsObject,
  }
}

export class ParseGpxInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): Doc | undefined;
  setDoc(value?: Doc): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParseGpxInput.AsObject;
  static toObject(includeInstance: boolean, msg: ParseGpxInput): ParseGpxInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParseGpxInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParseGpxInput;
  static deserializeBinaryFromReader(message: ParseGpxInput, reader: jspb.BinaryReader): ParseGpxInput;
}

export namespace ParseGpxInput {
  export type AsObject = {
    doc?: Doc.AsObject,
  }
}

export class ParseGpxOutput extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getAuthor(): string;
  setAuthor(value: string): void;

  getTime(): string;
  setTime(value: string): void;

  getHasTime(): boolean;
  setHasTime(value: boolean): void;

  hasBounds(): boolean;
  clearBounds(): void;
  getBounds(): BoundingBox | undefined;
  setBounds(value?: BoundingBox): void;

  getHasBounds(): boolean;
  setHasBounds(value: boolean): void;

  clearWaypointsList(): void;
  getWaypointsList(): Array<Waypoint>;
  setWaypointsList(value: Array<Waypoint>): void;
  addWaypoints(value?: Waypoint, index?: number): Waypoint;

  clearRoutesList(): void;
  getRoutesList(): Array<Route>;
  setRoutesList(value: Array<Route>): void;
  addRoutes(value?: Route, index?: number): Route;

  clearTracksList(): void;
  getTracksList(): Array<Track>;
  setTracksList(value: Array<Track>): void;
  addTracks(value?: Track, index?: number): Track;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): GpxError | undefined;
  setError(value?: GpxError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParseGpxOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ParseGpxOutput): ParseGpxOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParseGpxOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParseGpxOutput;
  static deserializeBinaryFromReader(message: ParseGpxOutput, reader: jspb.BinaryReader): ParseGpxOutput;
}

export namespace ParseGpxOutput {
  export type AsObject = {
    name: string,
    description: string,
    author: string,
    time: string,
    hasTime: boolean,
    bounds?: BoundingBox.AsObject,
    hasBounds: boolean,
    waypointsList: Array<Waypoint.AsObject>,
    routesList: Array<Route.AsObject>,
    tracksList: Array<Track.AsObject>,
    ok: boolean,
    error?: GpxError.AsObject,
  }
}

export class ListTracksInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): Doc | undefined;
  setDoc(value?: Doc): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListTracksInput.AsObject;
  static toObject(includeInstance: boolean, msg: ListTracksInput): ListTracksInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListTracksInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListTracksInput;
  static deserializeBinaryFromReader(message: ListTracksInput, reader: jspb.BinaryReader): ListTracksInput;
}

export namespace ListTracksInput {
  export type AsObject = {
    doc?: Doc.AsObject,
  }
}

export class TrackSummary extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getSegmentCount(): number;
  setSegmentCount(value: number): void;

  getPointCount(): number;
  setPointCount(value: number): void;

  getIndex(): number;
  setIndex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrackSummary.AsObject;
  static toObject(includeInstance: boolean, msg: TrackSummary): TrackSummary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TrackSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrackSummary;
  static deserializeBinaryFromReader(message: TrackSummary, reader: jspb.BinaryReader): TrackSummary;
}

export namespace TrackSummary {
  export type AsObject = {
    name: string,
    segmentCount: number,
    pointCount: number,
    index: number,
  }
}

export class ListTracksOutput extends jspb.Message {
  clearTracksList(): void;
  getTracksList(): Array<TrackSummary>;
  setTracksList(value: Array<TrackSummary>): void;
  addTracks(value?: TrackSummary, index?: number): TrackSummary;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): GpxError | undefined;
  setError(value?: GpxError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListTracksOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ListTracksOutput): ListTracksOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListTracksOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListTracksOutput;
  static deserializeBinaryFromReader(message: ListTracksOutput, reader: jspb.BinaryReader): ListTracksOutput;
}

export namespace ListTracksOutput {
  export type AsObject = {
    tracksList: Array<TrackSummary.AsObject>,
    ok: boolean,
    error?: GpxError.AsObject,
  }
}

export class GetTrackPointsInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): Doc | undefined;
  setDoc(value?: Doc): void;

  getTrackIndex(): number;
  setTrackIndex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTrackPointsInput.AsObject;
  static toObject(includeInstance: boolean, msg: GetTrackPointsInput): GetTrackPointsInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetTrackPointsInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTrackPointsInput;
  static deserializeBinaryFromReader(message: GetTrackPointsInput, reader: jspb.BinaryReader): GetTrackPointsInput;
}

export namespace GetTrackPointsInput {
  export type AsObject = {
    doc?: Doc.AsObject,
    trackIndex: number,
  }
}

export class GetTrackPointsOutput extends jspb.Message {
  clearPointsList(): void;
  getPointsList(): Array<Point>;
  setPointsList(value: Array<Point>): void;
  addPoints(value?: Point, index?: number): Point;

  getTruncated(): boolean;
  setTruncated(value: boolean): void;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): GpxError | undefined;
  setError(value?: GpxError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTrackPointsOutput.AsObject;
  static toObject(includeInstance: boolean, msg: GetTrackPointsOutput): GetTrackPointsOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetTrackPointsOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTrackPointsOutput;
  static deserializeBinaryFromReader(message: GetTrackPointsOutput, reader: jspb.BinaryReader): GetTrackPointsOutput;
}

export namespace GetTrackPointsOutput {
  export type AsObject = {
    pointsList: Array<Point.AsObject>,
    truncated: boolean,
    ok: boolean,
    error?: GpxError.AsObject,
  }
}

export class ListWaypointsInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): Doc | undefined;
  setDoc(value?: Doc): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListWaypointsInput.AsObject;
  static toObject(includeInstance: boolean, msg: ListWaypointsInput): ListWaypointsInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListWaypointsInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListWaypointsInput;
  static deserializeBinaryFromReader(message: ListWaypointsInput, reader: jspb.BinaryReader): ListWaypointsInput;
}

export namespace ListWaypointsInput {
  export type AsObject = {
    doc?: Doc.AsObject,
  }
}

export class ListWaypointsOutput extends jspb.Message {
  clearWaypointsList(): void;
  getWaypointsList(): Array<Waypoint>;
  setWaypointsList(value: Array<Waypoint>): void;
  addWaypoints(value?: Waypoint, index?: number): Waypoint;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): GpxError | undefined;
  setError(value?: GpxError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListWaypointsOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ListWaypointsOutput): ListWaypointsOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListWaypointsOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListWaypointsOutput;
  static deserializeBinaryFromReader(message: ListWaypointsOutput, reader: jspb.BinaryReader): ListWaypointsOutput;
}

export namespace ListWaypointsOutput {
  export type AsObject = {
    waypointsList: Array<Waypoint.AsObject>,
    ok: boolean,
    error?: GpxError.AsObject,
  }
}

export class ListRoutesInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): Doc | undefined;
  setDoc(value?: Doc): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListRoutesInput.AsObject;
  static toObject(includeInstance: boolean, msg: ListRoutesInput): ListRoutesInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListRoutesInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListRoutesInput;
  static deserializeBinaryFromReader(message: ListRoutesInput, reader: jspb.BinaryReader): ListRoutesInput;
}

export namespace ListRoutesInput {
  export type AsObject = {
    doc?: Doc.AsObject,
  }
}

export class ListRoutesOutput extends jspb.Message {
  clearRoutesList(): void;
  getRoutesList(): Array<Route>;
  setRoutesList(value: Array<Route>): void;
  addRoutes(value?: Route, index?: number): Route;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): GpxError | undefined;
  setError(value?: GpxError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListRoutesOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ListRoutesOutput): ListRoutesOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListRoutesOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListRoutesOutput;
  static deserializeBinaryFromReader(message: ListRoutesOutput, reader: jspb.BinaryReader): ListRoutesOutput;
}

export namespace ListRoutesOutput {
  export type AsObject = {
    routesList: Array<Route.AsObject>,
    ok: boolean,
    error?: GpxError.AsObject,
  }
}

export class GetGpxMetadataInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): Doc | undefined;
  setDoc(value?: Doc): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetGpxMetadataInput.AsObject;
  static toObject(includeInstance: boolean, msg: GetGpxMetadataInput): GetGpxMetadataInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetGpxMetadataInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetGpxMetadataInput;
  static deserializeBinaryFromReader(message: GetGpxMetadataInput, reader: jspb.BinaryReader): GetGpxMetadataInput;
}

export namespace GetGpxMetadataInput {
  export type AsObject = {
    doc?: Doc.AsObject,
  }
}

export class GetGpxMetadataOutput extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getAuthor(): string;
  setAuthor(value: string): void;

  getTime(): string;
  setTime(value: string): void;

  getHasTime(): boolean;
  setHasTime(value: boolean): void;

  hasBounds(): boolean;
  clearBounds(): void;
  getBounds(): BoundingBox | undefined;
  setBounds(value?: BoundingBox): void;

  getHasBounds(): boolean;
  setHasBounds(value: boolean): void;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): GpxError | undefined;
  setError(value?: GpxError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetGpxMetadataOutput.AsObject;
  static toObject(includeInstance: boolean, msg: GetGpxMetadataOutput): GetGpxMetadataOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetGpxMetadataOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetGpxMetadataOutput;
  static deserializeBinaryFromReader(message: GetGpxMetadataOutput, reader: jspb.BinaryReader): GetGpxMetadataOutput;
}

export namespace GetGpxMetadataOutput {
  export type AsObject = {
    name: string,
    description: string,
    author: string,
    time: string,
    hasTime: boolean,
    bounds?: BoundingBox.AsObject,
    hasBounds: boolean,
    ok: boolean,
    error?: GpxError.AsObject,
  }
}

export class GetBoundingBoxInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): Doc | undefined;
  setDoc(value?: Doc): void;

  getTrackIndex(): number;
  setTrackIndex(value: number): void;

  getHasTrackIndex(): boolean;
  setHasTrackIndex(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBoundingBoxInput.AsObject;
  static toObject(includeInstance: boolean, msg: GetBoundingBoxInput): GetBoundingBoxInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetBoundingBoxInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBoundingBoxInput;
  static deserializeBinaryFromReader(message: GetBoundingBoxInput, reader: jspb.BinaryReader): GetBoundingBoxInput;
}

export namespace GetBoundingBoxInput {
  export type AsObject = {
    doc?: Doc.AsObject,
    trackIndex: number,
    hasTrackIndex: boolean,
  }
}

export class GetBoundingBoxOutput extends jspb.Message {
  hasBounds(): boolean;
  clearBounds(): void;
  getBounds(): BoundingBox | undefined;
  setBounds(value?: BoundingBox): void;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): GpxError | undefined;
  setError(value?: GpxError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBoundingBoxOutput.AsObject;
  static toObject(includeInstance: boolean, msg: GetBoundingBoxOutput): GetBoundingBoxOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetBoundingBoxOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBoundingBoxOutput;
  static deserializeBinaryFromReader(message: GetBoundingBoxOutput, reader: jspb.BinaryReader): GetBoundingBoxOutput;
}

export namespace GetBoundingBoxOutput {
  export type AsObject = {
    bounds?: BoundingBox.AsObject,
    ok: boolean,
    error?: GpxError.AsObject,
  }
}

export class GetElevationProfileInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): Doc | undefined;
  setDoc(value?: Doc): void;

  getTrackIndex(): number;
  setTrackIndex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetElevationProfileInput.AsObject;
  static toObject(includeInstance: boolean, msg: GetElevationProfileInput): GetElevationProfileInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetElevationProfileInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetElevationProfileInput;
  static deserializeBinaryFromReader(message: GetElevationProfileInput, reader: jspb.BinaryReader): GetElevationProfileInput;
}

export namespace GetElevationProfileInput {
  export type AsObject = {
    doc?: Doc.AsObject,
    trackIndex: number,
  }
}

export class ElevationPoint extends jspb.Message {
  getIndex(): number;
  setIndex(value: number): void;

  getElevation(): number;
  setElevation(value: number): void;

  getHasElevation(): boolean;
  setHasElevation(value: boolean): void;

  getTime(): string;
  setTime(value: string): void;

  getHasTime(): boolean;
  setHasTime(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ElevationPoint.AsObject;
  static toObject(includeInstance: boolean, msg: ElevationPoint): ElevationPoint.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ElevationPoint, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ElevationPoint;
  static deserializeBinaryFromReader(message: ElevationPoint, reader: jspb.BinaryReader): ElevationPoint;
}

export namespace ElevationPoint {
  export type AsObject = {
    index: number,
    elevation: number,
    hasElevation: boolean,
    time: string,
    hasTime: boolean,
  }
}

export class GetElevationProfileOutput extends jspb.Message {
  clearPointsList(): void;
  getPointsList(): Array<ElevationPoint>;
  setPointsList(value: Array<ElevationPoint>): void;
  addPoints(value?: ElevationPoint, index?: number): ElevationPoint;

  getTruncated(): boolean;
  setTruncated(value: boolean): void;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): GpxError | undefined;
  setError(value?: GpxError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetElevationProfileOutput.AsObject;
  static toObject(includeInstance: boolean, msg: GetElevationProfileOutput): GetElevationProfileOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetElevationProfileOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetElevationProfileOutput;
  static deserializeBinaryFromReader(message: GetElevationProfileOutput, reader: jspb.BinaryReader): GetElevationProfileOutput;
}

export namespace GetElevationProfileOutput {
  export type AsObject = {
    pointsList: Array<ElevationPoint.AsObject>,
    truncated: boolean,
    ok: boolean,
    error?: GpxError.AsObject,
  }
}

export class GetTimeRangeInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): Doc | undefined;
  setDoc(value?: Doc): void;

  getTrackIndex(): number;
  setTrackIndex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTimeRangeInput.AsObject;
  static toObject(includeInstance: boolean, msg: GetTimeRangeInput): GetTimeRangeInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetTimeRangeInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTimeRangeInput;
  static deserializeBinaryFromReader(message: GetTimeRangeInput, reader: jspb.BinaryReader): GetTimeRangeInput;
}

export namespace GetTimeRangeInput {
  export type AsObject = {
    doc?: Doc.AsObject,
    trackIndex: number,
  }
}

export class GetTimeRangeOutput extends jspb.Message {
  getStartTime(): string;
  setStartTime(value: string): void;

  getEndTime(): string;
  setEndTime(value: string): void;

  getHasRange(): boolean;
  setHasRange(value: boolean): void;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): GpxError | undefined;
  setError(value?: GpxError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTimeRangeOutput.AsObject;
  static toObject(includeInstance: boolean, msg: GetTimeRangeOutput): GetTimeRangeOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetTimeRangeOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTimeRangeOutput;
  static deserializeBinaryFromReader(message: GetTimeRangeOutput, reader: jspb.BinaryReader): GetTimeRangeOutput;
}

export namespace GetTimeRangeOutput {
  export type AsObject = {
    startTime: string,
    endTime: string,
    hasRange: boolean,
    ok: boolean,
    error?: GpxError.AsObject,
  }
}

export class GetSummaryInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): Doc | undefined;
  setDoc(value?: Doc): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSummaryInput.AsObject;
  static toObject(includeInstance: boolean, msg: GetSummaryInput): GetSummaryInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetSummaryInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSummaryInput;
  static deserializeBinaryFromReader(message: GetSummaryInput, reader: jspb.BinaryReader): GetSummaryInput;
}

export namespace GetSummaryInput {
  export type AsObject = {
    doc?: Doc.AsObject,
  }
}

export class GetSummaryOutput extends jspb.Message {
  getFormat(): string;
  setFormat(value: string): void;

  getTrackCount(): number;
  setTrackCount(value: number): void;

  getRouteCount(): number;
  setRouteCount(value: number): void;

  getWaypointCount(): number;
  setWaypointCount(value: number): void;

  getTotalTrackPoints(): number;
  setTotalTrackPoints(value: number): void;

  getTotalRoutePoints(): number;
  setTotalRoutePoints(value: number): void;

  getPlacemarkCount(): number;
  setPlacemarkCount(value: number): void;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): GpxError | undefined;
  setError(value?: GpxError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSummaryOutput.AsObject;
  static toObject(includeInstance: boolean, msg: GetSummaryOutput): GetSummaryOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetSummaryOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSummaryOutput;
  static deserializeBinaryFromReader(message: GetSummaryOutput, reader: jspb.BinaryReader): GetSummaryOutput;
}

export namespace GetSummaryOutput {
  export type AsObject = {
    format: string,
    trackCount: number,
    routeCount: number,
    waypointCount: number,
    totalTrackPoints: number,
    totalRoutePoints: number,
    placemarkCount: number,
    ok: boolean,
    error?: GpxError.AsObject,
  }
}

export class Placemark extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getGeometryType(): string;
  setGeometryType(value: string): void;

  clearCoordinatesList(): void;
  getCoordinatesList(): Array<Point>;
  setCoordinatesList(value: Array<Point>): void;
  addCoordinates(value?: Point, index?: number): Point;

  getIndex(): number;
  setIndex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Placemark.AsObject;
  static toObject(includeInstance: boolean, msg: Placemark): Placemark.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Placemark, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Placemark;
  static deserializeBinaryFromReader(message: Placemark, reader: jspb.BinaryReader): Placemark;
}

export namespace Placemark {
  export type AsObject = {
    name: string,
    description: string,
    geometryType: string,
    coordinatesList: Array<Point.AsObject>,
    index: number,
  }
}

export class ParseKmlInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): Doc | undefined;
  setDoc(value?: Doc): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParseKmlInput.AsObject;
  static toObject(includeInstance: boolean, msg: ParseKmlInput): ParseKmlInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParseKmlInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParseKmlInput;
  static deserializeBinaryFromReader(message: ParseKmlInput, reader: jspb.BinaryReader): ParseKmlInput;
}

export namespace ParseKmlInput {
  export type AsObject = {
    doc?: Doc.AsObject,
  }
}

export class ParseKmlOutput extends jspb.Message {
  getDocumentName(): string;
  setDocumentName(value: string): void;

  clearPlacemarksList(): void;
  getPlacemarksList(): Array<Placemark>;
  setPlacemarksList(value: Array<Placemark>): void;
  addPlacemarks(value?: Placemark, index?: number): Placemark;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): GpxError | undefined;
  setError(value?: GpxError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParseKmlOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ParseKmlOutput): ParseKmlOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParseKmlOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParseKmlOutput;
  static deserializeBinaryFromReader(message: ParseKmlOutput, reader: jspb.BinaryReader): ParseKmlOutput;
}

export namespace ParseKmlOutput {
  export type AsObject = {
    documentName: string,
    placemarksList: Array<Placemark.AsObject>,
    ok: boolean,
    error?: GpxError.AsObject,
  }
}

export class ListPlacemarksInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): Doc | undefined;
  setDoc(value?: Doc): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListPlacemarksInput.AsObject;
  static toObject(includeInstance: boolean, msg: ListPlacemarksInput): ListPlacemarksInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListPlacemarksInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListPlacemarksInput;
  static deserializeBinaryFromReader(message: ListPlacemarksInput, reader: jspb.BinaryReader): ListPlacemarksInput;
}

export namespace ListPlacemarksInput {
  export type AsObject = {
    doc?: Doc.AsObject,
  }
}

export class PlacemarkSummary extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getGeometryType(): string;
  setGeometryType(value: string): void;

  getCoordinateCount(): number;
  setCoordinateCount(value: number): void;

  getIndex(): number;
  setIndex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlacemarkSummary.AsObject;
  static toObject(includeInstance: boolean, msg: PlacemarkSummary): PlacemarkSummary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlacemarkSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlacemarkSummary;
  static deserializeBinaryFromReader(message: PlacemarkSummary, reader: jspb.BinaryReader): PlacemarkSummary;
}

export namespace PlacemarkSummary {
  export type AsObject = {
    name: string,
    description: string,
    geometryType: string,
    coordinateCount: number,
    index: number,
  }
}

export class ListPlacemarksOutput extends jspb.Message {
  clearPlacemarksList(): void;
  getPlacemarksList(): Array<PlacemarkSummary>;
  setPlacemarksList(value: Array<PlacemarkSummary>): void;
  addPlacemarks(value?: PlacemarkSummary, index?: number): PlacemarkSummary;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): GpxError | undefined;
  setError(value?: GpxError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListPlacemarksOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ListPlacemarksOutput): ListPlacemarksOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListPlacemarksOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListPlacemarksOutput;
  static deserializeBinaryFromReader(message: ListPlacemarksOutput, reader: jspb.BinaryReader): ListPlacemarksOutput;
}

export namespace ListPlacemarksOutput {
  export type AsObject = {
    placemarksList: Array<PlacemarkSummary.AsObject>,
    ok: boolean,
    error?: GpxError.AsObject,
  }
}

export class GetKmlGeometriesInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): Doc | undefined;
  setDoc(value?: Doc): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetKmlGeometriesInput.AsObject;
  static toObject(includeInstance: boolean, msg: GetKmlGeometriesInput): GetKmlGeometriesInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetKmlGeometriesInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetKmlGeometriesInput;
  static deserializeBinaryFromReader(message: GetKmlGeometriesInput, reader: jspb.BinaryReader): GetKmlGeometriesInput;
}

export namespace GetKmlGeometriesInput {
  export type AsObject = {
    doc?: Doc.AsObject,
  }
}

export class KmlGeometry extends jspb.Message {
  getGeometryType(): string;
  setGeometryType(value: string): void;

  clearCoordinatesList(): void;
  getCoordinatesList(): Array<Point>;
  setCoordinatesList(value: Array<Point>): void;
  addCoordinates(value?: Point, index?: number): Point;

  getPlacemarkIndex(): number;
  setPlacemarkIndex(value: number): void;

  getPlacemarkName(): string;
  setPlacemarkName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KmlGeometry.AsObject;
  static toObject(includeInstance: boolean, msg: KmlGeometry): KmlGeometry.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KmlGeometry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KmlGeometry;
  static deserializeBinaryFromReader(message: KmlGeometry, reader: jspb.BinaryReader): KmlGeometry;
}

export namespace KmlGeometry {
  export type AsObject = {
    geometryType: string,
    coordinatesList: Array<Point.AsObject>,
    placemarkIndex: number,
    placemarkName: string,
  }
}

export class GetKmlGeometriesOutput extends jspb.Message {
  clearGeometriesList(): void;
  getGeometriesList(): Array<KmlGeometry>;
  setGeometriesList(value: Array<KmlGeometry>): void;
  addGeometries(value?: KmlGeometry, index?: number): KmlGeometry;

  getTruncated(): boolean;
  setTruncated(value: boolean): void;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): GpxError | undefined;
  setError(value?: GpxError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetKmlGeometriesOutput.AsObject;
  static toObject(includeInstance: boolean, msg: GetKmlGeometriesOutput): GetKmlGeometriesOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetKmlGeometriesOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetKmlGeometriesOutput;
  static deserializeBinaryFromReader(message: GetKmlGeometriesOutput, reader: jspb.BinaryReader): GetKmlGeometriesOutput;
}

export namespace GetKmlGeometriesOutput {
  export type AsObject = {
    geometriesList: Array<KmlGeometry.AsObject>,
    truncated: boolean,
    ok: boolean,
    error?: GpxError.AsObject,
  }
}

export class GpxTrackToGeoJsonInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): Doc | undefined;
  setDoc(value?: Doc): void;

  getTrackIndex(): number;
  setTrackIndex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GpxTrackToGeoJsonInput.AsObject;
  static toObject(includeInstance: boolean, msg: GpxTrackToGeoJsonInput): GpxTrackToGeoJsonInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GpxTrackToGeoJsonInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GpxTrackToGeoJsonInput;
  static deserializeBinaryFromReader(message: GpxTrackToGeoJsonInput, reader: jspb.BinaryReader): GpxTrackToGeoJsonInput;
}

export namespace GpxTrackToGeoJsonInput {
  export type AsObject = {
    doc?: Doc.AsObject,
    trackIndex: number,
  }
}

export class KmlToGeoJsonInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): Doc | undefined;
  setDoc(value?: Doc): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KmlToGeoJsonInput.AsObject;
  static toObject(includeInstance: boolean, msg: KmlToGeoJsonInput): KmlToGeoJsonInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KmlToGeoJsonInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KmlToGeoJsonInput;
  static deserializeBinaryFromReader(message: KmlToGeoJsonInput, reader: jspb.BinaryReader): KmlToGeoJsonInput;
}

export namespace KmlToGeoJsonInput {
  export type AsObject = {
    doc?: Doc.AsObject,
  }
}

export class ExtractAllCoordinatesInput extends jspb.Message {
  hasDoc(): boolean;
  clearDoc(): void;
  getDoc(): Doc | undefined;
  setDoc(value?: Doc): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractAllCoordinatesInput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractAllCoordinatesInput): ExtractAllCoordinatesInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractAllCoordinatesInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractAllCoordinatesInput;
  static deserializeBinaryFromReader(message: ExtractAllCoordinatesInput, reader: jspb.BinaryReader): ExtractAllCoordinatesInput;
}

export namespace ExtractAllCoordinatesInput {
  export type AsObject = {
    doc?: Doc.AsObject,
  }
}

export class LatLon extends jspb.Message {
  getLat(): number;
  setLat(value: number): void;

  getLon(): number;
  setLon(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LatLon.AsObject;
  static toObject(includeInstance: boolean, msg: LatLon): LatLon.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LatLon, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LatLon;
  static deserializeBinaryFromReader(message: LatLon, reader: jspb.BinaryReader): LatLon;
}

export namespace LatLon {
  export type AsObject = {
    lat: number,
    lon: number,
  }
}

export class ExtractAllCoordinatesOutput extends jspb.Message {
  clearCoordinatesList(): void;
  getCoordinatesList(): Array<LatLon>;
  setCoordinatesList(value: Array<LatLon>): void;
  addCoordinates(value?: LatLon, index?: number): LatLon;

  getTruncated(): boolean;
  setTruncated(value: boolean): void;

  getFormat(): string;
  setFormat(value: string): void;

  getOk(): boolean;
  setOk(value: boolean): void;

  hasError(): boolean;
  clearError(): void;
  getError(): GpxError | undefined;
  setError(value?: GpxError): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractAllCoordinatesOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractAllCoordinatesOutput): ExtractAllCoordinatesOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractAllCoordinatesOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractAllCoordinatesOutput;
  static deserializeBinaryFromReader(message: ExtractAllCoordinatesOutput, reader: jspb.BinaryReader): ExtractAllCoordinatesOutput;
}

export namespace ExtractAllCoordinatesOutput {
  export type AsObject = {
    coordinatesList: Array<LatLon.AsObject>,
    truncated: boolean,
    format: string,
    ok: boolean,
    error?: GpxError.AsObject,
  }
}


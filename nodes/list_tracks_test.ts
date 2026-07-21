import { ListTracksInput } from '../gen/messages_pb';
import { listTracks } from './list_tracks';
import { SAMPLE_GPX, SAMPLE_KML } from './lib/fixtures';
import { testContext } from './lib/test_context';
import { makeDoc } from './lib/test_input';

function input(xml: string): ListTracksInput {
  const inp = new ListTracksInput();
  inp.setDoc(makeDoc(xml));
  return inp;
}

describe('ListTracks', () => {
  it('lists each track with its name, segment count, point count, and index', () => {
    const result = listTracks(testContext, input(SAMPLE_GPX));
    expect(result.getOk()).toBe(true);
    const tracks = result.getTracksList();
    expect(tracks).toHaveLength(2);

    expect(tracks[0].getName()).toBe('Morning Run');
    expect(tracks[0].getSegmentCount()).toBe(2);
    expect(tracks[0].getPointCount()).toBe(3); // 2 in segment 0 + 1 in segment 1
    expect(tracks[0].getIndex()).toBe(0);

    expect(tracks[1].getName()).toBe('Evening Walk');
    expect(tracks[1].getSegmentCount()).toBe(1);
    expect(tracks[1].getPointCount()).toBe(1);
    expect(tracks[1].getIndex()).toBe(1);
  });

  it('returns an empty list (ok=true) for a GPX document with no tracks', () => {
    const noTracks = '<gpx version="1.1"><wpt lat="1" lon="2"><name>W</name></wpt></gpx>';
    const result = listTracks(testContext, input(noTracks));
    expect(result.getOk()).toBe(true);
    expect(result.getTracksList()).toHaveLength(0);
  });

  it('returns a structured error when the root element is not <gpx>', () => {
    const result = listTracks(testContext, input(SAMPLE_KML));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('WRONG_ROOT_ELEMENT');
  });

  it('returns a structured error for empty input', () => {
    const result = listTracks(testContext, input(''));
    expect(result.getOk()).toBe(false);
    expect(result.getError()?.getCode()).toBe('EMPTY_INPUT');
  });
});

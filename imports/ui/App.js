import React, { useEffect, useState, useCallback } from 'react';
import prettyBytes from 'pretty-bytes';
import { get } from 'lodash';
import useInputValue from '@rehooks/input-value';
import { Meteor } from 'meteor/meteor';

// eslint-disable-next-line max-len
const defaultMagnet =
  'magnet:?xt=urn:btih:0986d8bb18900e56983575f2f3f3c62b7b8d42f4&dn=Tolkien.2019.1080p.WEBRip.x264-RARBG&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2770&tr=udp%3A%2F%2F9.rarbg.to%3A2710';

const App = () => {
  const [torrentData, setTorrentData] = useState({});
  const magnetInput = useInputValue(defaultMagnet);
  const magnetUri = magnetInput.value;

  useEffect(() => {
    Streamy.on('torrents.download', setTorrentData);
    return () => Streamy.off('torrents.download');
  }, []);

  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      Meteor.call('torrents.download', magnetUri);
    },
    [magnetUri],
  );

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea style={{ width: '100%' }} {...magnetInput} />
        <input type="submit" />
      </form>
      <h3>{`Download speed: ${prettyBytes(get(torrentData, 'downloadSpeed', 0))}`}</h3>
    </div>
  );
};
export default App;

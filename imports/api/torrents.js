/* eslint-disable no-console */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import WebTorrent from 'webtorrent';

Meteor.methods({
  'torrents.download'(magnetURI) {
    check(magnetURI, String);

    const client = new WebTorrent();
    client.add(magnetURI, { path: '/tmp/' }, function(torrent) {
      torrent.on('download', () => {
        const emittedData = {
          progress: torrent.progress,
          downloadSpeed: torrent.downloadSpeed,
        };
        Streamy.broadcast('torrents.download', emittedData);
      });
    });
  },
});

// Meteor.startup(() => {
//   Streamy.on('torrents.download', function(data, from) {
//     setInterval(() => {
//       Streamy.emit('torrents.download', { date: Date.now() }, from);
//     }, 2000);
//   });
// });

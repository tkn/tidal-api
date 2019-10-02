'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Class */
var Tidal = function () {

  /**
   *
   * @param {object} [options] - Tidal options (optional)
   * @param {string} [options.countryCode=US] - Tidal country code
   * @param {number} [options.limit=1000] - API results limit
   */
  function Tidal() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Tidal);

    this.url = 'https://api.tidal.com/v1';
    this.webToken = 'wdgaB1CilGA-S_s2';
    this.countryCode = options.countryCode || 'US';
    this.limit = options.limit || 1000;
    this.api = _axios2.default.create({
      baseURL: this.url,
      headers: {
        'x-tidal-token': this.webToken
      }
    });
    // some base params for GET requests
    this.params = 'limit=' + this.limit + '&countryCode=' + this.countryCode;
    // params for Tidal pages that require a locale and device type
    this.localeParams = 'locale=en_' + this.countryCode + '&deviceType=BROWSER&countryCode=' + this.countryCode;
  }

  /**
  * login to Tidal in order to use methods that require authentication
  * @param {string} username - Tidal username or email
  * @param {string} password - Tidal password
  * @example tidal.login('username', 'password')
  * // returns a promise that resolves to
  {
    userId: 49927020,
    sessionId: '24d3d406-e6b9-457a-bf57-eac7b113a20c',
    countryCode: 'US'
  }
  * @returns {Promise}
  * @fulfil {Object} - user data object (see example for object properties)
  * @reject {Error}
  */


  (0, _createClass3.default)(Tidal, [{
    key: 'login',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(username, password) {
        var params, res;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(!username || !password)) {
                  _context.next = 2;
                  break;
                }

                throw new Error('Username and password are required arguments of login()');

              case 2:
                params = _querystring2.default.stringify({
                  username: username,
                  password: password
                });
                _context.next = 5;
                return this.api({
                  method: 'POST',
                  url: '/login/username?token=' + this.webToken,
                  data: params
                });

              case 5:
                res = _context.sent;


                // store this info for use in other methods
                this.userId = res.data.userId;
                this.sessionId = res.data.sessionId;
                this.params = this.params + '&sessionId=' + res.data.sessionId;

                return _context.abrupt('return', res.data);

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function login(_x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return login;
    }()

    /**
    * search for artists, albums, tracks, or playlists
    * @param {string} query - search query
    * @param {string} type - search type ('artists', 'albums', 'tracks', 'playlists')
    * @param {number} [limit] - search limit
    * @example
    * tidal.search('Four Year Strong', 'artists', 1)
    * // returns a promise that resolves to:
    [
          {
              "id": 3575680,
              "name": "Four Year Strong",
              "url": "http://www.tidal.com/artist/3575680",
              "picture": "04d63cd8-a1a5-42e0-b1ec-8e336b7d9200",
              "popularity": 28
          }
      ]
    * @returns {Promise}
    * @fulfil {Array} - an array of objects (object properties are dependent on search type)
    * @reject {Error}
    */

  }, {
    key: 'search',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(query, type) {
        var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 25;
        var accTypes, res;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                accTypes = ['artists', 'albums', 'tracks', 'playlists'];

                if (type) {
                  _context2.next = 3;
                  break;
                }

                throw new Error('Search requires type as a second argument (artists, albums, tracks, or playlists)');

              case 3:
                if (!(accTypes.indexOf(type) < 0)) {
                  _context2.next = 5;
                  break;
                }

                throw new Error(type + ' is not a valid search type(\'artists\', \'albums\', \'tracks\', \'playlists\' are valid).');

              case 5:
                _context2.next = 7;
                return this.api({
                  method: 'GET',
                  url: '/search/' + type + '?query=' + query + '&limit=' + limit + '&countryCode=' + this.countryCode
                });

              case 7:
                res = _context2.sent;
                return _context2.abrupt('return', res.data.items);

              case 9:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function search(_x4, _x5) {
        return _ref2.apply(this, arguments);
      }

      return search;
    }()

    /**
    * get a track by its id
    * @param {number} id - track id
    * @example
    * tidal.getTrack(64975224)
    * // returns a promise that resolves to:
    {
      "id": 64975224,
      "title": "22 (OVER S∞∞N)",
      "duration": 168,
      "replayGain": -10.71,
      "peak": 0.692531,
      "allowStreaming": true,
      "streamReady": true,
      "streamStartDate": "2016-09-30T00:00:00.000+0000",
      "premiumStreamingOnly": false,
      "trackNumber": 1,
      "volumeNumber": 1,
      "version": null,
      "popularity": 47,
      "copyright": "2016 Jagjaguwar",
      "url": "http://www.tidal.com/track/64975224",
      "isrc": "US38Y1630001",
      "editable": true,
      "explicit": false,
      "audioQuality": "LOSSLESS",
      "artist": {
          "id": 3566315,
          "name": "Bon Iver",
          "type": "MAIN"
      },
      "artists": [
          {
              "id": 3566315,
              "name": "Bon Iver",
              "type": "MAIN"
          }
      ],
      "album": {
          "id": 64975223,
          "title": "22, A Million",
          "cover": "5ac41fbb-927b-427e-8224-87bf12d218a3"
      }
    }
    * @returns {Promise}
    * @fulfil {Object} - a track object (see example for object properties)
    * @reject {Error}
    */

  }, {
    key: 'getTrack',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(id) {
        var res;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.api({
                  method: 'GET',
                  url: '/tracks/' + id + '?' + this.params
                });

              case 2:
                res = _context3.sent;
                return _context3.abrupt('return', res.data);

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getTrack(_x7) {
        return _ref3.apply(this, arguments);
      }

      return getTrack;
    }()

    /**
    * get your favorite (starred) tracks (requires login() to be called)
    * @example tidal.getFavoriteTracks()
    * @returns {Promise}
    * @fulfil {Array} - an array of track objects
    * @reject {Error}
    * @see {@link Tidal#login} - login method must be called first
    * @see {@link Tidal#getTrack} - track object example
    */

  }, {
    key: 'getFavoriteTracks',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
        var res, items, tracks;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(!this.userId || !this.sessionId)) {
                  _context4.next = 2;
                  break;
                }

                throw new Error('You must call the login method first');

              case 2:
                _context4.next = 4;
                return this.api({
                  method: 'GET',
                  url: '/users/' + this.userId + '/favorites/tracks?' + this.params
                });

              case 4:
                res = _context4.sent;
                items = res.data.items;
                tracks = items.map(function (item) {
                  return item.item;
                });
                return _context4.abrupt('return', tracks);

              case 8:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getFavoriteTracks() {
        return _ref4.apply(this, arguments);
      }

      return getFavoriteTracks;
    }()

    /**
    * get an album by its id
    * @param {number} id - album id
    * @example tidal.getAlbum(80216363)
    * // returns a promise that resolves to:
    {
      "id": 80216363,
      "title": "Pacific Daydream",
      "duration": 2069,
      "streamReady": true,
      "streamStartDate": "2017-10-27T00:00:00.000+0000",
      "allowStreaming": true,
      "premiumStreamingOnly": false,
      "numberOfTracks": 10,
      "numberOfVideos": 0,
      "numberOfVolumes": 1,
      "releaseDate": "2017-10-27",
      "copyright": "2017 Weezer under exclusive license to Crush Music / \
      Atlantic Recording Corporation for the United States and Crush Music / \
      WEA International Inc. for the world excluding the United States. \
      A Warner Music Company.",
      "type": "ALBUM",
      "version": null,
      "url": "http://www.tidal.com/album/80216363",
      "cover": "86538ca7-08fd-40ff-9a75-af88d74d1f48",
      "videoCover": null,
      "explicit": false,
      "upc": "075679889355",
      "popularity": 58,
      "audioQuality": "LOSSLESS",
      "artist": {
          "id": 30157,
          "name": "Weezer",
          "type": "MAIN"
      },
      "artists": [
          {
              "id": 30157,
              "name": "Weezer",
              "type": "MAIN"
          }
      ]
    }
    * @returns {Promise}
    * @fulfil {Object} - an album object (see example for object properties)
    * @reject {Error}
    */

  }, {
    key: 'getAlbum',
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(id) {
        var res;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.api({
                  method: 'GET',
                  url: '/albums/' + id + '?' + this.params
                });

              case 2:
                res = _context5.sent;
                return _context5.abrupt('return', res.data);

              case 4:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getAlbum(_x8) {
        return _ref5.apply(this, arguments);
      }

      return getAlbum;
    }()

    /**
    * get album tracks by album id
    * @param {number} id - album id
    * @example tidal.getAlbumTracks(80216363)
    * @returns {Promise}
    * @fulfil {Array} - an array of track objects
    * @reject {Error}
    * @see {@link Tidal#getTrack} - track object example
    */

  }, {
    key: 'getAlbumTracks',
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(id) {
        var res;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.api({
                  method: 'GET',
                  url: '/albums/' + id + '/tracks?' + this.params
                });

              case 2:
                res = _context6.sent;
                return _context6.abrupt('return', res.data.items);

              case 4:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function getAlbumTracks(_x9) {
        return _ref6.apply(this, arguments);
      }

      return getAlbumTracks;
    }()

    // this is an internal method and so won't be included in JSDOC

  }, {
    key: 'getFeaturedAlbums',
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
        var res, tabs, topAlbums, newAlbums, staffPicks;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.api({
                  method: 'GET',
                  url: '/pages/show_more_featured_albums?' + this.localeParams
                });

              case 2:
                res = _context7.sent;
                tabs = res.data.rows[0].modules[0].tabs;
                topAlbums = tabs.find(function (tab) {
                  return tab.key === 'featured-top';
                });
                newAlbums = tabs.find(function (tab) {
                  return tab.key === 'featured-new';
                });
                staffPicks = tabs.find(function (tab) {
                  return tab.key === 'featured-recommended';
                });
                return _context7.abrupt('return', {
                  topAlbums: topAlbums.pagedList.items,
                  newAlbums: newAlbums.pagedList.items,
                  staffPicks: staffPicks.pagedList.items
                });

              case 8:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function getFeaturedAlbums() {
        return _ref7.apply(this, arguments);
      }

      return getFeaturedAlbums;
    }()

    /**
    * get top 20 albums on Tidal
    * @example tidal.getTopAlbums()
    * @returns {Promise}
    * @fulfil {Array} - an array of album objects
    * @reject {Error}
    * @see {@link Tidal#getAlbum} - album object example
    */

  }, {
    key: 'getTopAlbums',
    value: function () {
      var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
        var featuredAlbums;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.getFeaturedAlbums();

              case 2:
                featuredAlbums = _context8.sent;
                return _context8.abrupt('return', featuredAlbums.topAlbums);

              case 4:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function getTopAlbums() {
        return _ref8.apply(this, arguments);
      }

      return getTopAlbums;
    }()

    /**
    * get new albums on Tidal
    * @example tidal.getNewAlbums()
    * @returns {Promise}
    * @fulfil {Array} - an array of album objects
    * @reject {Error}
    * @see {@link Tidal#getAlbum} - album object example
    */

  }, {
    key: 'getNewAlbums',
    value: function () {
      var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
        var featuredAlbums;
        return _regenerator2.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return this.getFeaturedAlbums();

              case 2:
                featuredAlbums = _context9.sent;
                return _context9.abrupt('return', featuredAlbums.newAlbums);

              case 4:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function getNewAlbums() {
        return _ref9.apply(this, arguments);
      }

      return getNewAlbums;
    }()

    /**
    * get staff pick albums on Tidal
    * @example tidal.getStaffPickAlbums()
    * @returns {Promise}
    * @fulfil {Array} - an array of album objects
    * @reject {Error}
    * @see {@link Tidal#getAlbum} - album object example
    */

  }, {
    key: 'getStaffPickAlbums',
    value: function () {
      var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
        var featuredAlbums;
        return _regenerator2.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return this.getFeaturedAlbums();

              case 2:
                featuredAlbums = _context10.sent;
                return _context10.abrupt('return', featuredAlbums.staffPicks);

              case 4:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function getStaffPickAlbums() {
        return _ref10.apply(this, arguments);
      }

      return getStaffPickAlbums;
    }()

    /**
    * get your favorite (starred) albums (requires login() to be called)
    * @example tidal.getFavoriteAlbums()
    * @returns {Promise}
    * @fulfil {Array} - an array of album objects
    * @reject {Error}
    * @see {@link Tidal#login} - login method must be called first
    * @see {@link Tidal#getAlbum} - album object example
    */

  }, {
    key: 'getFavoriteAlbums',
    value: function () {
      var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
        var res, items, albums;
        return _regenerator2.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                if (!(!this.userId || !this.sessionId)) {
                  _context11.next = 2;
                  break;
                }

                throw new Error('You must call the login method first');

              case 2:
                _context11.next = 4;
                return this.api({
                  method: 'GET',
                  url: '/users/' + this.userId + '/favorites/albums?' + this.params
                });

              case 4:
                res = _context11.sent;
                items = res.data.items;
                albums = items.map(function (item) {
                  return item.item;
                });
                return _context11.abrupt('return', albums);

              case 8:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function getFavoriteAlbums() {
        return _ref11.apply(this, arguments);
      }

      return getFavoriteAlbums;
    }()

    /**
    * get an artist by its id
    * @param {number} id - artist id
    * @example tidal.getArtist(3575680)
    * // returns a promise that resolves to:
    {
      "id": 3575680,
      "name": "Four Year Strong",
      "url": "http://www.tidal.com/artist/3575680",
      "picture": "04d63cd8-a1a5-42e0-b1ec-8e336b7d9200",
      "popularity": 28
    }
    * @returns {Promise}
    * @fulfil {Object} - an artist object (see example for object properties)
    * @reject {Error}
    */

  }, {
    key: 'getArtist',
    value: function () {
      var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(id) {
        var res;
        return _regenerator2.default.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return this.api({
                  method: 'GET',
                  url: '/artists/' + id + '?' + this.params
                });

              case 2:
                res = _context12.sent;
                return _context12.abrupt('return', res.data);

              case 4:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function getArtist(_x10) {
        return _ref12.apply(this, arguments);
      }

      return getArtist;
    }()

    /**
    * get artist albums by artist id
    * @param {number} id - artist id
    * @example tidal.getArtistAlbums(3575680)
    * @returns {Promise}
    * @fulfil {Array} - an array of album objects
    * @reject {Error}
    * @see {@link Tidal#getAlbum} - album object example
    */

  }, {
    key: 'getArtistAlbums',
    value: function () {
      var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(id) {
        var res;
        return _regenerator2.default.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.next = 2;
                return this.api({
                  method: 'GET',
                  url: '/artists/' + id + '/albums?' + this.params
                });

              case 2:
                res = _context13.sent;
                return _context13.abrupt('return', res.data.items);

              case 4:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function getArtistAlbums(_x11) {
        return _ref13.apply(this, arguments);
      }

      return getArtistAlbums;
    }()

    /**
    * get artist EPs and singles by artist id
    * @param {number} id - artist id
    * @example tidal.getArtistEPsAndSingles(3575680)
    * @returns {Promise}
    * @fulfil {Array} - an array of album objects
    * @reject {Error}
    * @see {@link Tidal#getAlbum} - album object example
    */

  }, {
    key: 'getArtistEPsAndSingles',
    value: function () {
      var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(id) {
        var res;
        return _regenerator2.default.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.next = 2;
                return this.api({
                  method: 'GET',
                  url: '/artists/' + id + '/albums?' + this.params
                });

              case 2:
                res = _context14.sent;
                return _context14.abrupt('return', res.data.items);

              case 4:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function getArtistEPsAndSingles(_x12) {
        return _ref14.apply(this, arguments);
      }

      return getArtistEPsAndSingles;
    }()

    /**
    * get compliations that artist has appeared on by artist id
    * @param {number} id - artist id
    * @example tidal.getArtistCompilations(3575680)
    * @returns {Promise}
    * @fulfil {Array} - an array of album objects
    * @reject {Error}
    * @see {@link Tidal#getAlbum} - album object example
    */

  }, {
    key: 'getArtistCompilations',
    value: function () {
      var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15(id) {
        var res;
        return _regenerator2.default.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.next = 2;
                return this.api({
                  method: 'GET',
                  url: '/artists/' + id + '/albums?' + this.params + '&filter=COMPILATIONS'
                });

              case 2:
                res = _context15.sent;
                return _context15.abrupt('return', res.data.items);

              case 4:
              case 'end':
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function getArtistCompilations(_x13) {
        return _ref15.apply(this, arguments);
      }

      return getArtistCompilations;
    }()

    /**
    * get top tracks by artist
    * @param {number} id - artist id
    * @param {number} [limit] - results limit
    * @example tidal.getArtistTopTracks(3575680)
    * @returns {Promise}
    * @fulfil {Array} - an array of track objects
    * @reject {Error}
    * @see {@link Tidal#getTrack} - track object example
    */

  }, {
    key: 'getArtistTopTracks',
    value: function () {
      var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(id) {
        var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
        var res;
        return _regenerator2.default.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _context16.next = 2;
                return this.api({
                  method: 'GET',
                  url: '/artists/' + id + '/toptracks?limit=' + limit + '&countryCode=' + this.countryCode
                });

              case 2:
                res = _context16.sent;
                return _context16.abrupt('return', res.data.items);

              case 4:
              case 'end':
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function getArtistTopTracks(_x14) {
        return _ref16.apply(this, arguments);
      }

      return getArtistTopTracks;
    }()

    /**
    * get similar artists
    * @param {number} id - artist id
    * @example tidal.getSimilarArtists(3575680)
    * @returns {Promise}
    * @fulfil {Object} - artist object
    * @reject {Error}
    * @see {@link Tidal#getArtist} - artist object example
    */

  }, {
    key: 'getSimilarArtists',
    value: function () {
      var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17(id) {
        var res;
        return _regenerator2.default.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _context17.next = 2;
                return this.api({
                  method: 'GET',
                  url: '/artists/' + id + '/similar?' + this.params
                });

              case 2:
                res = _context17.sent;
                return _context17.abrupt('return', res.data.items);

              case 4:
              case 'end':
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function getSimilarArtists(_x16) {
        return _ref17.apply(this, arguments);
      }

      return getSimilarArtists;
    }()

    /**
    * get your favorite (starred) artists (requires login() to be called)
    * @example tidal.getFavoriteArtists()
    * @returns {Promise}
    * @fulfil {Array} - an array of artist objects
    * @reject {Error}
    * @see {@link Tidal#login} - login method must be called first
    * @see {@link Tidal#getArtist} - artist object example
    */

  }, {
    key: 'getFavoriteArtists',
    value: function () {
      var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18() {
        var res, items, artists;
        return _regenerator2.default.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                if (!(!this.userId || !this.sessionId)) {
                  _context18.next = 2;
                  break;
                }

                throw new Error('You must call the login method first');

              case 2:
                _context18.next = 4;
                return this.api({
                  method: 'GET',
                  url: '/users/' + this.userId + '/favorites/artists?' + this.params
                });

              case 4:
                res = _context18.sent;
                items = res.data.items;
                artists = items.map(function (item) {
                  return item.item;
                });
                return _context18.abrupt('return', artists);

              case 8:
              case 'end':
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function getFavoriteArtists() {
        return _ref18.apply(this, arguments);
      }

      return getFavoriteArtists;
    }()

    /**
    * get a playlist by its uuid
    * @param {string} uuid - playlist uuid
    * @example tidal.getPlaylist('1c5d01ed-4f05-40c4-bd28-0f73099e9648')
    * // returns a promise that resolves to:
    {
      "uuid": "1c5d01ed-4f05-40c4-bd28-0f73099e9648",
      "title": "Get Down On It: Soul, Funk and Disco Supremo",
      "numberOfTracks": 100,
      "numberOfVideos": 0,
      "creator": {
          "id": 0
      },
      "description": "Get down and dirty with some of the finest soul, funk \
      and four-to-the floor disco out there. Bound to get the blood pumping, \
      this playlist boasts more hits than a boxing match, more hooks than a \
      tackle box and marks the perfect prescription both for champagne days \
      and boogie nights and alike. Whether you feel like being a sex machine \
      or simply wish to dance to the music, rock your body, dig it and don't \
      stop 'til you get enough! ",
      "duration": 25732,
      "lastUpdated": "2017-01-18T16:31:51.839+0000",
      "created": "2016-09-22T16:42:40.911+0000",
      "type": "EDITORIAL",
      "publicPlaylist": true,
      "url": "http://www.tidal.com/playlist/1c5d01ed-4f05-40c4-bd28-0f73099e9648",
      "image": "7a707631-02cf-47d8-a34c-e1395165f169",
      "popularity": 0
    }
    * @returns {Promise}
    * @fulfil {Object} - playlist object (see example for object properties)
    * @reject {Error}
    */

  }, {
    key: 'getPlaylist',
    value: function () {
      var _ref19 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19(uuid) {
        var res;
        return _regenerator2.default.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                _context19.next = 2;
                return this.api({
                  method: 'GET',
                  url: '/playlists/' + uuid + '?' + this.params
                });

              case 2:
                res = _context19.sent;
                return _context19.abrupt('return', res.data);

              case 4:
              case 'end':
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      function getPlaylist(_x17) {
        return _ref19.apply(this, arguments);
      }

      return getPlaylist;
    }()

    /**
    * get playlist tracks by playlist uuid
    * @param {string} uuid - playlist uuid
    * @example tidal.getPlaylistTracks('1c5d01ed-4f05-40c4-bd28-0f73099e9648')
    * @returns {Promise}
    * @fulfil {Array} - an array of track objects
    * @reject {Error}
    * @see {@link Tidal#getTrack} - track object example
    */

  }, {
    key: 'getPlaylistTracks',
    value: function () {
      var _ref20 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20(uuid) {
        var res;
        return _regenerator2.default.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                _context20.next = 2;
                return this.api({
                  method: 'GET',
                  url: '/playlists/' + uuid + '/tracks?' + this.params
                });

              case 2:
                res = _context20.sent;
                return _context20.abrupt('return', res.data.items);

              case 4:
              case 'end':
                return _context20.stop();
            }
          }
        }, _callee20, this);
      }));

      function getPlaylistTracks(_x18) {
        return _ref20.apply(this, arguments);
      }

      return getPlaylistTracks;
    }()

    /**
    * get your favorite (starred) playlists (requires login() to be called)
    * @example tidal.getFavoritePlaylists()
    * @returns {Promise}
    * @fulfil {Array} - an array of playlist objects
    * @reject {Error}
    * @see {@link Tidal#login} - login method must be called first
    * @see {@link Tidal#getPlaylist} - playlist object example
    */

  }, {
    key: 'getFavoritePlaylists',
    value: function () {
      var _ref21 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21() {
        var res, items, playlists;
        return _regenerator2.default.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                if (!(!this.userId || !this.sessionId)) {
                  _context21.next = 2;
                  break;
                }

                throw new Error('You must call the login method first');

              case 2:
                _context21.next = 4;
                return this.api({
                  method: 'GET',
                  url: '/users/' + this.userId + '/favorites/playlists?' + this.params
                });

              case 4:
                res = _context21.sent;
                items = res.data.items;
                playlists = items.map(function (item) {
                  return item.item;
                });
                return _context21.abrupt('return', playlists);

              case 8:
              case 'end':
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      function getFavoritePlaylists() {
        return _ref21.apply(this, arguments);
      }

      return getFavoritePlaylists;
    }()

    /**
    * get your created playlists (requires login() to be called)
    * @example tidal.getPlaylists()
    * @returns {Promise}
    * @fulfil {Array} - an array of playlist objects
    * @reject {Error}
    * @see {@link Tidal#login} - login method must be called first
    * @see {@link Tidal#getPlaylist} - playlist object example
    */

  }, {
    key: 'getPlaylists',
    value: function () {
      var _ref22 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee22() {
        var res;
        return _regenerator2.default.wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                if (!(!this.userId || !this.sessionId)) {
                  _context22.next = 2;
                  break;
                }

                throw new Error('You must call the login method first');

              case 2:
                _context22.next = 4;
                return this.api({
                  method: 'GET',
                  url: '/users/' + this.userId + '/playlists?' + this.params
                });

              case 4:
                res = _context22.sent;
                return _context22.abrupt('return', res.data.items);

              case 6:
              case 'end':
                return _context22.stop();
            }
          }
        }, _callee22, this);
      }));

      function getPlaylists() {
        return _ref22.apply(this, arguments);
      }

      return getPlaylists;
    }()

    /**
    * get valid urls to artist pictures
    * @param {string} uuid - artist picture uuid (can be found as picture property in artist object)
    * @example tidal.artistPicToUrl('04d63cd8-a1a5-42e0-b1ec-8e336b7d9200')
    * // returns
    {
      sm: 'https://resources.tidal.com/images/04d63cd8/a1a5/42e0/b1ec/8e336b7d9200/160x107.jpg',
      md: 'https://resources.tidal.com/images/04d63cd8/a1a5/42e0/b1ec/8e336b7d9200/320x214.jpg',
      lg: 'https://resources.tidal.com/images/04d63cd8/a1a5/42e0/b1ec/8e336b7d9200/640x428.jpg'
    }
    * @returns {Object}
    */

  }, {
    key: 'artistPicToUrl',
    value: function artistPicToUrl(uuid) {
      var baseUrl = 'https://resources.tidal.com/images/' + uuid.replace(/-/g, '/');
      return {
        sm: baseUrl + '/160x107.jpg',
        md: baseUrl + '/320x214.jpg',
        lg: baseUrl + '/640x428.jpg'
      };
    }

    /**
    * get valid urls to album art
    * @param {string} uuid - album art uuid (can be found as cover property in album object)
    * @example tidal.albumArtToUrl('9a56f482-e9cf-46c3-bb21-82710e7854d4')
    * // returns
    {
      sm: 'https://resources.tidal.com/images/9a56f482-e9cf-46c3-bb21-82710e7854d4/160x160.jpg',
      md: 'https://resources.tidal.com/images/9a56f482-e9cf-46c3-bb21-82710e7854d4/320x320.jpg',
      lg: 'https://resources.tidal.com/images/9a56f482-e9cf-46c3-bb21-82710e7854d4/640x640.jpg',
      xl: 'https://resources.tidal.com/images/9a56f482-e9cf-46c3-bb21-82710e7854d4/1280x1280.jpg'
    }
    * @returns {Object}
    */

  }, {
    key: 'albumArtToUrl',
    value: function albumArtToUrl(uuid) {
      var baseUrl = 'https://resources.tidal.com/images/' + uuid.replace(/-/g, '/');
      return {
        sm: baseUrl + '/160x160.jpg',
        md: baseUrl + '/320x320.jpg',
        lg: baseUrl + '/640x640.jpg',
        xl: baseUrl + '/1280x1280.jpg'
      };
    }
  }]);
  return Tidal;
}();

exports.default = Tidal;
module.exports = exports['default'];
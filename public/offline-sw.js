"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var urls = ["/", "/fonts/Roboto.ttf", "/images/connection.png", "/images/davidsdevel-black.png", "/images/davidsdevel-rombo.png", "/images/landing-desktop-960p.jpg", "/images/landing-desktop.jpg", "/images/landing-mobile-480p.jpg", "/images/landing-mobile.jpg", "/images/landing.jpg", "/images/me.jpg", "/images/og.jpg", "/images/payoneer.png", "/images/platzi.png", "/images/privacidad.jpg", "/assets/arrow-white.svg", "/assets/arrow.svg", "/assets/bubbles.svg", "/assets/cross.svg", "/assets/eye.svg", "/assets/facebook.svg", "/assets/instagram.svg", "/assets/linkedin.svg", "/assets/menu.svg", "/assets/search.svg", "/assets/spinner.svg", "/assets/twitter.svg"];
self.addEventListener("install", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
    var waitUntil, _cache, toWait;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            waitUntil = _ref.waitUntil;

            try {
              _cache = caches.open("offline-app");
              toWait = _cache.addAll(urls);
              waitUntil(toWait);
            } catch (err) {
              console.error(err);
            }

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}());
self.addEventListener('fetch', /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref3) {
    var request, respondWith, response;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            request = _ref3.request, respondWith = _ref3.respondWith;
            _context2.prev = 1;

            if (!self.navigator.onLine) {
              _context2.next = 4;
              break;
            }

            return _context2.abrupt("return");

          case 4:
            _context2.next = 6;
            return caches.match(request);

          case 6:
            response = _context2.sent;
            respondWith(response || fetch(request));
            _context2.next = 13;
            break;

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](1);
            console.error(_context2.t0);

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 10]]);
  }));

  return function (_x2) {
    return _ref4.apply(this, arguments);
  };
}());
self.addEventListener("activate", /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref5) {
    var waitUntil, keyList, promises;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            waitUntil = _ref5.waitUntil;
            _context3.next = 3;
            return caches.keys();

          case 3:
            keyList = _context3.sent;
            promises = keyList.map(function (key) {
              return key !== "offline-app" ? cache["delete"](key) : null;
            });
            waitUntil(Promise.all(promises));

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x3) {
    return _ref6.apply(this, arguments);
  };
}());
/*
// CODELAB: Add fetch event handler here.
if (evt.request.mode !== 'navigate') {
  // Not a page navigation, bail.
  return;
}
evt.respondWith(
    fetch(evt.request)
        .catch(() => {
          return caches.open(CACHE_NAME)
              .then((cache) => {
                return cache.match('offline.html');
              });
        })
);
*/

/*
// CODELAB: Add fetch event handler here.
if (evt.request.url.includes('/forecast/')) {
  console.log('[Service Worker] Fetch (data)', evt.request.url);
  evt.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return fetch(evt.request)
            .then((response) => {
              // If the response was good, clone it and store it in the cache.
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }
              return response;
            }).catch((err) => {
              // Network request failed, try to get it from the cache.
              return cache.match(evt.request);
            });
      }));
  return;
}
evt.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(evt.request)
          .then((response) => {
            return response || fetch(evt.request);
          });
    })
);
*/
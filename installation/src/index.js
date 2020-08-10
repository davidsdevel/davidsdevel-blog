"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var step = 1;
var ids = [];
var databaseData = {
  server: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  client: 'mysql',
  database: 'blog'
};
var userData = {};
/**
 * Change Tab
 *
 * @return {void}
 */

function changeTab() {
  for (var i = 1; i <= 3; i += 1) {
    if (i < step) {
      ids[i - 1].style.left = '-100%';
    } else if (i === step) {
      ids[i - 1].style.left = '0';
    } else {
      ids[i - 1].style.left = '100%';
    }
  }
}
/**
 * Next
 *
 * @description Change to next tab
 *
 * @return {void}
 */
// eslint-disable-next-line


function next() {
  step += 1;
  changeTab();
}
/**
 * Prev
 *
 * @description Change to prev tab
 *
 * @return {void}
 */
// eslint-disable-next-line


function prev() {
  step -= 1;
  changeTab();
} // eslint-disable-next-line


function handleInputDatabase(_ref) {
  var target = _ref.target;
  var name = target.name,
      value = target.value;
  databaseData[name] = value;
} // eslint-disable-next-line


function handleInputUser(_ref2) {
  var target = _ref2.target;
  var name = target.name,
      value = target.value;
  userData[name] = value;
} // eslint-disable-next-line


function testDB() {
  return _testDB.apply(this, arguments);
} // eslint-disable-next-line


function _testDB() {
  _testDB = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var mapped, res, data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            mapped = Object.entries(databaseData).map(function (e) {
              return "".concat(e[0], "=").concat(e[1]);
            });
            _context.next = 4;
            return fetch("/test-connection?".concat(mapped.join('&')));

          case 4:
            res = _context.sent;
            _context.next = 7;
            return res.text();

          case 7:
            data = _context.sent;

            if (data === 'success') {
              alert('Conexión Exitosa');
              document.getElementById('step-2-next').disabled = false;
            } else {
              alert('Error al establecer la conexión');
            }

            _context.next = 15;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);
            console.error(_context.t0);
            alert('Error al establecer la conexión');

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 11]]);
  }));
  return _testDB.apply(this, arguments);
}

function install() {
  return _install.apply(this, arguments);
}

function _install() {
  _install = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            try {
              console.log(userData, databaseData); // const res = await fetch("/init-app")
            } catch (err) {
              console.error(err);
            }

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _install.apply(this, arguments);
}

document.addEventListener('DOMContentLoaded', function () {
  ids = [document.getElementById('step-1'), document.getElementById('step-2'), document.getElementById('step-3')];
  var hash = window.location.hash;

  if (hash) {
    var stepHash = hash.replace('#step', '');
    step = stepHash * 1;
    changeTab();
  }
}, false);
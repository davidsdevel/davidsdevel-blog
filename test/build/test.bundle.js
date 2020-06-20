/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var step = 1;
var ids = [];
var databaseConnected = false;
var databaseData = {
  server: "localhost",
  port: 3306,
  user: "root",
  password: "",
  client: "mysql",
  database: "blog"
};
var userData = {};
document.addEventListener("DOMContentLoaded", function () {
  ids = [document.getElementById("step-1"), document.getElementById("step-2"), document.getElementById("step-3"), document.getElementById("step-4")];

  if (location.hash) {
    var stepHash = location.hash.replace("#step", "");
    step = stepHash * 1;
    changeTab();
  }
}, false);

function next() {
  step++;
  changeTab();
}

function prev() {
  step--;
  changeTab();
}

function changeTab() {
  var _iterator = _createForOfIteratorHelper(4),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var i = _step.value;

      if (i < step) {
        ids[i - 1].style.left = "-100%";
      } else if (i === step) {
        ids[i - 1].style.left = "0";
      } else {
        ids[i - 1].style.left = "100%";
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

function handleInputDatabase(event) {
  var name = event.target.name;
  var value = event.target.value;

  if (name === "client") {
    var stepTwoTag = document.getElementById("step-2");
    var html;

    if (value === "sqlite3") {
      html = '<span>Base de Datos</span><div><label for="username">Cliente</label><div><select onchange="handleInputDatabase(event)" name="client" id="client" default="' + value + '"><option value="pg">PostsgreSQL</option><option value="mysql">MySQL</option><option value="sqlite3">SQLite</option></select></div></div><div><label for="filenameDatabase">Nombre de Archivo</label><div><input onchange="handleInputDatabase(event)" type="text" name="filenameDatabase" id="filenameDatabase" value="test.db" placeholder="UsuarioBaseDeDatos"></div></div><button class="black" onclick="testDB()">Probar Base de Datos</button><div><button class="gray" onclick="prev()">Anterior</button><button class="black" id="step-2-next" disabled onclick="next()">Siguiente</button></div>';
    } else {
      html = '<span>Base de Datos</span><div><label for="username">Cliente</label><div><select onchange="handleInputDatabase(event)" name="client" id="client" value="' + value + '"><option value="pg">PostsgreSQL</option><option value="mysql">MySQL</option><option value="sqlite3">SQLite</option></select></div></div><div><label for="user">Nombre de Usuario</label><div><input onchange="handleInputDatabase(event)" type="text" name="user" id="user" value="root" placeholder="UsuarioBaseDeDatos"></div></div><div><label for="password">Contraseña</label><div><input onchange="handleInputDatabase(event)" type="text" name="password" id="password" value="" placeholder="SuperSecreto"></div></div><div><label for="server">Servidor</label><div><input onchange="handleInputDatabase(event)" type="text" name="server" id="server" value="localhost" placeholder="dominio.algo.com"></div></div><div><label for="port">Puerto</label><div><input onchange="handleInputDatabase(event)" type="text" name="port" id="port" value="3306" placeholder="8080"></div></div><button class="black" onclick="testDB()">Probar Base de Datos</button><div><button class="gray" onclick="prev()">Anterior</button><button class="black" id="step-2-next" disabled onclick="next()">Siguiente</button></div>';
    }

    stepTwoTag.innerHTML = html;
    document.getElementById("client").value = value;
  }

  databaseData[name] = value;
}

function handleInputUser(event) {
  var name = event.target.name;
  var value = event.target.value;
  userData[name] = value;
}

function testDB() {
  return _testDB.apply(this, arguments);
}

function _testDB() {
  _testDB = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var mapped, res, data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            mapped = Object.entries(databaseData).map(function (e) {
              return e[0] + "=" + e[1];
            });
            _context.next = 4;
            return fetch("/test-connection?" + mapped.join("&"));

          case 4:
            res = _context.sent;
            _context.next = 7;
            return res.test();

          case 7:
            data = _context.sent;

            if (data === "success") {
              alert("Conexión Exitosa");
              document.getElementById("step-2-next").disabled = false;
            } else {
              alert("Error al establecer la conexión");
            }

            _context.next = 15;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);
            console.error(_context.t0);
            alert("Error al establecer la conexión");

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 11]]);
  }));
  return _testDB.apply(this, arguments);
}

/***/ })
/******/ ]);
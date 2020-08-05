const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

const _regenerator = _interopRequireDefault(require('@babel/runtime/regenerator'));

const _asyncToGenerator2 = _interopRequireDefault(require('@babel/runtime/helpers/asyncToGenerator'));

function _createForOfIteratorHelper(o, allowArrayLike) {
  let it; if (typeof Symbol === 'undefined' || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') {
      if (it) o = it; let i = 0; const F = function F() {}; return {
        s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F,
      };
    } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.');
  } let normalCompletion = true; let didErr = false; let
    err; return {
    s: function s() { it = o[Symbol.iterator](); }, n: function n() { const step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } },
  };
}

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === 'string') return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor) n = o.constructor.name; if (n === 'Map' || n === 'Set') return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

let step = 1;
let ids = [];
const databaseConnected = false;
const databaseData = {
  server: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  client: 'mysql',
  database: 'blog',
};
const userData = {};
document.addEventListener('DOMContentLoaded', () => {
  ids = [document.getElementById('step-1'), document.getElementById('step-2'), document.getElementById('step-3'), document.getElementById('step-4')];

  if (location.hash) {
    const stepHash = location.hash.replace('#step', '');
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
  const _iterator = _createForOfIteratorHelper(4);
  let _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      const i = _step.value;

      if (i < step) {
        ids[i - 1].style.left = '-100%';
      } else if (i === step) {
        ids[i - 1].style.left = '0';
      } else {
        ids[i - 1].style.left = '100%';
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

function handleInputDatabase(event) {
  const { name } = event.target;
  const { value } = event.target;

  if (name === 'client') {
    const stepTwoTag = document.getElementById('step-2');
    let html;

    if (value === 'sqlite3') {
      html = `<span>Base de Datos</span><div><label for="username">Cliente</label><div><select onchange="handleInputDatabase(event)" name="client" id="client" default="${value}"><option value="pg">PostsgreSQL</option><option value="mysql">MySQL</option><option value="sqlite3">SQLite</option></select></div></div><div><label for="filenameDatabase">Nombre de Archivo</label><div><input onchange="handleInputDatabase(event)" type="text" name="filenameDatabase" id="filenameDatabase" value="test.db" placeholder="UsuarioBaseDeDatos"></div></div><button class="black" onclick="testDB()">Probar Base de Datos</button><div><button class="gray" onclick="prev()">Anterior</button><button class="black" id="step-2-next" disabled onclick="next()">Siguiente</button></div>`;
    } else {
      html = `<span>Base de Datos</span><div><label for="username">Cliente</label><div><select onchange="handleInputDatabase(event)" name="client" id="client" value="${value}"><option value="pg">PostsgreSQL</option><option value="mysql">MySQL</option><option value="sqlite3">SQLite</option></select></div></div><div><label for="user">Nombre de Usuario</label><div><input onchange="handleInputDatabase(event)" type="text" name="user" id="user" value="root" placeholder="UsuarioBaseDeDatos"></div></div><div><label for="password">Contraseña</label><div><input onchange="handleInputDatabase(event)" type="text" name="password" id="password" value="" placeholder="SuperSecreto"></div></div><div><label for="server">Servidor</label><div><input onchange="handleInputDatabase(event)" type="text" name="server" id="server" value="localhost" placeholder="dominio.algo.com"></div></div><div><label for="port">Puerto</label><div><input onchange="handleInputDatabase(event)" type="text" name="port" id="port" value="3306" placeholder="8080"></div></div><button class="black" onclick="testDB()">Probar Base de Datos</button><div><button class="gray" onclick="prev()">Anterior</button><button class="black" id="step-2-next" disabled onclick="next()">Siguiente</button></div>`;
    }

    stepTwoTag.innerHTML = html;
    document.getElementById('client').value = value;
  }

  databaseData[name] = value;
}

function handleInputUser(event) {
  const { name } = event.target;
  const { value } = event.target;
  userData[name] = value;
}

function testDB() {
  return _testDB.apply(this, arguments);
}

function _testDB() {
  _testDB = (0, _asyncToGenerator2.default)(/* #__PURE__ */_regenerator.default.mark(function _callee() {
    let mapped; let res; let
      data;
    return _regenerator.default.wrap((_context) => {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            mapped = Object.entries(databaseData).map((e) => `${e[0]}=${e[1]}`);
            _context.next = 4;
            return fetch(`/test-connection?${mapped.join('&')}`);

          case 4:
            res = _context.sent;
            _context.next = 7;
            return res.test();

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
            _context.t0 = _context.catch(0);
            console.error(_context.t0);
            alert('Error al establecer la conexión');

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 11]]);
  }));
  return _testDB.apply(this, arguments);
}

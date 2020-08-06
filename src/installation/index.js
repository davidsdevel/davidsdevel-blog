let step = 1;
let ids = [];

const databaseData = {
  server: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  client: 'mysql',
  database: 'blog',
};

const userData = {};

/**
 * Change Tab
 *
 * @return {void}
 */
function changeTab() {
  for (let i = 1; i <= 3; i += 1) {
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
}

// eslint-disable-next-line
function handleInputDatabase({target}) {
  const { name, value } = target;

  databaseData[name] = value;
}

// eslint-disable-next-line
function handleInputUser({target}) {
  const { name, value } = target;

  userData[name] = value;
}

// eslint-disable-next-line
async function testDB() {
  try {
    const mapped = Object.entries(databaseData).map(e => `${e[0]}=${e[1]}`);

    const res = await fetch(`/test-connection?${mapped.join('&')}`);

    const data = await res.text();

    if (data === 'success') {
      alert('Conexión Exitosa');
      document.getElementById('step-2-next').disabled = false;
    } else {
      alert('Error al establecer la conexión');
    }
  } catch (err) {
    console.error(err);
    alert('Error al establecer la conexión');
  }
}

// eslint-disable-next-line
async function install() {
  try {
    console.log(userData, databaseData);
    // const res = await fetch("/init-app")
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ids = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3'),
  ];
  const { hash } = window.location;

  if (hash) {
    const stepHash = hash.replace('#step', '');
    step = stepHash * 1;
    changeTab();
  }
}, false);

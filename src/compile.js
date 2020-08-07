const { resolve } = require('path');
const { writeFile, readFile } = require('fs');
const babel = require('@babel/core');
const Terser = require('terser');
const cssnano = require('cssnano');

const isDev = process.env.NODE_ENV !== 'production';

/**
 *
 * Compile
 *
 * @param {StringPath} entry
 * @param {StringPath} output
 *
 * @return {Promise<void>}
 */
function compile(entry, output) {
  console.log('> Compiling - ', entry.match(/\w*(-\w*)*\.js$/)[0]);

  return new Promise((pRes, rej) => {
    babel.transformFile(entry, {
      // minified: !isDev,
      // compact: !isDev,
      presets: ['@babel/preset-env'],
    }, (err, res) => {
      if (err) {
        return rej(err);
      }

      const result = !isDev ? Terser.minify(res.code, {
        output: {
          beautify: isDev,
          comments: isDev,
        },
        compress: !isDev,
        mangle: !isDev,
      }) : { code: res.code };

      if (result.error) {
        return rej(result.error);
      }

      writeFile(output, result.code, () => {
        console.log('> Compiled');
        pRes();
      });
    });
  });
}

/**
 * Compile CSS
 *
 * @param
 *
 */
function compileCSS(entry, output) {
  console.log('> Compiling - ', entry.match(/\w*(-\w*)*\.css$/)[0]);

  return new Promise((pRes, rej) => {
    readFile(entry, async (err, res) => {
      if (err) {
        return rej(err);
      }

      const css = isDev ? res : await cssnano.process(res);

      writeFile(output, css, () => {
        console.log('> Compiled');
        pRes();
      });
    });
  });
}

async function main() {
  try {
    await compile(
      resolve(__dirname, 'public', 'messaging.js'),
      resolve(__dirname, '..', 'public', 'messaging.js'),
    );
    await compile(
      resolve(__dirname, 'public', 'offline-sw.js'),
      resolve(__dirname, '..', 'public', 'offline-sw.js'),
    );
    await compile(
      resolve(__dirname, 'public', 'firebase-messaging-sw.js'),
      resolve(__dirname, '..', 'public', 'firebase-messaging-sw.js'),
    );
    await compile(
      resolve(__dirname, 'installation', 'index.js'),
      resolve(__dirname, '..', 'installation', 'src', 'index.js'),
    );
    await compileCSS(
      resolve(__dirname, 'installation', 'index.css'),
      resolve(__dirname, '..', 'installation', 'src', 'index.css'),
    );

    console.log('Done');
  } catch (err) {
    console.error(err);
  }
}

main();

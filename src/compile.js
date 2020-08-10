const { resolve } = require('path');
const { writeFile, readFile } = require('fs');
const babel = require('@babel/core');
const Terser = require('terser');
const cssnano = require('cssnano');

const isDev = process.env.NODE_ENV !== 'production';

const files = [
  {
    src: resolve(__dirname, 'public', 'offline-sw.js'),
    dest: resolve(__dirname, '..', 'public', 'offline-sw.js'),
  },
  {
    src: resolve(__dirname, 'public', 'firebase-messaging-sw.js'),
    dest: resolve(__dirname, '..', 'public', 'firebase-messaging-sw.js'),
  },
  {
    src: resolve(__dirname, 'installation', 'index.js'),
    dest: resolve(__dirname, '..', 'installation', 'src', 'index.js'),
  },
  {
    src: resolve(__dirname, 'installation', 'index.css'),
    dest: resolve(__dirname, '..', 'installation', 'src', 'index.css'),
  },
]

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
  return Promise.all(files
    .map(({src, dest}) => !/\.css/.test(src) ?
      compile(src, dest) :
      compileCSS(src, dest)
     ));
}

main()
  .then(() => console.log('Done.'))

var fs = require('fs');
var archiver = require('archiver');
 
// create a file to stream archive data to.

if (!fs.existsSync(__dirname + '/dist'))
    fs.mkdirSync(__dirname + '/dist');

var output = fs.createWriteStream(__dirname + '/dist/example.zip');
var archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});
 
// listen for all archive data to be written
// 'close' event is fired only when a file descriptor is involved
output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});
 
// This event is fired when the data source is drained no matter what was the data source.
// It is not part of this library but rather from the NodeJS Stream API.
// @see: https://nodejs.org/api/stream.html#stream_event_end
output.on('end', function() {
  console.log('Data has been drained');
});
 
// good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    // log warning
  } else {
    // throw error
    throw err;
  }
});
 
// good practice to catch this error explicitly
archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

archive.glob('.next/**/*', '.next');
archive.glob('installation/**/*', 'installation');
archive.glob('public/**/*', 'public');

archive.append(fs.createReadStream(__dirname+'/dist/test.js'), {name:'index.js'});
archive.append(fs.createReadStream(__dirname+'/next.config.js'), {name:'next.config.js'});
archive.append(fs.createReadStream(__dirname+'/package.json'), {name:'package.json'});
archive.append(fs.createReadStream(__dirname+'/yarn.lock'), {name:'yarn.lock'});

archive.finalize();
var thumb = require('node-thumbnail').thumb;

// thumb(options, callback);

thumb({
  source: './files/a.jpg', // could be a filename: dest/path/image.jpg
  destination: './files',
  concurrency: 4,
  width: 200
}, function(files, err, stdout, stderr) {

  console.log(files);
});
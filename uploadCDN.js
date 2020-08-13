var cloudinary = require('cloudinary').v2;
const {readdirSync, statSync} = require('fs');
const {join} = require('path');

// List all files in a directory in Node.js recursively in a synchronous fashion
var walkSync = function(dir, filelist) {
  let files = readdirSync(dir);

  filelist = filelist || [];

  files.forEach(function(file) {
  	let fileName = join(dir, file);
    if (statSync(fileName).isDirectory()) {
      filelist = walkSync(join(fileName, '/'), filelist);
    }
    else {
      filelist.push(fileName);
    }
  });
  return filelist;
};

async function main() {
	const files = walkSync('files');

	const promises = files.map(e => cloudinary.uploader.upload("sample.jpg", 
	  { folder: "my_folder/my_sub_folder/", 
	    public_id: "my_name",
	    use_filename: true, 
	    unique_filename: false
	  })
	);
	
	return Promise.all(promises);
}

main().then(() => console.log("Upload CDN > Sucess uploaded")).catch(err => {
	throw new Error(err)
});
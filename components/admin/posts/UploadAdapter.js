class MyUploadAdapter {
  constructor( loader ) {
    // The file loader instance to use during the upload.
    this.loader = loader;
  }

  // Starts the upload process.
  upload() {
    return this.loader.file
      .then( file => new Promise( ( resolve, reject ) => {
        this._upload(file, resolve, reject);
      } ) );
  }

  // Aborts the upload process.
  abort() {
    if ( this.xhr ) {
      this.fetch.abort();
    }
  }

  async _upload(file, res, rej) {
    const controller = this.fetch = new AbortController();
    const { signal } = controller;

    const {react} = window;

    const formData = new FormData();

    formData.append('file', file);
    formData.append('name', file.name);
    formData.append('mime', file.type);

    try {
      const req = await fetch('/upload/image', {
        signal,
        method: 'POST',
        body: formData,
      });

      const data = await req.json();
      const newData = Object.assign([], react.state.images);

      newData.unshift(data.src);

      react.setState({
        isUploading: false,
        images: newData
      });

      res({
        default: data.src,
        480: `/resize-image?url=${data.src}&height=480`,
        720: `/resize-image?url=${data.src}&height=720`,
        1024: `/resize-image?url=${data.src}&height=1024`,
        1400: `/resize-image?url=${data.src}&height=1400`
      });

    } catch (err) {
      alert('Error al subir ' + file.name);
      rej(err);
    }
  }
}

// ...

function MyCustomUploadAdapterPlugin( editor ) {
  editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
    // Configure the URL to the upload script in your back-end here!
    return new MyUploadAdapter( loader );
  };
}

export default MyCustomUploadAdapterPlugin;

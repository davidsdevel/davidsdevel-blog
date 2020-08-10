import React, { Component } from 'react';

export default class EmailEditor extends Component {
  constructor() {
    super();

    this.editor = null;

    this.componentDidMount = this.componentDidMount.bind(this);
  }
  componentDidMount() {
    this.editor = grapesjs.init({
      container : '#gjs',
      plugins: ['gjs-preset-newsletter'],
      pluginsOpts: {
        'gjs-preset-newsletter': {
          modalTitleImport: 'Import template'
        }
      },
      assetManager: {
        upload: 'https://endpoint/upload/assets',
        uploadName: 'files'
      }
    });

    /*this.unlayer.loadDesign()

    unlayer.exportHtml(function(data) {
      var json = data.design; // design json
      var html = data.html; // design html
    })*/
  }
  render() {
    return <div id='gjs'>
      <style jsx global>{
        `#content {
          padding: 0 !important;
          width: 100% !important;
        }`
      }</style>
    </div>
  }
}

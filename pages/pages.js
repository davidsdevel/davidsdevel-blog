import React, { Component } from 'react';

export default class PageEditor extends Component {
  constructor() {
    this.editor = null;

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    this.editor = grapesjs.init({
      container: '#gjs',
      plugins: ['gjs-preset-webpage'],
      pluginsOpts: {
        'gjs-preset-webpage': {
          // options
        },
      },
      assetManager: {
        upload: 'https://endpoint/upload/assets',
        uploadName: 'files',
      },
    });

    /* this.unlayer.loadDesign()

    unlayer.exportHtml(function(data) {
      var json = data.design; // design json
      var html = data.html; // design html
    }) */
  }

  render() {
    return <div id="gjs" />;
  }
}

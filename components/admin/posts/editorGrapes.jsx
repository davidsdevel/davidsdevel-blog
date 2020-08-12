import React, { Component } from 'react';
import ImagesModal from './imagesModal';
import store from '../../../store';
import { adminHideLoad, adminHideMenu } from '../../../store/actions';
import UploadAdapter from "./UploadAdapter";

export default class Editor extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      description: '',
      tags: '',
      images: [],
      url: '',
      postStatus: 'new',
      category: '',
      categories: [],
      isSaved: false,
      isPublished: false,
      sending: false,
    };

    this.editor = null;
    this.timeout = null;

    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.sendData = this.sendData.bind(this);
  }

  async componentDidMount() {
    window.react = this;

    if (this.props.data) {
      const {
        ID, title, description, images, postStatus, url, category, tags, isPublished,
      } = this.props.data;

      this.setState({
        ID: ID || '',
        title: title || '',
        description: description || '',
        images: !!images ? Object.assign([], images) : [],
        postStatus: postStatus || 'new',
        url: url || '',
        category: 'null',//category === 'null' ? categories[0].name : category,
        tags: tags || '',
        isPublished: isPublished || '',
      });
    }

    try {
      const {content} = this.props.data;

      const editor = await ClassicEditor.create( document.querySelector( '#ck' ), {
        language:'es',
        rootName: 'main',
        initialData: content && typeof content === 'string'  ? content : '<p>Nueva super entrada</p>',
        extraPlugins: [ UploadAdapter ],
      });
      
      this.editor = editor;

      store.dispatch(adminHideLoad());
      store.dispatch(adminHideMenu());

      editor.model.document.on('change', () => {
        if (this.state.postStatus !== 'published') {
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => this.sendData('save'), 5000);
        }
      });
    } catch(err) {
      console.error(err.stack);
    }

  //var data = CKEDITOR.editor.getData();
  /*editor.on( 'change', function( evt ) {
  // getData() returns CKEditor's HTML content.
  console.log( 'Total bytes: ' + evt.editor.getData().length );
});*/
  }
 componentWillUnmount() {
  this.editor.destroy();
  this.editor = null;
  clearTimeout(this.timeout);
 }
  /**
   * Send Data
   * @public
   *
   * @param {String<'publish' | 'save'>} type
   *
   */ 
  async sendData(type) {
    if (!/publish|save/.test(type))
      throw new Error('Type must be "save" or "publish"');
      
    const isSaving = type === 'save';

    try {
      const postStatus = isSaving ? 'draft' : 'publish';

      this.setState({
        sending: true,
      });

      const {
        ID, title, description, tags, images, url, category,
      } = this.state;

      console.log(images);

      const content = this.editor.getData();

      const urlEncoded = new URLSearchParams();

      urlEncoded.append('ID', ID);
      urlEncoded.append('title', title);
      urlEncoded.append('description', description);
      urlEncoded.append('tags', tags);
      urlEncoded.append('content', content);
      urlEncoded.append('images', images.join(','));
      urlEncoded.append('url', url);
      urlEncoded.append('category', category);

      if(!isSaving) {
        urlEncoded.append('postStatus', postStatus);
      }

      const req = await fetch(`/api/posts/${type}`, {
        method: 'POST',
        body: urlEncoded
      });

      let saveID = isSaving ? await req.text() : undefined;

      this.setState({
        postStatus,
        isSaved: true,
        ID: saveID,
        sending: false,
      });

      clearTimeout(this.timeout);

      if (!isSaving){
        this.props.cancel(true);
      }
    } catch (err) {
      alert(`Error ${isSaving ? 'Guardando' : 'Publicando'} la entrada`);
      console.error(err);
    }
  }

  handleInput({ target }) {
    const { name, type } = target;
    const value = type === 'checkbox' ? target.checked : target.value;

    this.setState({
      [name]: value,
    });
    if (name === 'title' && !this.state.isPublished) {
      this.setState({
        url: value.toLowerCase()
          .split(' ')
          .slice(0, 8)
          .join('-')
          .replace(/ñ/g, 'n')
          .replace(/á|à|â|ä/g, 'a')
          .replace(/é|è|ê|ë/g, 'e')
          .replace(/í|ì|î|ï/g, 'i')
          .replace(/ó|ò|ô|ö/g, 'o')
          .replace(/ú|ù|ü|û/g, 'u')
          .replace(/ñ/g, "n")
      });
    }

    if (this.state.postStatus !== 'published') {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.sendData('save'), 5000);
    }
  }

  render() {

    const {
      categories,
      sending,
      showImagesModal,
      title,
      category,
      description,
      tags,
      url,
      postStatus,
      isSaved,
      ID,
      isPublished,
    } = this.state;

    const hasCategories = categories.length > 0;

  return <div id='editor-container'>
    <div id='ck'/>
    <aside id='options'>
      <div>
        <img id='back' src='/assets/arrow.svg' onClick={() => this.props.cancel(isSaved)}/>
      </div>
      {
        hasCategories && (
          <select onChange={this.handleInput} name="category" value={category}>
            {
              categories.map((e) => <option value={e.name}>{e.alias}</option>)
            }
          </select>
        )
      }
      {
        hasCategories &&
        <hr/>
      }
      <div>
        <span>Titulo</span>
        <input type="text" name="title" value={title} placeholder="Titulo" onChange={this.handleInput} />
      </div>
      <hr/>
      <div>
        <span>Descripción</span>
        <textarea type="text" name="description" value={description} placeholder="Descripcion" onChange={this.handleInput} />
      </div>
      <hr/>
      <div>
        <span>Enlace</span>
        <input type="text" name="url" placeholder="URL" onChange={this.handleInput} value={url} disabled={isPublished} />
      </div>
      <hr/>
      <div>
        <span>Etiquetas</span>
        <input type="text" name="tags" value={tags} placeholder="Etiquetas" onChange={this.handleInput} />
      </div>
      <div id='buttons'>
        <button className="black circle" disabled={sending} onClick={() => window.open(`/preview/${process.env.AUTH_TOKEN}/${ID}`)}>
          <img src='/assets/preview.svg'/>
         </button>
        <button className="black circle" disabled={sending || isSaved} onClick={() => this.sendData('save')}>
          <img src='/assets/save.svg'/>
         </button>
        <button className="black circle" disabled={sending || postStatus === "published"} onClick={() => this.sendData('publish')}>
          <img src='/assets/send.svg'/>
         </button>
      </div>
    </aside>

    <style jsx global>{`
    #content {
      padding: 0 !important;
      width: 100% !important;
      left:0 !important;
    }
    #content > div:nth-child(1) {
      padding: 0 !important;
      width: 100% !important;
    }
    .ck-editor__top {
      filter: invert(.9);
    }
    .ck.ck-editor {
        width: 75% !important;
    }
    .ck.ck-editor__main {
      height: calc(100% - 41px);
    }
    .ck-rounded-corners .ck.ck-editor__main>.ck-editor__editable, .ck.ck-editor__main>.ck-editor__editable.ck-rounded-corners,
    .ck.ck-editor__main>.ck-editor__editable:not(.ck-focused) {
      height: 100%;
    }
    `}</style>
    <style jsx>{`
      hr {
        border: .5px #444 solid;
      }
      #back {
        filter: invert(.5);
        transform: rotate(90deg);
        width: 25px;

        cursor: pointer;
      }
      #options {
        position: relative;
        background: #1d1d1d;
        width: 20%;
        display: flex;
        flex-direction: column;
        padding: 2.5%;
      }
      #editor-container {
        display: flex;
        height: 100%
      }
      aside > div:nth-child(1) {
        margin: 0
      }
      aside > div {
        margin: 15px 0;
      }
      aside div span {
        margin-bottom: 15px;
        display: block;
        color: #bdbdbd;
      }
      aside div#buttons {
        display: flex;
        position: absolute;
        flex-direction: column;
        left: -100px;
        bottom: 0;
      }
      aside div#buttons button {
        width: 70px;
        height: 70px;
        margin: 12.5% 0;
      }
      aside div#buttons button img {
        width: 20px;
      }
      select {
        border: none;
        padding: 10px 5%;
        background: #1d1d1d;
        color: #bdbdbd;
      }
      select:hover {
        background: #2d2d2d
      }
      select:focus {
        outline: none;
      }
     `}</style>
  </div>
  }
}


/*

<div class="ck ck-dropdown ck-heading-dropdown">
  <button class="ck ck-button ck-off ck-button_with-text ck-dropdown__button" type="button" tabindex="-1" aria-labelledby="ck-editor__aria-label_e4cd092781ad9367c2f997693af6497b8" aria-haspopup="true">
    <span class="ck ck-tooltip ck-tooltip_s">
      <span class="ck ck-tooltip__text">Encabezado</span>
    </span>
    <span class="ck ck-button__label" id="ck-editor__aria-label_e4cd092781ad9367c2f997693af6497b8">Párrafo</span>
    <svg class="ck ck-icon ck-dropdown__arrow" viewBox="0 0 10 10">
      <path d="M.941 4.523a.75.75 0 1 1 1.06-1.06l3.006 3.005 3.005-3.005a.75.75 0 1 1 1.06 1.06l-3.549 3.55a.75.75 0 0 1-1.168-.136L.941 4.523z"></path>
    </svg> 
  </button>
  <div class="ck ck-reset ck-dropdown__panel ck-dropdown__panel_se">
    <ul class="ck ck-reset ck-list">
      <li class="ck ck-list__item">
        <button class="ck ck-button ck-heading_paragraph ck-on ck-button_with-text" type="button" tabindex="-1" aria-labelledby="ck-editor__aria-label_e51faf02a50b31d7bb690d30a3230f868">
          <span class="ck ck-tooltip ck-tooltip_s ck-hidden">
            <span class="ck ck-tooltip__text"></span>
          </span>
          <span class="ck ck-button__label" id="ck-editor__aria-label_e51faf02a50b31d7bb690d30a3230f868">Párrafo</span>
        </button>
      </li>
      <li class="ck ck-list__item">
    </ul>
  </div>
</div>*/
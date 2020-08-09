import React, { Component } from 'react';
import ImagesModal from './imagesModal';
import store from '../../../store';
import { adminHideLoad, adminHideMenu } from '../../../store/actions';

export default class Editor extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      description: '',
      tags: '',
      content: '',
      image: '',
      url: '',
      postStatus: 'new',
      category: '',
      categories: [],
      isSaved: false,
      isPublished: false,
      showImagesModal: false,
      sending: false,
    };

    this.editor = null;

    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
  }

  async componentDidMount() {
    if (this.props.data) {
      const {
        ID, title, description, image, postStatus, url, content, category, tags, isPublished,
      } = this.props.data;

      this.setState({
        ID,
        title,
        description,
        image,
        postStatus,
        url: /(\w*-)*/.test(url) && url !== 'null' ? url : '',
        content,
        category: 'null',//category === 'null' ? categories[0].name : category,
        tags,
        isPublished,
      });
    }

    const ed = ClassicEditor.create( document.querySelector( '#editor' ), {
      language: 'es',
      rootName: 'main'
    })
      .then(editor => {
        console.log(editor)
        this.editor = editor;
        editor.setData(content || '<p>Nueva super entrada</p>')
        store.dispatch(adminHideLoad());
        store.dispatch(adminHideMenu());

        console.log("init")
      }).catch(err => console.error(err));

  //var data = CKEDITOR.editor.getData();
  /*editor.on( 'change', function( evt ) {
  // getData() returns CKEditor's HTML content.
  console.log( 'Total bytes: ' + evt.editor.getData().length );
});*/
  }
 componentWillUnmount() {
  this.editor.destroy();
  this.editor = null;
 }
  render() {
    const {
      categories, sending, showImagesModal, title, category, description, tags, url, postStatus, isSaved, ID, isPublished,
    } = this.state;

  return <div id='editor-container'>
    <div id='editor'/>
    <aside id='options'>
      {
        categories.length > 0 && (
          <select onChange={this.handleInput} name="category" value={category}>
            {
              categories.map((e) => <option value={e.name}>{e.alias}</option>)
            }
          </select>
        )
      }
      <textarea type="text" name="description" value={description} placeholder="Descripcion" onChange={this.handleInput} />
      <input type="text" name="url" placeholder="URL" onChange={this.handleInput} value={url} disabled={isPublished} />
      <input type="text" name="tags" value={tags} placeholder="Etiquetas" onChange={this.handleInput} />
      <button className="white" disabled={isSaved || sending} onClick={this.save}>{postStatus === 'published' ? 'Cambiar a Borrador' : 'Guardar'}</button>
      <button className="gray" disabled={sending} onClick={this.publish}>{postStatus === 'published' ? 'Actualizar' : 'Publicar'}</button>
      <button className="gray" disabled={sending} onClick={() => window.open(`/preview/${process.env.AUTH_TOKEN}/${ID}`)}>Vista Previa</button>
      <button className="black" disabled={sending} onClick={() => this.props.cancel(isSaved)}>Cancelar</button>
    </aside>

    <style jsx global>{`
    #content {
      padding: 0 !important;
      width: 100% !important;
      left:0;
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
    `}</style>
    <style jsx>{`
      #options {
        background: #1d1d1d;
        width: 20%;
        display: flex;
        flex-direction: column;
        padding: 2.5%;
      }
      #editor-container {
        display: flex;
      }
     `}</style>
  </div>
  }
}

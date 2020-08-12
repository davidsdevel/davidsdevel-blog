import React, {Component} from 'react';

export default class ModalBase extends Component {
  render() {
    return <div>
      <div id="shadow" style={{ display, opacity }}>
        <div id="subscription-main">
          <img src="/assets/arrow.svg" onClick={() => (step === 0 ? this.exit() : this.prev())} />
          {ui}
        </div>
      </div>
      <style jsx>
       {`
        ${show ? 'body {overflow-y: hidden}' : ''}
        #shadow {
          top: 0;
          left: 0;
          background: rgba(0,0,0,.5);
          position: fixed;
          width: 100%;
          height: 100%;
          justify-content: space-around;
          align-items: center;
          z-index: 1;
          transition: ease .6s;
        }
        #shadow #subscription-main {
          position: relative;
          width: 80%;
          height: 80%;
          max-width: 400px;
          background: #f7f7f7;
          border-radius: 5px;
        }
        :global(#shadow #subscription-main form,
        #shadow #subscription-main div) {
          display: flex;
          flex-direction: column;
          position: absolute;
          justify-content: space-around;
          align-items: center;
          width: 100%;
          height: 80%;
          top: 10%;
        }
        :global(#shadow #subscription-main div) {
          text-align: center;
        }
        :global(#shadow #subscription-main form span) {
          text-align: center;
        }
        :global(input[type="email"].invalid) {
          border: #F44336 solid 2px;
        }
        #shadow #subscription-main img {
          cursor: pointer;
          transform: rotate(90deg);
          position: absolute;
          top: 10px;
          left: 10px;
        }
      `}
      </style>
    </div>
  }
}
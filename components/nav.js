import React, {Component} from 'react'
import Link from 'next/link'
import {string} from "prop-types";

//04142604784
const links = [
  { href: '/about', label: 'Acerca de mi' },
  { href: '/terms', label: 'Terminos de Uso' },
  { href: "/policy", label: "Politicas de Privacidad"}
].map(link => {
  link.key = `nav-link-${link.href}-${link.label}`
  return link
})

class Nav extends Component {
  constructor() {
    super();
    this.state = {
      searchIsOpen: false,
      menuIsOpen: false,
      search: "",
      arrowStyle:{
        width: 0,
        opacity: 0
      },
      inputStyle:{
        width: 0,
        opacity: 0
      },
      shadowStyle: {
        right: "-100%"
      },
      menuStyle: {
        left: "-100%"
      },
      mobileBar: {
        top: "-72px"
      },
      inputBackground: "none",
      titleOpacity: 1
    }
    this.handleInput = this.handleInput.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  handleInput({target}) {
    const {value} = target;

    this.setState({
      search: value
    }) 
  }
  toggleMenu() {
    if(this.state.menuIsOpen)
      this.setState({
        menuStyle: {
          left: "-100%"
        },
        shadowStyle: {
          right: "-100%"
        },
        menuIsOpen: false
      });
    else
      this.setState({
        menuStyle: {
          left: 0
        },
        shadowStyle: {
          right: 0
        },
        menuIsOpen: true
      });
  }
  toggleSearch() {
    if (this.state.searchIsOpen)

      this.setState({
        inputWidth: undefined,
        arrowStyle:{
          width: 0,
          opacity: 0
        },
        inputStyle:{
          width: 0,
          opacity: 0
        },
        inputBackground: "none",
        searchIsOpen: false,
        titleOpacity: 1,
        search: ""
      });

    else
      this.setState({
        inputWidth: "70%",
        inputStyle: {
          width: "calc(100% - 76px)"
        },
        arrowStyle: {
          width: "18px"
        },
        inputBackground: "#f1f1f1",
        searchIsOpen: true,
        titleOpacity: 0
      });
  }
  componentDidMount() {
    if (document.body.clientWidth >= 720) {
      this.setState({
        mobileBar: {
          top: "-1px"
        }
      });
    }
    document.body.onscroll = () => {
      this.setState({
        inputWidth: undefined,
        arrowStyle:{
          width: 0,
          opacity: 0
        },
        inputStyle:{
          width: 0,
          opacity: 0
        },
        inputBackground: "none",
        searchIsOpen: false,
        titleOpacity: 1,
        search: ""
      });

      if (document.body.clientWidth < 720) {
        const top = document.documentElement.scrollTop;

        if (top >= window.screen.availHeight - 70)
          this.setState({
            mobileBar: {
              top: "-1px"
            }
          });
        else
          this.setState({
            mobileBar: {
              top: "-72px"
            }
          });
      }
    }
  }
  render() {
    return <nav id="nav">
      <div id="fb-root"></div>
      <script async defer crossOrigin="anonymous" src="https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v4.0&appId=337231497026333&autoLogAppEvents=1"/>
      <div id="mobile-bar" style={this.state.mobileBar}>
        <img onClick={this.toggleMenu} id="menu-icon" src="/static/assets/menu.svg"/>
        <span id="title" style={{opacity: this.state.titleOpacity}}>{this.props.title}</span>
        <div id="input" style={{background: this.state.inputBackground}}>
          <img className="inline" onClick={this.toggleSearch} style={{float: "left"}}src="/static/assets/search.svg"/>
          <input value={this.state.search} className="inline" style={this.state.inputStyle} type="text" placeholder="Busqueda" onChange={this.handleInput}/>
          <img className="inline" id="arrow" style={{...this.state.arrowStyle, float: "right"}} src="/static/assets/arrow.svg" />
        </div>
      </div>
      <div id="shadow" style={this.state.shadowStyle} onClick={this.toggleMenu}></div>
      <ul id="menu" style={this.state.menuStyle}>
        <button style={{float: "right"}} onClick={this.toggleMenu}>
          <img src="/static/assets/cross.svg"/>
        </button>
        <img src="/static/images/davidsdevel-black.png"/>
        <li>
          <Link href='/'>
            <a>Home</a>
          </Link>
        </li>
        {links.map(({ key, href, label }) => (
          <li key={key}>
            <a href={href}>{label}</a>
          </li>
        ))}
      </ul>
      <style global jsx>{`
        html {
          scroll-behavior: smooth;
        }
        @font-face {
          font-family: Roboto;
          src: url(/static/fonts/Roboto.ttf);
        }
        button:focus {
          outline: none;
        }
        li {
          list-style: none;
        }
        a {
          text-decoration: none;
        }
        * {
          margin: 0;
          padding: 0;
          font-family: Roboto, Helvetica;
        }
      `}</style>
      <style jsx>{`
        #nav #mobile-bar {
          background: white;
          box-shadow: 0 1px 2px rgba(0, 0, 0, .3);
          width: 90%;
          height: 40px;
          padding: 15px 5%;
          position: fixed;
          z-index: 1;
          transition: ease .4s;
        }
        #nav .inline {
          display: inline-block;
        }
        #nav #menu-icon {
          position: absolute;
          top: 17px;
          left: 5%;
          z-index: 2;
        }
        #nav #title {
          position: absolute;
          width: 100%;
          text-align: center;
          left: 0;
          top: 25px;
          font-size: 20px;

          transition: ease .2s;
          transition-delay: .6s;
        }
        #nav #input {
          border-radius: 50px;
          position: absolute;
          right: 2.5%;
          top: 17px;

          transition: ease .5s;
        }
        #nav #input img {
          height: 18px;
          margin: 10px 10px;
          
          transition: ease .5s;
        }
        #nav #input input {
          background: none;
          border: none;
          height: 34px;
          color: gray;

          transition: ease .5s;
        }
        #nav #input input::placeholder {
          color: black;
          opacity: 1;
        }
        #nav #input input::-ms-input-placeholder {
          color: black;
        }
        #nav #input input:focus {
          outline: none;
          color: black;
        }
        #nav #input #arrow {
          transform: rotate(270deg);
        }
        #nav #shadow, #nav #menu {
          transition: ease .3s;
        }
        #nav #shadow {
          position: fixed;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, .3);
          top: 0;
          z-index: 1;
        }
        #nav #menu {
          margin: 0;
          position: fixed;
          background: white;
          width: 70%;
          height: 100%;
          top: 0;
          z-index: 1;
        }
        #nav #menu > img {
          width: 25%;
          margin: 15px auto 45px;
          display: block;
        }
        #nav #menu li {
          color: blue;
          margin-left: -40px;
          width: calc(100% + 40px);
        }
        #nav #menu li a {
          width: 100%;
          padding: 20px 0;
          text-align: center;
          display: block;
        }
        #nav #menu button {
          float: right;
          background: none;
          border: none;
          cursor: pointer;
          width: 30px;
        }
        #nav #menu button img {
          width: 100%;
        }
        @media screen and (min-width: 480px) {
          #nav #menu {
            width: 55%;
          }
        }
        @media screen and (min-width: 720px) {
          #nav #menu {
            width: 40%;
          }
        }
        @media screen and (min-width: 960px) {
          #nav #menu {
            width: 30%;
          }
        }
      `}</style>
    </nav>
  }
}

Nav.propTypes = {
  title: string
}
export default Nav

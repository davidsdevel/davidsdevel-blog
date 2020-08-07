import { createStore, combineReducers } from 'redux';

const loadBar = {
  show: false,
};
const modal = {
  show: false,
};
const searchState = {
  actual: '',
  bind: '',
};
const adminLoad = {
  show: false,
  showMenu: true
};

const alert = (state = { message: '', show: false }, action) => {
  switch (action.type) {
    case 'SHOW_ALERT':
      return {
        show: true,
        message: action.message,
      };
    case 'HIDE_ALERT':
      return {
        show: false,
        message: '',
      };
    default: return state;
  }
};
const appLoad = (state = loadBar, action) => {
  switch (action.type) {
    case 'SHOW_LOAD':
      return {
        show: true,
      };
    case 'HIDE_LOAD':
      return {
        show: false,
      };
    default: return state;
  }
};
const subscriptionModal = (state = modal, action) => {
  switch (action.type) {
    case 'SHOW_MODAL':
      return {
        show: true,
      };
    case 'HIDE_MODAL':
      return {
        show: false,
      };
    default: return state;
  }
};
const search = (state = searchState, action) => {
  switch (action.type) {
    case 'SEARCH':
      return {
        ...state,
        actual: action.search,
      };
    case 'BIND':
      return {
        ...state,
        bind: action.bind,
      };
    default: return state;
  }
};
const admin = (state = adminLoad, action) => {
  switch (action.type) {
    case 'ADMIN_SHOW_LOAD':
      return {
        ...state,
        show: true,
      };
    case 'ADMIN_HIDE_LOAD':
      return {
        ...state,
        show: false,
      };
    case 'ADMIN_SHOW_MENU':
      return {
        ...state,
        showMenu: true
      }
    case 'ADMIN_HIDE_MENU':
      return {
        ...state,
        showMenu: false
      }
    default: return state;
  }
};

const reducer = combineReducers({
  appLoad,
  subscriptionModal,
  search,
  alert,
  admin,
});

export default createStore(reducer);

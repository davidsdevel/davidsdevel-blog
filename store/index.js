import { createStore, combineReducers } from "redux";

let loadBar = {
	show: false
};
let modal = {
	show: false
};
let searchState = {
	actual: "",
	bind: ""
};

const alert = (state = {message: "", show: false}, action) => {
	switch(action.type) {
	case "SHOW_ALERT":
		return {
			show: true,
			message: action.message
		};
	case "HIDE_ALERT":
		return {
			show: false,
			message: ""
		};
	default: return state;
	}
};
const appLoad = (state = loadBar, action) => {
	switch(action.type) {
	case "SHOW_LOAD":
		return {
			show: true
		};
	case "HIDE_LOAD":
		return {
			show: false
		};
	default: return state;
	}
};
const subscriptionModal = (state = modal, action) => {
	switch(action.type) {
	case "SHOW_MODAL":
		return {
			show: true
		};
	case "HIDE_MODAL":
		return {
			show: false
		};
	default: return state;
	}
};
const search = (state = searchState, action) => {
	switch(action.type) {
	case "SEARCH":
		return {
			...state,
			actual: action.search
		};
	case "BIND":
		return {
			...state,
			bind: action.bind
		};
	default: return state;
	}
};

let reducer = combineReducers({
	appLoad,
	subscriptionModal,
	search,
	alert
});

export default createStore(reducer);

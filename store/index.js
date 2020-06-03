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
	search
});

export default createStore(reducer);

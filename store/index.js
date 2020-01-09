import { createStore, combineReducers } from "redux";

let loadBar = {
	show: false
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

let reducer = combineReducers({
	appLoad
});

export default createStore(reducer);

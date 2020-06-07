const viewLoad = () => ({
	type: "VIEW_LOAD"
});
const showAlert = message => ({
	type: "SHOW_ALERT",
	message
});
const hideAlert = () => ({
	type: "HIDE_ALERT"
});
const showModal = () => ({
	type: "SHOW_MODAL"
});
const hideModal = () => ({
	type: "HIDE_MODAL"
});
const search = search => ({
	type: "SEARCH",
	search
});
const bindSearch = query => ({
	type: "BIND",
	bind: query
});
const adminShowLoad = () => ({
	type: "ADMIN_SHOW_LOAD"
});
const adminHideLoad = () => ({
	type: "ADMIN_HIDE_LOAD"
});

export {
	viewLoad,
	showModal,
	hideModal,
	bindSearch,
	search,
	showAlert,
	hideAlert,
	adminShowLoad,
	adminHideLoad
};

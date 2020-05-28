const viewLoad = () => ({
	type: "VIEW_LOAD"
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

export { viewLoad, showModal, hideModal, bindSearch, search };
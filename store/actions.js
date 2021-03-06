const viewLoad = () => ({
  type: 'VIEW_LOAD',
});
const showAlert = (message) => ({
  type: 'SHOW_ALERT',
  message,
});
const hideAlert = () => ({
  type: 'HIDE_ALERT',
});
const showModal = () => ({
  type: 'SHOW_MODAL',
});
const hideModal = () => ({
  type: 'HIDE_MODAL',
});
const adminShowLoad = () => ({
  type: 'ADMIN_SHOW_LOAD',
});
const adminHideLoad = () => ({
  type: 'ADMIN_HIDE_LOAD',
});
const adminShowMenu = () => ({
  type: 'ADMIN_SHOW_MENU',
});
const adminHideMenu = () => ({
  type: 'ADMIN_HIDE_MENU',
});

export {
  viewLoad,
  showModal,
  hideModal,
  showAlert,
  hideAlert,
  adminShowLoad,
  adminHideLoad,
  adminShowMenu,
  adminHideMenu,
};

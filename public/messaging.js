"use strict";function asyncGeneratorStep(e,r,t,n,s,a,o){try{var i=e[a](o),c=i.value}catch(e){return void t(e)}i.done?r(c):Promise.resolve(c).then(n,s)}function _asyncToGenerator(e){return function(){var r=this,t=arguments;return new Promise((function(n,s){var a=e.apply(r,t);function o(e){asyncGeneratorStep(a,n,s,o,i,"next",e)}function i(e){asyncGeneratorStep(a,n,s,o,i,"throw",e)}o(void 0)}))}}function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function _createClass(e,r,t){return r&&_defineProperties(e.prototype,r),t&&_defineProperties(e,t),e}var Messaging=function(){function e(r){var t;_classCallCheck(this,e),this.config=r,t=firebase.apps.length?firebase.app():firebase.initializeApp(this.config),this.messaging=firebase.messaging(t),this.tokenSent=1===localStorage.getItem("sentToServer")}var r,t,n;return _createClass(e,[{key:"init",value:(n=_asyncToGenerator(regeneratorRuntime.mark((function e(){var r=this;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:this.messaging.onTokenRefresh(_asyncToGenerator(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,r.messaging.getToken();case 3:return t=e.sent,r.setTokenSentToServer(!1),e.next=7,r.sendTokenToServer(t);case 7:e.next=12;break;case 9:e.prev=9,e.t0=e.catch(0),console.error("Unable to retrieve refreshed token ",e.t0);case 12:case"end":return e.stop()}}),e,null,[[0,9]])}))));case 1:case"end":return e.stop()}}),e,this)}))),function(){return n.apply(this,arguments)})},{key:"getToken",value:(t=_asyncToGenerator(regeneratorRuntime.mark((function e(){var r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,this.messaging.requestPermission();case 3:return e.next=5,this.messaging.getToken();case 5:if(!(r=e.sent)){e.next=10;break}return e.next=9,this.sendTokenToServer(r);case 9:return e.abrupt("return",e.sent);case 10:return this.setTokenSentToServer(!1),e.abrupt("return",Promise.resolve("no-token"));case 14:return e.prev=14,e.t0=e.catch(0),console.error("Error sending token to server".concat(e.t0)),e.abrupt("return",Promise.reject(e.t0));case 18:case"end":return e.stop()}}),e,this,[[0,14]])}))),function(){return t.apply(this,arguments)})},{key:"sendTokenToServer",value:(r=_asyncToGenerator(regeneratorRuntime.mark((function e(r){var t,n;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.isTokenSentToServer){e.next=20;break}return e.prev=1,t=localStorage.getItem("userID"),e.next=5,fetch("/api/users/add-fcm-token",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:r,ID:t||""})});case 5:if(!((n=e.sent).status>=400)){e.next=8;break}return e.abrupt("return",Promise.reject());case 8:return e.next=10,n.json();case 10:if("OK"!==e.sent.status){e.next=14;break}return this.setTokenSentToServer(!0),e.abrupt("return",Promise.resolve());case 14:return e.abrupt("return",Promise.reject());case 17:return e.prev=17,e.t0=e.catch(1),e.abrupt("return",Promise.reject(e.t0));case 20:return e.abrupt("return",Promise.resolve());case 21:case"end":return e.stop()}}),e,this,[[1,17]])}))),function(e){return r.apply(this,arguments)})},{key:"setTokenSentToServer",value:function(e){localStorage.setItem("sentToServer",e?"1":"0"),this.tokenSent=!!e}},{key:"isTokenSentToServer",get:function(){return this.tokenSent}}]),e}();
"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator")),_defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty")),STORAGE_KEY="<%= options.storageKey %>",VUEX_NAMESPACE="<%= options.vuexNamespace %>",LOGIN_URL="<%= options.loginUrl %>",LOGOUT_URL="<%= options.logoutUrl %>",ACCESS_TOKEN_KEY="<%= options.accessTokenKey %>",REFRESH_TOKEN_KEY="<%= options.refreshTokenKey %>",REFRESH_URL="<%= options.refreshUrl %>",REFRESH_USING_HEADER="<%= options.refreshUsingHeader %>",REFRESH_PERIOD=1e3*"<%= options.refreshPeriod %>",state=function(){return{refreshInterval:null}},mutations={refreshInterval:function refreshInterval(a,b){a.refreshInterval&&clearInterval(a.refreshInterval),a.refreshInterval=b},refreshToken:function refreshToken(a,b){this.$auth.$storage.setUniversal(STORAGE_KEY,b)}},actions={initRefreshInterval:function initRefreshInterval(a){var b=a.dispatch;b("resetRefreshInterval",this.$auth.$storage.getUniversal(STORAGE_KEY))},resetRefreshInterval:function resetRefreshInterval(a,b){var c=a.dispatch,d=a.commit;c("stopRefreshInterval"),d("refreshToken",b);var e=function(){c("attemptRefresh")};setTimeout(function(){return d("refreshInterval",setInterval(e,REFRESH_PERIOD))},REFRESH_PERIOD/2)},stopRefreshInterval:function stopRefreshInterval(a){var b=a.commit;b("refreshInterval",null)},attemptRefresh:function attemptRefresh(a){var b,c,d,e;return _regenerator["default"].async(function(f){for(;;)switch(f.prev=f.next){case 0:if(b=a.commit,c=a.dispatch,d=this.$auth.$storage.getUniversal(STORAGE_KEY),d||REFRESH_USING_HEADER){f.next=4;break}throw new Error("Refresh token is required");case 4:return f.prev=4,f.next=7,_regenerator["default"].awrap(this.$auth.request({url:REFRESH_URL,method:"post",data:(0,_defineProperty2["default"])({},REFRESH_TOKEN_KEY,d)}));case 7:e=f.sent,this.$auth.setToken("local",e[ACCESS_TOKEN_KEY]),this.$axios.setHeader("Authorization","Bearer "+e[ACCESS_TOKEN_KEY]),b("refreshToken",e[REFRESH_TOKEN_KEY]||null),f.next=18;break;case 13:if(f.prev=13,f.t0=f["catch"](4),c("stopRefreshInterval"),!(f.t0.response&&401===f.t0.response.status)){f.next=18;break}throw new"Refresh unauthenticated";case 18:case"end":return f.stop();}},null,this,[[4,13]])}},storeModule={state:state,actions:actions,mutations:mutations,namespaced:!0},_default=function(a){var b=a.$axios,c=a.store;c.registerModule(VUEX_NAMESPACE,storeModule,{preserveState:!!c.state[VUEX_NAMESPACE]}),b.interceptors.response.use(function(a){return-1!==a.config.url.indexOf(LOGIN_URL)&&c.dispatch(VUEX_NAMESPACE+"/resetRefreshInterval",a.data[REFRESH_TOKEN_KEY]||null),a}),b.interceptors.response.use(function(a){return-1!==a.config.url.indexOf(LOGOUT_URL)&&c.dispatch(VUEX_NAMESPACE+"/stopRefreshInterval"),a})};exports["default"]=_default;
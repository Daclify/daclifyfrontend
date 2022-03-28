import { boot } from 'quasar/wrappers'
import { JsonRpc, Api, Serialize, RpcError } from "@jafri/eosjs2";
// import { JsonRpc, Api, Serialize, RpcError } from "eosjs";
const { JsSignatureProvider } = require('@jafri/eosjs2/dist/eosjs-jssig');
// const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
var VConsole = require("vconsole");
var vConsole = new VConsole();

let signaturep = new JsSignatureProvider(["5JyMQejqoJLLrd6SHYQqkhWeAkXjcps8LEC6KQtebDuUDBwhvp5"]);



class EosApi {
  constructor(endpoints) {
    this.api = null;
    this.Serialize = Serialize;
    this.RpcError = RpcError;
    this.build(endpoints)
  }
  build (endpoints) {
    const rpc = new JsonRpc(endpoints);
    const api = new Api({
      rpc,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder()
    });
    this.api = api;
  }
}

export default boot(({ app, store }) => {
  console.log('eos injected in Vue prototype!');
  // Vue.prototype.$eos.api = api;
  app.config.globalProperties.$eos = new EosApi(store.getters["ual/getRpcEndpoints"]);
});
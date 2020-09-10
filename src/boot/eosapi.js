import { JsonRpc, Api, Serialize, RpcError} from "@jafri/eosjs2";
const {JsSignatureProvider}  = require('@jafri/eosjs2/dist/eosjs-jssig');
var VConsole = require("vconsole");
var vConsole = new VConsole();

let signaturep = new JsSignatureProvider(["5JyMQejqoJLLrd6SHYQqkhWeAkXjcps8LEC6KQtebDuUDBwhvp5"])



class EosApi {
  constructor(endpoints){
    this.api = null;
    this.Serialize = Serialize;
    this.RpcError = RpcError;
    this.build(endpoints)
  }
  build(endpoints){
    const rpc = new JsonRpc(endpoints);
    const api = new Api({
      rpc,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder()
    });
    this.api = api;
  }
}

export default ({ Vue, store }) => {
  console.log('eos injected in Vue prototype!');
  // Vue.prototype.$eos.api = api;
  Vue.prototype.$eos = new EosApi(store.getters["ual/getRpcEndpoints"]);
};
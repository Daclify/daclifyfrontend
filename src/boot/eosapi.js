import { JsonRpc, Api, Serialize, RpcError} from "@jafri/eosjs2";
//var VConsole = require("vconsole");
//var vConsole = new VConsole();

const switch_network = function (endpoints){
  const rpc = new JsonRpc(endpoints);
  const api = new Api({
    rpc,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  });
  
  api.Serialize = Serialize;
  api.switch_network = switch_network;
  console.log(api);
  return api;
}


export default ({ Vue, store }) => {
  console.log('eos injected in Vue prototype!');
  // Vue.prototype.$eos = api;
  Vue.prototype.$eos = switch_network(store.getters["ual/getRpcEndpoints"]);
};
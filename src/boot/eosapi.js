import { JsonRpc, Api, Serialize } from "eosjs";
var VConsole = require("vconsole");
var vConsole = new VConsole();


const rpc = new JsonRpc("https://jungle3.eossweden.org"); //api.main.alohaeos.com, eos.greymass.com, jungle2.cryptolions.io jungle.eosdac.io
const api = new Api({
  rpc,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder()
});

api.Serialize = Serialize;

api.setEndpoint = (endpoint) => {
  console.log('setting endpoint to', endpoint);
  api.rpc = new JsonRpc(endpoint);
}

export default ({ Vue }) => {
  // something to do
  console.log('eos injected in Vue prototype!');
  console.log(api)

  Vue.prototype.$eos = api;
};
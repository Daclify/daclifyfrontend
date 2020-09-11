import { scatter_patch } from "./patches/scatter_patch.js";
import { anchor_patch } from "./patches/anchor_patch.js";

class freeCpuPatch {
  constructor(options = {}) {
    console.log("initialize freecpupatch");

    let default_options = {
      cpu_payer: "",
      permission: "",
      priv_key: ""
    };
    this.options = Object.assign(default_options, options);
    this.disabled = false;
    console.log(this.options);
    this.whitelist=[{id:0, contract:"dac.boid", action:"imalive"}];
  }

  actionsWhitelisted(actions){
    
    let test = true;
    for(let i = 0; i < actions.length; i++){
      let action = actions[i];

      let whitelisted_contract= this.whitelist.find(w=> w.contract === action.account);
      console.log("whitelisted_contract", whitelisted_contract)
      if( whitelisted_contract === undefined ){
        test = false;
        break;
      }
      else{
        if(whitelisted_contract.action !== action.name && whitelisted_contract.action !== ""){
          test = false;
          break;
        }

      }

    }
    console.log("actionsWhitelisted ", test)
    return test;

  }

  getTargetName(target){

    if(target.link){
      return "AnchorUser"
    }

  }

  patch(authenticatorName) {

    let self = this;
    return {
      get(target, propKey, receiver) {
        if (propKey !== "signTransaction" || self.disabled) {
          return target[propKey];
        }

        console.log("signTransaction trapped");
        console.log("target", target)

        //apply custom patch for each authenticator
        return async function(...args) {
          if(!self.actionsWhitelisted(args[0].actions) ){
            //exec normal trxi
            const origMethod = target[propKey];
            let result = origMethod.apply(this, args);
            return result;

          }
          //prepend noop action
          args[0].actions.unshift({
            account: "cpuservice11",
            name: "freecpu",
            authorization: [
              {
                actor: self.options.cpu_payer,
                permission: self.options.permission
              }
            ],
            data: {
              user: "",
              cpu_payer: self.options.cpu_payer
            }
          });

          let p;
          switch (authenticatorName) {
            case "Scatter":
              p = new scatter_patch(target, self.options);
              return p.patch(args);
              //break;

            case "Anchor":
              p = new anchor_patch(target, self.options);
              return p.patch(args);
              //break;

            default:
              //exec original method
              const origMethod = target[propKey];
              let result = origMethod.apply(this, args);
              return result;
              //break;
          }
        };
      }
    };
  }
}

export { freeCpuPatch };

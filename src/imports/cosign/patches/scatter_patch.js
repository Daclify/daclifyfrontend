
  import {JsSignatureProvider}  from'@jafri/eosjs2/dist/eosjs-jssig';
  import {Api} from "@jafri/eosjs2";
  import { UALErrorType, UALError } from 'universal-authenticator-library'



  class UALScatterError extends UALError {
    constructor(message, type, cause) {
      super(message, type, cause, "scatter")
    }
  }


const network = {
    blockchain:'eos',
    chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    host:'nodes.get-scatter.com',
    port:443,
    protocol:'https'
  };


  /*
EOS private key:
5JbQ7f1BMkf8pKS1zpGd7htBF1aXXJg2ucvVqh9ziguQZBvx4u4
EOS public key:
EOS5tQ5dxnoCqLnPJsz2xV9UPzLorNbu7SEb5PBVdhfR37dqpikM8
*/


class scatter_patch{
    constructor(target, options){
        console.log('patch init')
        this.target = target;
        console.log(target);
        this.options = options;
    }

    async patch(args){
       
  
            const signatureProvider = this.target.scatter.eosMultiHook(network, [new JsSignatureProvider([this.options.priv_key])]);
            let rpc = this.target.rpc;
            const api = new Api({ rpc, signatureProvider });
            

           
            try {
                const completedTransaction = await api.transact(
                    args[0], { broadcast : true, blocksBehind : 3, expireSeconds : 30, sign: true }
                )
          
                return this.target.returnEosjsTransaction(true, completedTransaction)
              } catch (e) {
                throw new UALScatterError(
                  'Unable to sign the given transaction',
                  UALErrorType.Signing,
                  e)
              }
        
    }
}

export {
    scatter_patch
};
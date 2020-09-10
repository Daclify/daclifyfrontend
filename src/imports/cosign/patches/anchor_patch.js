
import {JsSignatureProvider}  from'@jafri/eosjs2/dist/eosjs-jssig';

const cosign_options = {
  cpu_payer: "piecesnbitss", 
  permission: "freecpu",
  priv_key: "5JbQ7f1BMkf8pKS1zpGd7htBF1aXXJg2ucvVqh9ziguQZBvx4u4",
  pub_key: "EOS5tQ5dxnoCqLnPJsz2xV9UPzLorNbu7SEb5PBVdhfR37dqpikM8"
}


class anchor_patch{
    constructor(target){
      console.log('patch init')
      this.target = target;
      this.rpc = target.session.link.rpc;
      this.chainId = target.session.link.chainId;
    }

    async patch(args){
       
      let trx = await this.userSign(args);

      let cosignature = await this.getCoSignature(trx.serializedTransaction);
      trx.signatures = trx.signatures.concat(cosignature);
      //console.log(trx)
      let completedTransaction =  await this.rpc.push_transaction(trx);
      console.log("completedTransaction",completedTransaction);
      return this.target.returnEosjsTransaction(true, completedTransaction)
    }

    async userSign(args){
      let res = await this.target.session.transact(
        args[0], { broadcast : false, blocksBehind : 3, expireSeconds : 30, sign: true }
      )
      return res;
    }

    async getCoSignature(serializedTransaction){
      
      const signatureProvider = new JsSignatureProvider([cosign_options.priv_key]);
      console.log("signatureProvider",signatureProvider)
      const availablekeys = await signatureProvider.getAvailableKeys();
      const signArgs = {
        chainId: this.chainId,
        requiredKeys: availablekeys,
        serializedTransaction: serializedTransaction,
        abis: [],
      }
      console.log(signArgs)
      let signature =(await signatureProvider.sign(signArgs) ).signatures
      console.log("cosignature", signature);
      return signature;
    

    }
}

export {
    anchor_patch
};
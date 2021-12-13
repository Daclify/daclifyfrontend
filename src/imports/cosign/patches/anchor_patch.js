
import {JsSignatureProvider}  from'@jafri/eosjs2/dist/eosjs-jssig';
import {Api} from "@jafri/eosjs2";



class anchor_patch{
    constructor(target, options){
      console.log('patch init')
      console.log("target", target)
      this.target = target;
      this.rpc = target.session.link.rpc;
      this.chainId = target.session.link.chainId;
      this.options = options;
    }

    async patch(args){
      let trx = await this.getSerializedTrx(args[0]);
      //let trx = await this.userSign(args);
      let cosignature = await this.getCoSignature(trx.serializedTransaction);
      trx.signatures = trx.signatures.concat(cosignature);

      let usersignature = await this.getUserSignature(trx.serializedTransaction);
      trx.signatures = trx.signatures.concat(usersignature);

      console.log("trx before push", trx)

      let completedTransaction =  await this.rpc.push_transaction(trx);
      console.log("completedTransaction",completedTransaction);
      return this.target.returnEosjsTransaction(true, completedTransaction)
    }

    async getSerializedTrx(transaction){
      console.log("getSerializedTrx", "xxx")
      let rpc = this.rpc;
      const api = new Api({
        rpc,
        textDecoder: new TextDecoder(),
        textEncoder: new TextEncoder()
      });
      console.log(api)
      let res = await api.transact(
        transaction, { broadcast : false, blocksBehind : 3, expireSeconds : 30, sign: false }
      )
      console.log("getSerializedTrx", res)
      return res
    }

    async getCoSignature(serializedTransaction){

      const signatureProvider = new JsSignatureProvider([this.options.priv_key]);
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

    async getUserSignature(serializedTransaction){

      const signatureProvider = this.target.session.makeSignatureProvider();
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
      console.log("user signature", signature);
      return signature;


      let res = await this.target.session.transact(
        args[0], { broadcast : false, blocksBehind : 3, expireSeconds : 30, sign: true }
      )
      console.log("user signed", res)
      return res;
    }
}

export {
    anchor_patch
};
import Vue from "vue";

const crypto = require('crypto');

export function randomName () {
  let name = ''
  let possible = 'abcdefghijklmnopqrstuvwxyz12345.'
  for (let i = 0; i < 12; i++) {
    name += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return name
}

export function sha256(content){
  return crypto.createHash(`sha256`).update(content).digest(`hex`)
}

export function secondsToDhms(seconds) {
  seconds = Number(seconds);
  if(seconds < 0) return "";
  var d = Math.floor(seconds / (3600*24));
  var h = Math.floor(seconds % (3600*24) / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 60);
  var dDisplay = d > 0 ? `${d}` + (d == 1 ? " day" : " days") : "";
  var hDisplay = h > 0 ? `, ${h}` + (h == 1 ? " hour" : " hours") : "";
  var mDisplay = m > 0 ? `, ${m}` + (m == 1 ? " minute" : " minutes") : "";
  var sDisplay = s > 0 ? `, ${s}` + (s == 1 ? " second" : " seconds") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

export function relativeTimeDelta(previous, current=Date.now(),) {

  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    let n = Math.round(elapsed/1000);
    if(n < 30){ 
      return "just now";
    }
    else{
      return n + ` seconds ago`;
    }
       //return Math.round(elapsed/1000) + ' seconds ago'; 
       return "just now" ;
  }

  else if (elapsed < msPerHour) {
    let n = Math.round(elapsed/msPerMinute);
    return n + ` ${n > 1 ? "minutes" : "minute"} ago`;    
  }

  else if (elapsed < msPerDay ) {
    let n = Math.round(elapsed/msPerHour );
    return n + ` ${n > 1 ? "hours" : "hour"} ago`;   
  }

  else if (elapsed < msPerMonth) {
      let n = Math.round(elapsed/msPerDay);
      return n + ` ${n > 1 ? "days" : "day"} ago`;   
  }

  else if (elapsed < msPerYear) {
    let n = Math.round(elapsed/msPerMonth);
    return n + ` ${n > 1 ? "months" : "month"} ago`;  
  }

  else {
    let n = Math.round(elapsed/msPerYear );
    return n + ` ${n > 1 ? "years" : "year"} ago`;    
  }
}

export function chunkArray(arr, chunksize) {
  let R = [];
  for (var i = 0; i < arr.length; i += chunksize) {
    R.push(arr.slice(i, i + chunksize));
  }
  return R;
}

export async function getSystemMsig(proposer, proposal_name) {
  let contract = "eosio.msig";
  let res = await Vue.prototype.$eos.api.rpc
    .get_table_rows({
      json: true,
      code: contract,
      scope: proposer,
      table: "proposal",
      ower_bound: proposal_name,
      limit: 1
    })
    .catch(e => false);
  if (res && res.rows.length && res.rows[0].proposal_name == proposal_name) {
    console.log(res.rows)
    //hash code 
    let r = {
      hash_code: crypto.createHash(`sha256`).update(res.rows[0].packed_transaction).digest(`hex`),
    }
    return res.rows[0];
    
  } else {
    
  }
}

export async function serializeActionData(action ) {
  try {
    let account = action.account;
    let name = action.name;
    let data = action.data;
    const contract = await Vue.prototype.$eos.api.getContract(account);
    let hex = Vue.prototype.$eos.Serialize.serializeActionData(
      contract,
      account,
      name,
      data,
      new TextEncoder(),
      new TextDecoder()
    );
    return hex;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function get_content_from_trace(trxid, block_num, actionname, datakey ) {
  let content = "";
  let error = false;
  let found = false;

  let startblock = block_num;
  let endblock = startblock+10;
  let block;

  while( !found && startblock !=endblock && !error){
    block = await Vue.prototype.$eos.api.rpc.get_block(startblock);
    console.log('looking in block_num',startblock)
    // console.log(block)
    if(block && block.transactions.length){
      let transaction = block.transactions.find(trx => trx.trx.id == trxid);
      if(transaction){
        let data = transaction.trx.transaction.actions.find(a => a.name == actionname).data[datakey];
        if(data !==undefined){
          content = data;
          found = true;
        }
        else{
          error = true;
        }
      }
      else{
        startblock++;
        continue;        
      }
    }
    else{
      startblock++;
      continue;
    }
  }
  //return object
  return {
    error: error,
    found:true,
    content: content,
    block_num: startblock
  }

}


export async function getCurrentCodeHash(rpcEndpoints, account) {

  let url = rpcEndpoints[0]+'/v1/chain/get_raw_abi';
  let res = await Vue.prototype.$axios({
    method: 'post',
    url: url,
    data: {
      account_name: account
    }
  })
  console.log('fetched code hash for', account, res.data);
  return {
    code_hash: res.data.code_hash !="0000000000000000000000000000000000000000000000000000000000000000"?res.data.code_hash:false,
    abi_hash: res.data.abi !=""?res.data.abi_hash:false
  }

}





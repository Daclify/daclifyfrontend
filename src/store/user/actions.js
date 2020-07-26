import {getLogoForToken} from "../../imports/tokens.js";
export async function loggedInRoutine ({ dispatch,commit }, payload) {

  dispatch('fetchAccount', payload.accountname);
  dispatch('fetchHubDeposits', payload.accountname);
  let res = await dispatch('group/fetchProfile', payload.accountname,{root:true});
  if(res){
    commit('group/setMyOldProfile', JSON.parse(JSON.stringify(res) ),{root:true} );
  }
  
  //dispatch('fetchIsMember', payload.accountname);

}

export async function loggedOutRoutine ({ dispatch, commit }) {

  commit('setAccount', false);
  commit('setIsMember', false);
  commit('setHubDeposits', false);
}

export async function fetchAccount ({ commit, rootState, rootGetters }, accountname) {
  //let account = rootGetters.getAccountName ||
  if(!accountname) return;
  let res = await this._vm.$eos.api.rpc.get_account(accountname);
    if(res ){
      console.log('Fetched User Account', res);
      commit('setAccount', res);
    }
}

export async function fetchIsMember ({ commit, rootState, rootGetters }, accountname) {
  let res = await this._vm.$eos.api.rpc.get_table_rows({
      json: true,
      code:   rootState.group.activeGroup,
      scope:   rootState.group.activeGroup,
      lower_bound: accountname,
      upper_bound: accountname,
      table: "members",
      limit: 1

    });
    if(res && res.rows.length){
      if(res.rows[0].account == accountname){
        console.log('fetched isMember', res.rows[0]);
        if(rootState.ual.accountName == accountname){
          commit('setIsMember', res.rows[0]);
        }
        return res.rows[0];
      }
    }
}

export async function fetchHubDeposits({ state,rootState, commit, rootGetters }, accountname) {
  let hubcntr = rootGetters["app/getAppConfig"].groups_contract;
  let res = await this._vm.$eos.api.rpc.get_table_rows({
      json: true,
      code: hubcntr,
      scope: accountname,
      table: "deposits",
      limit: 1
    });
    if(res){
      console.log('fetched hub deposits for',accountname, res.rows);

      res = res.rows;
      let balances = [];
      res.forEach(b =>{
        let t = {};
        t.contract = b.balance.contract;
        t.quantity = b.balance.quantity;
        let [amount, symbol] = b.balance.quantity.split(' ');
        t.symbol = symbol;
        t.amount = parseFloat(amount);
        t.precision = amount.split('.')[1] ? amount.split('.')[1].length : 0;
        t.logo = getLogoForToken(t.contract, t.symbol)
        balances.push(t);
      })

      commit('setHubDeposits', balances);
    }
    else{
        console.log('fetching hub deposits failed for:', accountname);
    }
}




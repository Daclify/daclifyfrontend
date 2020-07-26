/*
export function someAction (context) {
}
*/
export async function loadElectionsRoutine({ dispatch, commit, getters, rootGetters }, payload){
    let electionscontract = getters.getElectionsContract;
    if(!electionscontract) return;
    dispatch("fetchElectionsConfig", electionscontract);
    dispatch("fetchElectionsState", electionscontract);
}

export async function fetchElectionsConfig ({ commit, rootState, rootGetters }, electionsContract) {
    let res = await this._vm.$eos.api.rpc.get_table_rows({
      json: true,
      code: electionsContract,
      scope: electionsContract,
      table: "config",
      limit: 1
    });
  
    if(res && res.rows[0]){
      console.log(`fetched elections config from ${electionsContract}`, res.rows[0] );
      commit('setElectionsConfig', res.rows[0]);
      //let clone = JSON.parse(JSON.stringify(res.rows[0]));
      //commit('setNewCoreConfig', clone);
    }
}

export async function fetchElectionsState ({ commit, rootState, rootGetters }, electionsContract) {
    let res = await this._vm.$eos.api.rpc.get_table_rows({
      json: true,
      code: electionsContract,
      scope: electionsContract,
      table: "state",
      limit: 1
    });
  
    if(res && res.rows[0]){
      console.log(`fetched elections state from ${electionsContract}`, res.rows[0] );
      commit('setElectionsState', res.rows[0]);
      //let clone = JSON.parse(JSON.stringify(res.rows[0]));
      //commit('setNewCoreConfig', clone);
    }
}

export async function fetchCandidates ({ commit, rootState, rootGetters }, electionsContract) {
    //fetch by decreasing votes
    let res = await this._vm.$eos.api.rpc.get_table_rows({
      json: true,
      code: electionsContract,
      scope: electionsContract,
      key_type: "i64",
      index_position: 2,
      table: "candidates",
      limit: -1
    });
  
    if(res && res.rows.length){
      console.log(`fetched candidates from ${electionsContract}`, res.rows );
      commit('setCandidates', res.rows);
      //let clone = JSON.parse(JSON.stringify(res.rows[0]));
      //commit('setNewCoreConfig', clone);
    }
}

export async function fetchUserVotes ({ commit, getters, rootGetters }, payload) {
    //fetch by decreasing votes
    let contract = payload.electionsContract || getters.getElectionsContract;
    let res = await this._vm.$eos.api.rpc.get_table_rows({
      json: true,
      code: contract,
      scope: contract,
      upper_bound: payload.voter,
      lower_bound: payload.voter,
      table: "voters",
      limit: 1
    });
    if(res && res.rows[0] && res.rows[0].voter == payload.voter){
      console.log(`fetched votes from ${payload.voter}`, res.rows[0] );
      if(rootGetters["ual/getAccountName"] == payload.voter){
        commit('setUserVotes', res.rows[0]);
      }
      return res.rows[0]
      
      //let clone = JSON.parse(JSON.stringify(res.rows[0]));
      //commit('setNewCoreConfig', clone);
    }
}

export async function fetchUserStakes ({ commit, getters, rootGetters }, payload) {
    //fetch by decreasing votes
    let contract = payload.electionsContract || getters.getElectionsContract;
    let user = payload.user || rootGetters["ual/getAccountName"];
    let res = await this._vm.$eos.api.rpc.get_table_rows({
      json: true,
      code: contract,
      scope: user,
      table: "stake",
      limit: -1
    });
    if(res && res.rows.length){
      let r = res.rows.map(r=>{
          r = r.balance;
          let [amount, symbol] = r.quantity.split(' ');
          let p = amount.split('.')[1];
          r.symbol = symbol;
          r.amount = Number(amount);
          r.precision = p ? p.length : 0;
          return r;
      })
      console.log(`fetched stakes from ${user}`, res.rows );
      if(user == rootGetters["ual/getAccountName"] ){
        commit('setUserStakes', r);
      }
      return r;
      

    }
}

/*
export function someAction (context) {
}
*/
export async function loadHooksRoutine({ dispatch, commit, getters, rootGetters }, payload){
    let hooksContract = getters.gethooksContract;
    if(!hooksContract) return;
    dispatch("fetchHooks", hooksContract);
}

export async function fetchHooks ({ commit, rootState, rootGetters }, hooksContract) {
    let res = await this._vm.$eos.api.rpc.get_table_rows({
      json: true,
      code: hooksContract,
      scope: hooksContract,
      table: "actionhooks",
      limit: -1
    });
  
    if(res && res.rows.length){
      console.log(`fetched hooks from ${hooksContract}`, res.rows );
      commit('setHooks', res.rows);
    }
}


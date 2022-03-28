/*
export function someAction (context) {
}
*/
export async function loadHooksRoutine ({ dispatch, commit, getters, rootGetters }, payload) {
  let hooksContract = getters.gethooksContract;
  if (!hooksContract) return;
  dispatch("fetchHooks", { hooksContract: hooksContract, vm: payload.vm });
}

export async function fetchHooks ({ commit, rootState, rootGetters }, payload) {
  let res = await payload.vm.$eos.api.rpc.get_table_rows({
    json: true,
    code: payload.hooksContract,
    scope: payload.hooksContract,
    table: "actionhooks",
    limit: -1
  });

  if (res && res.rows.length) {
    console.log(`fetched hooks from ${payload.hooksContract}`, res.rows);
    commit('setHooks', res.rows);
  }
}


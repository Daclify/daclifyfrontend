/*
export function someAction (context) {
}
*/
export async function loadPayrollRoutine ({ dispatch, commit, getters, rootGetters }, payload) {
  let payrollcontract = payload.data;
  console.log(payrollcontract);

  if (!payrollcontract) return;
  dispatch('fetchPayments', { payrollcontract: payrollcontract, vm: payload.vm });
  dispatch('fetchPayrolls', { payrollcontract: payrollcontract, vm: payload.vm });

}

export async function fetchPayments ({ commit, rootState, rootGetters }, payload) {
  let res = await payload.vm.$eos.api.rpc.get_table_rows({
    json: true,
    code: payload.payrollcontract,
    scope: payload.payrollcontract,
    table: "payments",
    limit: -1
  });

  if (res && res.rows[0]) {
    console.log(`fetched payments from ${payload.payrollcontract}`, res.rows);
    commit('setPayments', res.rows);
    //let clone = JSON.parse(JSON.stringify(res.rows[0]));
    //commit('setNewCoreConfig', clone);
  }
}

export async function fetchUserPayments ({ commit, rootState, rootGetters }, payload) {
  let res = await payload.vm.$eos.api.rpc.get_table_rows({
    json: true,
    code: payload.contract,
    scope: payload.contract,
    key_type: "name",
    index_position: 2,
    lower_bound: payload.account,
    upper_bound: payload.account,
    table: "payments",
    limit: -1
  });

  if (res && res.rows[0]) {
    console.log(`fetched payments for ${payload.account}`, res.rows);
    return res.rows
    //let clone = JSON.parse(JSON.stringify(res.rows[0]));
    //commit('setNewCoreConfig', clone);
  }
  else {
    return [];
  }
}

export async function fetchPayrolls ({ commit, rootState, rootGetters }, payload) {
  let res = await payload.vm.$eos.api.rpc.get_table_rows({
    json: true,
    code: payload.payrollcontract,
    scope: payload.payrollcontract,
    table: "payrolls",
    limit: -1
  });

  if (res && res.rows[0]) {
    console.log(`fetched payrolls from ${payload.payrollcontract}`, res.rows);
    commit('setPayrolls', res.rows);
    //let clone = JSON.parse(JSON.stringify(res.rows[0]));
    //commit('setNewCoreConfig', clone);
  }
}


/*
export function someAction (context) {
}
*/
export async function loadElectionsRoutine(
  { dispatch, commit, getters, rootGetters },
  { vm }
) {
  let electionscontract = getters.getElectionsContract;
  if (!electionscontract) return;
  dispatch("fetchElectionsConfig", {
    electionscontract: electionscontract,
    vm: vm,
  });
  dispatch("fetchElectionsState", {
    electionscontract: electionscontract,
    vm: vm,
  });
}

export async function fetchElectionsConfig(
  { commit, rootState, rootGetters },
  payload
) {
  // Mock data for UI testing
  const mockElectionsConfig = {
    elections: true,
    num_elected: 3,
    period_length: 604800,
    min_stake_voted: "100.0000 EOS",
    initial_vote_quorum_percent: 15,
    vote_quorum_percent: 10,
    auth_threshold_high: 2,
    auth_threshold_mid: 2,
    auth_threshold_low: 1,
    lockup_release_time_delay: 1209600,
    requested_pay_max: "1000.0000 EOS",
  };

  // console.log(`using mock elections config for ${payload.electionsContract}`);
  commit("setElectionsConfig", mockElectionsConfig);
}

export async function fetchElectionsState(
  { commit, rootState, rootGetters },
  payload
) {
  // Mock data for UI testing
  const mockElectionsState = {
    total_weight_of_votes: 2500,
    total_votes_on_candidates: 2000,
    number_active_candidates: 2,
    met_initial_votes_threshold: true,
    next_election_time: "2024-01-15T00:00:00.000Z",
    finalize_election_time: "2024-01-10T00:00:00.000Z",
  };

  // console.log(`using mock elections state for ${payload.electionsContract}`);
  commit("setElectionsState", mockElectionsState);
}

export async function fetchCandidates(
  { commit, rootState, rootGetters },
  payload
) {
  // Mock data for UI testing
  const mockCandidates = [
    {
      candidate_name: "guardian1",
      requestedpay: "100.0000 EOS",
      total_votes: 1000,
      is_active: true,
    },
    {
      candidate_name: "guardian2",
      requestedpay: "150.0000 EOS",
      total_votes: 1500,
      is_active: true,
    },
  ];

  // console.log(`using mock candidates for ${payload.electionsContract}`);
  commit("setCandidates", mockCandidates);
}

export async function fetchUserVotes(
  { commit, getters, rootGetters },
  payload
) {
  // Mock data for UI testing
  const mockUserVotes = {
    voter: payload.voter,
    proxy: "",
    producers: ["guardian1", "guardian2"],
    staked: 1000,
    last_vote_weight: "1000.00000000000000000",
    proxied_vote_weight: "0.00000000000000000",
    is_proxy: 0,
    flags1: 0,
    reserved2: 0,
    reserved3: "0.00000000000000000",
  };

  console.log(`using mock user votes for ${payload.voter}`);
  if (rootGetters["ual/getAccountName"] == payload.voter) {
    commit("setUserVotes", mockUserVotes);
  }
  return mockUserVotes;
}

export async function fetchUserStakes(
  { commit, getters, rootGetters },
  payload
) {
  //fetch by decreasing votes
  let contract = payload.electionsContract || getters.getElectionsContract;
  let user = payload.user || rootGetters["ual/getAccountName"];
  let res = await payload.vm.$eos.api.rpc.get_table_rows({
    json: true,
    code: contract,
    scope: user,
    table: "stake",
    limit: -1,
  });
  if (res && res.rows.length) {
    let r = res.rows.map((r) => {
      r = r.balance;
      let [amount, symbol] = r.quantity.split(" ");
      let p = amount.split(".")[1];
      r.symbol = symbol;
      r.amount = Number(amount);
      r.precision = p ? p.length : 0;
      return r;
    });
    console.log(`fetched stakes from ${user}`);
    if (user == rootGetters["ual/getAccountName"]) {
      commit("setUserStakes", r);
    }
    return r;
  }
}

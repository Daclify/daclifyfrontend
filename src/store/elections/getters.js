export function getElectionsContract (state) {
    return state.electionsContract;
}

export function getElectionsConfig (state) {
    return state.electionsConfig.conf;
}

export function getElectionsState (state) {
    return state.electionsState;
}

export function getCandidates (state) {
    return state.candidates;
}


export function getIsCandidate (state, getters, rootState, rootGetters) {
    let accountname = rootGetters["ual/getAccountName"];
    if(state.candidates && state.candidates.length && accountname){
        let cand = state.candidates.find(c=>c.cand == accountname && c.state != 0);
        return cand ? cand : false;
    }
    else{
        return false;
    } 
}

export function getUserVotes (state) {
    return state.userVotes;
}
export function getUserStakes (state) {
    return state.userStakes;
}
export function getUserCandidateStake (state, getters, rootState, rootGetters) {
    let conf =getters.getcandidateStakeConfig;
    if(conf && state.userStakes){
        return state.userStakes.find(s=> s.symbol == conf.symbol && s.contract == conf.contract );
    }
    else{
        return null;
    }
    
}
export function getcandidateStakeConfig (state, getters, rootState, rootGetters) {
    let conf = getters.getElectionsConfig;
    if(conf){
        let res = conf.cand_min_stake;
        let [amount, symbol] = res.quantity.split(" ");
        let p = amount.split('.')[1];
        let precision = p ? p.length : 0;
        res.amount = Number(amount);
        res.symbol = symbol;
        res.precision = precision;
        return res;
    }
    else{
        return false;
    }
    
}

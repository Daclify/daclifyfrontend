
export function setElectionsContract (state, payload) {
    state.electionsContract= payload;
}
export function setElectionsConfig (state, payload) {
    state.electionsConfig = payload;
}

export function setElectionsState (state, payload) {
    state.electionsState = payload;
}

export function setCandidates (state, payload) {
    state.candidates = payload;
}

export function removeCandidate (state, payload) {
    let index = state.candidates.findIndex(c => c.cand == payload);
    if(index > -1){
        state.candidates.splice(index, 1);
    }
}

export function updateCandidateTotalVotes (state, payload) {

    let cand = state.candidates.find(c => c.cand == payload.cand);
    cand.total_votes = cand.total_votes+payload.delta
}

export function addCandidate (state, payload) {
    let cand_template = { cand: payload, total_votes: 0, is_active: 1, registered: "Just now" };
    if(state.candidates === false){
        state.candidates = [];
    }
    state.candidates.push(cand_template);

}

export function togglePauseCampaign (state, payload) {
    let cand = state.candidates.find(c => c.cand == payload);
    if(cand){
        cand.is_active = !cand.is_active;
    }
}


export function setUserVotes (state, payload) {
    state.userVotes = payload;
}


export function setUserStakes (state, payload) {
    state.userStakes = payload;
}


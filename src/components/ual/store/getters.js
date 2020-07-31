export function getShouldRenderLoginModal(state) {
    return state.showLoginModal;
}

export function getSigningOverlay(state) {
    return state.signingOverlay;
}

export function getIsTransacting(state) {
    return state.isTransacting;
}

export function getActiveAuthenticator(state) {
    return state.activeAuthenticator;
}

export function getAuthenticators(state) {
    if(state.UAL){
        return state.UAL.getAuthenticators().availableAuthenticators;
        // return state.UAL.authenticators;
    }
    else{
        return [];
    }  
}

export function getSESSION(state) {
    return state.SESSION;
}

export function getUAL(state) {
    return state.UAL;
}

export function getAccountName(state) {
    if(state.SESSION.accountName){
        return state.SESSION.accountName;
    }
    return state.accountName;
}

export function getActiveNetwork(state) {
    return state.SESSION.network || state.activeNetwork;
}

export function getRpcEndpoints(state, getters) {
    let rpcobjs =  state.networks[getters.getActiveNetwork].config.rpcEndpoints;
    return rpcobjs.map(rpcobj =>{
        return rpcobj.protocol+"://"+rpcobj.host;
    })
}



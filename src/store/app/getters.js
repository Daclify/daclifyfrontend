
export function getCLOCK(state){
    return state.CLOCK;
}

export function getGroups(state){
    return state.groups;
}

export function getGroupByName(state){
    return groupname => {
        if(!state.groups) return false;
        let group = state.groups.find(g => groupname == g.groupname);
        if(group){
            return group;
        }
        return false;
    };
}

export function getComponentRegistry(state){
    return state.componentRegistry;
}

export function getRamPricePerByte(state){
    return state.ramPricePerByte;
}

export function getAppConfig(state, getters, rootState, rootGetters){
    return state.config[rootGetters["ual/getActiveNetwork"] ]; 
}

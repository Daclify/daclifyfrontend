
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











export function getAppConfig(state){
    return state.config;
}

export function getAllowedFeeTokens(state){

    if(state.allowedFeeTokens.length){
        return state.allowedFeeTokens;
    }

}

export function getAllowedFeeTokensSym(state, getters){

    if(state.allowedFeeTokens.length){

        let res = state.allowedFeeTokens.map(aft =>{
            let logo = getters.getAppConfig.tokens.find(t => t.symbol == aft.sym && t.account == aft.contract);
            logo = logo ? logo.logo : './statics/images/tokens/default.png';
            aft.logo = logo;
            return aft;
        })

        return res;
    }
    else{
        return []
    }

}

export function getNumberOfCronjobs(state){

    if(state.cronjobsTableScopes.length){
        let mainscope = state.cronjobsTableScopes.find(cs => cs.scope == state.config.cron_contract);

        return mainscope ? mainscope.count/2 : 0;
    }

}

export function getIconForSymbol(state) {
    return symbol => {
        let token_from_config = state.config.tokens.find(t => symbol == t.symbol);
        let token_icon = token_from_config ? token_from_config.logo : './statics/images/tokens/default.png';
        return token_icon;
    };
  }



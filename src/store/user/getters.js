

//account
export function getFavouriteGroups(state) {
  return state.favouriteGroups
}

export function getIsFavouriteGroup(state) {
  return (groupname) =>{
    return state.favouriteGroups.includes(groupname);
  }

}

export function getResourceWarningLevels(state){
  return state.resourceWarningLevels;
}

export function getSelectedBlockExplorer(state, getters, rootState, rootGetters){
  return state.selectedBlockExplorer[rootGetters["ual/getActiveNetwork"] ];
}

export function getMinifyGuardians(state){
  return state.minifyGuardians;
}

export function getIsDark(state, payload){
  return state.isDark;
}

export function getIsMember(state){
  return state.isMember;
}


export function getCurrentFCMToken(state){
  return state.currentFCMToken;
}
export function getTopicSubscriptions(state){
  return state.topicSubscriptions;
}

export function getHubDeposits(state){
  return state.hubDeposits;
}

export function getRequireUsertermsAgreement(state, getters, rootState, rootGetters) {
  let res = false;
  const coreconfig = rootGetters["group/getCoreConfig"];
  const member = getters.getIsMember;
  if(coreconfig && coreconfig.conf.userterms && member){
    const latestterms = rootGetters["group/getLatestUserterms"];
    if(latestterms && latestterms.id){
      res = latestterms.id !== member.agreed_userterms_version;
    }
  }

  return res;

}



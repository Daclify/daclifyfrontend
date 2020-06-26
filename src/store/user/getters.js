

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

export function getSelectedBlockExplorer(state){
  return state.selectedBlockExplorer;
}

export function getMinifyCustodians(state){
  return state.minifyCustodians;
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



function parseMicroSeconds(us, precision = 2) {
    us = Number(us);
    if (us >= 1000000) {
      let sec = (us / 1000000).toFixed(precision);
      return sec + " sec";
    } else if (us >= 1000) {
      let ms = (us / 1000).toFixed(precision);
      return ms + " ms";
    } else {
      let u = us.toFixed(precision);
      return u + " µs";
    }
  }
  
  function parseBytes(b, precision = 2) {
      b = Number(b);
      return `${(b/1024).toFixed(precision)} KB`;
  
    }


import { diff } from 'deep-diff';



export function getActiveGroup(state){
    return state.activeGroup;
}

export function getGuardians(state){
    return state.guardians;
}

export function getNumberGuardians(state){
    return state.guardians.length;
}

export function getIsGuardian(state) {
    return accountname => {
        let guardian = state.guardians.find(c => accountname == c.account);
        return guardian;
    };
}

export function getAvatar(state) {
  return accountname => {
      let avatar = state.avatars.find(c => accountname == c.account);
      if(avatar && avatar.img_url){
        return avatar.img_url;
      }
      else{
        return false;
      }
  };
}

export function getLatestUserterms(state){
  return state.latestUserterms;
}

export function getProposals(state){
    return state.proposals;
}

export function getMyOldProfile(state){
  return state.myOldProfile;
}


export function getThresholds(state){
    return state.thresholds;
}

export function getThresholdByName(state) {
    return thresholdname => {
        let threshold = state.thresholds.find(t => thresholdname == t.threshold_name);
        return threshold;
    };
}


export function getThresholdLinks(state){
    return state.thresholdLinks;
}

export function getLinkedThresholdForContractAction(state, getters){
  return (contract, action_name) => {
    let exact_match = state.thresholdLinks.find(tl => tl.contract == contract && tl.action_name == action_name);
    if(exact_match){
      return getters.getThresholdByName(exact_match.threshold_name);
    }
    else{
      let action_match = state.thresholdLinks.find(tl => tl.contract == "" && tl.action_name == action_name);
      if(action_match){
        return getters.getThresholdByName(action_match.threshold_name);
      }
      else{
        let contract_match = state.thresholdLinks.find(tl => tl.contract == contract && tl.action_name == "");
        if(contract_match){
          return getters.getThresholdByName(contract_match.threshold_name);
        }
        else{
          return getters.getThresholdByName('default');
        }
      }
      
    }
  };
}

export function getGroupWallet(state){
    return state.groupWallet;
}

export function getGroupAccount(state){
    return state.groupAccount;
}

export function getActiveGroupConfig(state){
  return state.activeGroupConfig;
}

export function getCoreConfig(state){
  return state.coreConfig;
}

export function getCoreState(state){
  return state.coreState;
}

export function getNewCoreConfig(state){
  return state.newCoreConfig;
}

export function getCoreConfigDeltas(state, getters){
  let source = getters.getCoreConfig;
  let change = getters.getNewCoreConfig;
  if(source && change){
    let delta =  diff(source, change);
    return delta;
  }
}

export function getModules(state){
  return state.modules;
}

export function getModuleByName(state){
  
  return module_name => {
    if(!state.modules) return undefined;
    let module = state.modules.find(c => module_name == c.module_name);
    return module;
};
}


//account
export function getCPUStats(state) {
    if (state.groupAccount) {
      let cpu = state.groupAccount.cpu_limit;
      let res = JSON.parse(JSON.stringify(cpu));
      res.perc_used = 100 - (cpu.available / cpu.max) * 100;
      res.parsed = {};
      res.parsed.available = parseMicroSeconds(cpu.available);
      res.parsed.used = parseMicroSeconds(cpu.used);
      res.parsed.max = parseMicroSeconds(cpu.max);
      res.self_delegated_cpu = state.groupAccount.self_delegated_bandwidth !== null ? state.groupAccount.self_delegated_bandwidth.cpu_weight: 0;
      res.total_delegated_cpu = state.groupAccount.total_resources.cpu_weight;
      return res;
    }
  }
  
  export function getNETStats(state) {
    if (state.groupAccount) {
      let net = state.groupAccount.net_limit;
      let res = JSON.parse(JSON.stringify(net));
      res.perc_used = 100 - (net.available / net.max) * 100;
      res.parsed = {};
      res.parsed.available = parseBytes(net.available);
      res.parsed.used = parseBytes(net.used);
      res.parsed.max = parseBytes(net.max);
      res.self_delegated_net = state.groupAccount.self_delegated_bandwidth !== null ? state.groupAccount.self_delegated_bandwidth.net_weight: 0;
      res.total_delegated_net = state.groupAccount.total_resources.net_weight;
      return res;
    }
  }

  export function getRAMStats(state) {
    if (state.groupAccount) {
      let quota = state.groupAccount.ram_quota;
      let usage = state.groupAccount.ram_usage;
      let res = {};
      res.perc_used = (usage / quota) * 100;
      res.available_bytes = quota-usage;
      res.available = parseBytes(quota-usage);
      res.used = parseBytes(usage);
      res.max = parseBytes(quota);

      return res;
    }
  }

  export function getResourcesLowWarning(state, getters, rootState, rootGetters) {
    
    const ram = getters.getRAMStats;
    const net = getters.getNETStats;
    const cpu = getters.getCPUStats;
    const levels = rootGetters["user/getResourceWarningLevels"];

    let warnings = [];
    if( ram && net && cpu ){

      if(ram.perc_used >= levels.ram){
        warnings.push({type: 'RAM', perc_used : ram.perc_used} );
      }
      if(net.perc_used >= levels.net){
        warnings.push({type: 'NET', perc_used : net.perc_used} );
      }
      if(cpu.perc_used >= levels.cpu){
        warnings.push({type: 'CPU', perc_used : cpu.perc_used} );
      }
    }
    return warnings;
  }
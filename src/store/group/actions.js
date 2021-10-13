
import {getLogoForToken} from "../../imports/tokens.js";
import {notifyError, notifySuccess} from '../../imports/notifications.js';
import { colors } from 'quasar';
import profile_template from "../../statics/profile_template.json";


// destructuring to keep only what is needed
const { setBrand } = colors;

// import {
//   Loading
// } from 'quasar'


export async function resetStore ({  commit }, payload) {
  commit('setCoreConfig', false);
  commit('setGuardians', []);
  commit('setMyOldProfile', false);
  //commit('setChildAccounts', false);
  commit('setModules', false);
  commit('setAvatars', []);
  commit('elections/setElectionsContract', false, {root: true});
  commit('elections/setCandidates', false, {root: true});
  commit('elections/setElectionsState', false, {root: true});
  commit('elections/setElectionsConfig', false, {root: true});
  commit('setActiveGroupConfig', false);
  commit('setActiveGroup', "");//todo catch the error generating loading group with empty name
  commit('setLatestUserterms', false);
  commit('setProfileCache', []);
  commit('bucket/setActionBucket', [], {root: true});
}

export async function loadGroupRoutine ({ dispatch, commit, rootGetters }, payload) {
    // Loading.show({
    //   spinnerColor: 'white',
    //   messageColor: 'white',
    //   customClass: 'bg-black',
    //   message: 'Updated message'
    // })
    const groupname = payload.groupname;
    let groupconfig = await dispatch("fetchGroupConfig", groupname);
    if(!groupconfig){
      console.log(`group ${groupname} doesn't exist.`)
      this.$router.push({path: '/create'});
      return;
    }
    const c = groupconfig.ui.hexcolor[0]=='#' ? groupconfig.ui.hexcolor : `#${groupconfig.ui.hexcolor}`;
    setBrand('primary', c);
    commit('setActiveGroupConfig', groupconfig);
    commit('setActiveGroup', groupname);
    dispatch('fetchAvatars', groupname);
    dispatch('fetchCoreConfig', groupname);
    dispatch('fetchAccount', groupname);
    dispatch('fetchGuardians', groupname);

    //dispatch('fetchChildAccounts', groupname);
    dispatch('fetchModules', groupname);

    dispatch('fetchProposals', {groupname: groupname, scope: groupname});
    dispatch('fetchProposals', {groupname: groupname, scope: "cancelled"});
    dispatch('fetchProposals', {groupname: groupname, scope: "executed"});

    dispatch('fetchThresholds', groupname);
    dispatch('fetchThresholdLinks', groupname);
    dispatch('fetchTokensOwnedByScope', {groupname: groupname, scope: groupname});
    dispatch('fetchCoreState', groupname);
}

export async function fetchCoreConfig ({ dispatch, commit }, groupname) {
  let res = await this._vm.$eos.api.rpc.get_table_rows({
    json: true,
    code: groupname,
    scope: groupname,
    table: "coreconf",
    limit: 1
  });

  if(res && res.rows[0]){
    console.log(`fetched CoreConfig ${groupname}`, res.rows[0] );
    commit('setCoreConfig', res.rows[0]);
    let clone = JSON.parse(JSON.stringify(res.rows[0]));
    commit('setNewCoreConfig', clone);
    if(res.rows[0].conf.userterms){
      dispatch("fetchLatestUserterms", groupname);
    }
    
  }
}

export async function fetchCoreState ({ commit, rootState, rootGetters }, groupname) {
  let res = await this._vm.$eos.api.rpc.get_table_rows({
    json: true,
    code: groupname,
    scope: groupname,
    table: "corestate",
    limit: 1
  });

  if(res && res.rows[0]){
    console.log(`fetched CoreState ${groupname}`, res.rows[0] );
    commit('setCoreState', res.rows[0]);
  }

}

export async function fetchGroupConfig ({ commit, rootState, rootGetters }, groupname) {
  let hubcntr = rootGetters["app/getAppConfig"].groups_contract;
  let res = await this._vm.$eos.api.rpc.get_table_rows({
    json: true,
    code: hubcntr,
    scope: hubcntr,
    lower_bound: groupname,
    upper_bound: groupname,
    table: "groups",
    limit: -1
  });
  if(res && res.rows[0] && res.rows[0].groupname == groupname){
    return res.rows[0];
  }
  else{
    console.log(`fetching group config ${groupname} failed`);
    return false;
  }
}

export async function fetchModules ({ commit, rootState, rootGetters }, groupname) {
  let res = await this._vm.$eos.api.rpc.get_table_rows({
    json: true,
    code: groupname,
    scope: groupname,
    table: "modules",
    limit: -1
  });
  if(res && res.rows.length){
    commit('setModules', res.rows);
    console.log(`fetched modules for group ${groupname}`, res.rows);
    //REGISTER MODULES IN STORES
    let elections = res.rows.find(m => m.module_name == 'elections');
    if(elections){
      commit('elections/setElectionsContract', elections.slave_permission.actor, {root: true});
    }
    let hooks = res.rows.find(m => m.module_name == 'hooks');
    if(hooks){
      commit('hooks/setHooksContract', hooks.slave_permission.actor, {root: true});
    }




    return res.rows;
  }
  else{
    console.log(`fetching modules for group ${groupname} failed`);
    return false;
  }
}


export async function fetchAccount ({ commit, rootState, rootGetters }, groupname) {
  //let account = rootGetters.getAccountName ||
  if(!groupname) return;
  let res = await this._vm.$eos.api.rpc.get_account(groupname);
    if(res ){
      console.log(res)
      commit('setGroupAccount', res);
    }
}

export async function fetchGuardians ({ state, commit }, groupname) {
    let res = await this._vm.$eos.api.rpc.get_table_rows({
        json: true,
        code: groupname,
        scope: groupname,
        table: "custodians",
        limit: -1
      });
      if(res && res.rows){
        console.log(`fetched guardians for group ${groupname}`, res.rows);
        commit('setGuardians', res.rows);
      }
      else{
        console.log(`fetching guardians for group ${groupname} failed`);
      }
}

export async function fetchProposals ({ state, commit }, payload ) {
  let res = await this._vm.$eos.api.rpc.get_table_rows({
      json: true,
      code: payload.groupname,
      scope: payload.scope || payload.groupname,
      table: "proposals",
      reverse: true,
      limit: -1
    });
    if(res && res.rows){
      console.log(`fetched proposals for group ${payload.groupname}`, res.rows);
      res = res.rows;
      commit('setProposals', {scope: payload.scope, data:res});
    }
    else{
      console.log(`fetching proposals for group ${payload.groupname} failed`);
    }
}

export async function fetchThresholds ({ state, commit }, groupname) {

  let res = await this._vm.$eos.api.rpc.get_table_rows({
      json: true,
      code: groupname,
      scope: groupname,
      table: "thresholds",
      limit: -1
    });
    if(res && res.rows){
      console.log(`fetched thresholds for group ${groupname}`, res.rows);
      res = res.rows;
      commit('setThresholds', res);
    }
    else{
      console.log(`fetching thresholds for group ${groupname} failed`);
    }
}

export async function fetchThresholdLinks ({ state, commit }, groupname) {

  let res = await this._vm.$eos.api.rpc.get_table_rows({
      json: true,
      code: groupname,
      scope: groupname,
      table: "threshlinks",
      limit: -1
    });

    if(res && res.rows){
      console.log(`fetched thresholdlinks for ${groupname}`, res.rows);
      commit('setThresholdLinks', res.rows);
    }
    else{
      console.log(`fetched thresholdlinks for ${groupname} failed`);
    }
}

export async function fetchThresholdLinksForScope ({ state, commit }, payload) {
  let groupname = payload.groupname;
  let scope = payload.scope;
  let res = await this._vm.$eos.api.rpc.get_table_rows({
      json: true,
      code: groupname,
      scope: scope,
      table: "actionslinks",
      limit: -1
    });
    if(res && res.rows){
      console.log(`fetched actionslinks for ${scope} for group ${groupname}`, res.rows);
      res = res.rows;
      // commit('setThresholds', res);
    }
    else{
      console.log(`fetching actionlinks for ${scope} for group ${groupname} failed`);
    }
}


export async function fetchTokensOwnedByScope ({ state, commit }, payload) {

  let groupname = payload.groupname;
  let scope = payload.scope;

  let res = await this._vm.$eos.api.rpc.get_table_rows({
    json: true,
    code: groupname,
    scope: scope,
    table: "balances",
    limit: -1
    });

    if(res && res.rows){
      console.log(`fetched tokens owned by ${scope} for group ${groupname}`, res.rows);
      //for each token get the icon
      res.rows = res.rows.map(t =>{
        let[amount, symbol] = t.balance.quantity.split(" ");
        t = t.balance;
        t.amount = amount;
        t.symbol = symbol;
        t.precision = amount.includes('.') ? amount.split('.')[1].length : 0;
        t.logo = getLogoForToken(t.contract, t.symbol);
        t.loading = false;
        return t;
      })
      if(scope == groupname){
        commit('setGroupWallet', res.rows);
      }
      else{
        return res.rows
      }
      
    }
    else{
      console.log(`fetched tokens owned by ${scope} for group ${groupname} faild`);
    }
}

export async function fetchAvatars ({ state, commit }, groupname) {
  let res = await this._vm.$eos.api.rpc.get_table_rows({
      json: true,
      code: groupname,
      scope: groupname,
      table: "avatars",
      limit: -1
    });
    if(res && res.rows){
      console.log(`fetched avatars for group ${groupname}`, res.rows);
      commit('setAvatars', res.rows);
    }
    else{
      console.log(`fetching avatars for group ${groupname} failed`);
    }
}

export async function fetchLatestUserterms ({ state, commit }, groupname) {
  let res = await this._vm.$eos.api.rpc.get_table_rows({
      json: true,
      code: groupname,
      scope: "userterms",
      table: "dacfiles",
      limit: 1,
      reverse: true
    });
    if(res && res.rows && res.rows.length){
      console.log(`fetched latest userterms for group ${groupname}`, res.rows);
      let userterms = res.rows[0];
      userterms.data = false;

      commit('setLatestUserterms', userterms);
    }
    else{
      console.log(`fetching latest userterms for group ${groupname} failed`);
    }
}

export async function fetchProfile ({ state, commit, rootState, rootGetters }, accountname) {
  if(!rootState.group.activeGroup){
    return;
  }
  let template = JSON.stringify(profile_template);
  let cached_p = state.profiles.find(p=> p.account == accountname);
  if(cached_p){
    console.log("serve profile from cache"); 
    return cached_p;
  }


  let res = await this._vm.$eos.api.rpc.get_table_rows({
      json: true,
      code:   rootState.group.activeGroup,
      scope:   rootState.group.activeGroup,
      lower_bound: accountname,
      upper_bound: accountname,
      table: "profiledata",
      limit: 1
    });

  res= res.rows[0];
  let data = {
    account: accountname,
  };
  if(!res || res.account != accountname){
    data.last_update =  "";
    let res = Object.assign(JSON.parse(template), data);
    if(rootState.ual.SESSION.accountName == accountname){
      commit('setMyOldProfile', JSON.parse(JSON.stringify(res ) ) );
    }
    
    return res ;
  }
  data.last_update =  res.last_update;
  try {
      res.data.forEach(entry =>{
        if(entry.key != "text"){
          entry.value = entry.value.replace(/[\t\n\r]/gm,'');
          console.log(entry.value)
          data[entry.key] = JSON.parse(entry.value);
        }
        else{
          data[entry.key] = entry.value;
        }  
      })
  } catch(e) {
    notifyError({message : `This profile contains invalid data.` });
    console.log(e);
   }
  console.log(`fetched profile for ${accountname}`, data); 
  data = Object.assign(JSON.parse(template), data);
  commit('addProfile', data);

  if(rootState.ual.SESSION.accountName == accountname){
    commit('setMyOldProfile', JSON.parse(JSON.stringify(data) ) );
  }

  return data;
      

       
}


export async function propose({ state, rootState, dispatch, commit }, payload) {
  // return_action: false
  // description:"",
  // title:"",
  // expiration:",
  // actions: []

  let active_period = (60*60*24*7*2)*1000;
  let default_expiration = new Date(Date.now()+active_period).toISOString().split('.')[0]; //"2019-12-03T00:28:24.215Z"

  let propose_action = {
    account: state.activeGroup,
    name: "propose",
    data:{
      proposer: rootState.ual.accountName,
      title: payload.title,
      description: payload.description,
      actions:[],
      expiration: payload.expiration || default_expiration
    }
  };

  for(let i = 0; i < payload.actions.length; ++i){
    let action = payload.actions[i];
    if(!action.authorization){
      action.authorization = [{actor: state.activeGroup, permission: "owner"}];
    }
    if(action.hex != undefined){
      action.data = action.hex;
      delete action.hex;
    }
    if(typeof action.data == 'object'){
      const contract = await this._vm.$eos.api.getContract(action.account);
      action = this._vm.$eos.Serialize.serializeAction(contract, action.account, action.name, action.authorization, action.data);
    }
    propose_action.data.actions.push(action);
  }

  if(payload.return_action === true){
    return propose_action;
  }

  const propose_payload = {
    disable_signing_overlay: true,
    actions: [propose_action]
  }

  let res = await dispatch('ual/transact', propose_payload, {root:true});
  
  if(res && res.trxid){

    let block_time = res.block_time.split('.')[0];
    commit('setGuardianLastActive', {guardian: rootState.ual.accountName, block_time: block_time});
    /*
    try{
      let url = rootState.app.config.api.url+'/push_msg';
      let data = {
        action: propose,
        group: state.activeGroup,
        proposer: rootState.ual.accountName,
        img: state.activeGroupConfig.ui.logo
      }
      this._vm.$axios.post(url, data);
    }
    catch(e){
      console.log('error occured');
    }


    */

    if(propose_payload.actions[0].account==state.activeGroup){
      let action_name = propose_payload.actions[0].name;
      switch (action_name) {
        case 'propose':
          setTimeout(()=>{
            dispatch('fetchProposals', {groupname: state.activeGroup, scope: state.activeGroup} );
          },1000);
          break;

        default:
          break;
      }   
    }

  } 
  return res;

}



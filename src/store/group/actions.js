import { getLogoForToken } from "../../imports/tokens.js";
import { notifyError, notifySuccess } from "../../imports/notifications.js";
// import { colors } from 'quasar';
import profile_template from "../../statics/profile_template.json";
import { setCssVar } from "quasar";

// destructuring to keep only what is needed
// const { setBrand } = colors;

// import {
//   Loading
// } from 'quasar'

export async function resetStore({ commit }, payload) {
  commit("setCoreConfig", false);
  commit("setGuardians", []);
  commit("setMyOldProfile", false);
  //commit('setChildAccounts', false);
  commit("setModules", false);
  commit("setAvatars", []);
  commit("elections/setElectionsContract", false, { root: true });
  commit("elections/setCandidates", false, { root: true });
  commit("elections/setElectionsState", false, { root: true });
  commit("elections/setElectionsConfig", false, { root: true });
  commit("setActiveGroupConfig", false);
  commit("setActiveGroup", ""); //todo catch the error generating loading group with empty name
  commit("setLatestUserterms", false);
  commit("setProfileCache", []);
  commit("bucket/setActionBucket", [], { root: true });
}

export async function loadGroupRoutine(
  { dispatch, commit, rootGetters },
  payload
) {
  // Loading.show({
  //   spinnerColor: 'white',
  //   messageColor: 'white',
  //   customClass: 'bg-black',
  //   message: 'Updated message'
  // })
  const groupname = payload.groupname;
  let groupconfig = await dispatch("fetchGroupConfig", {
    groupname: groupname,
    vm: payload.vm,
  });
  if (!groupconfig) {
    console.log(`group ${groupname} doesn't exist.`);
    this.$router.push({ path: "/create" });
    return;
  }
  const c =
    groupconfig.ui.hexcolor[0] == "#"
      ? groupconfig.ui.hexcolor
      : `#${groupconfig.ui.hexcolor}`;
  setCssVar("primary", c);
  commit("setActiveGroupConfig", groupconfig);
  commit("setActiveGroup", groupname);
  dispatch("fetchAvatars", { groupname: groupname, vm: payload.vm });
  dispatch("fetchCoreConfig", { groupname: groupname, vm: payload.vm });
  dispatch("fetchAccount", { groupname: groupname, vm: payload.vm });
  dispatch("fetchGuardians", { groupname: groupname, vm: payload.vm });

  //dispatch('fetchChildAccounts', groupname);
  dispatch("fetchModules", { groupname: groupname, vm: payload.vm });

  dispatch("fetchProposals", {
    groupname: groupname,
    scope: groupname,
    vm: payload.vm,
  });
  dispatch("fetchProposals", {
    groupname: groupname,
    scope: "cancelled",
    vm: payload.vm,
  });
  dispatch("fetchProposals", {
    groupname: groupname,
    scope: "executed",
    vm: payload.vm,
  });

  dispatch("fetchThresholds", { groupname: groupname, vm: payload.vm });
  dispatch("fetchThresholdLinks", { groupname: groupname, vm: payload.vm });
  dispatch("fetchTokensOwnedByScope", {
    groupname: groupname,
    scope: groupname,
    vm: payload.vm,
  });
  dispatch("fetchCoreState", { groupname: groupname, vm: payload.vm });
}

export async function fetchCoreConfig({ dispatch, commit }, payload) {
  // Mock data for UI testing
  const mockCoreConfig = {
    conf: {
      userterms: "Sample user terms",
      description: "Sample DAC description",
      website: "https://example.com",
      member_registration: true,
      maintainer_account: {
        actor: payload.groupname,
        permission: "owner",
      },
    },
    ui: {
      hexcolor: "#1976D2",
    },
  };

  // console.log(`using mock CoreConfig for ${payload.groupname}`);
  commit("setCoreConfig", mockCoreConfig);
  let clone = JSON.parse(JSON.stringify(mockCoreConfig));
  commit("setNewCoreConfig", clone);
}

export async function fetchCoreState(
  { commit, rootState, rootGetters },
  payload
) {
  // Mock data for UI testing
  const mockCoreState = {
    total_weight_of_votes: 2500,
    total_votes_on_candidates: 2000,
    number_active_candidates: 2,
    met_initial_votes_threshold: true,
    next_election_time: "2024-01-15T00:00:00.000Z",
    finalize_election_time: "2024-01-10T00:00:00.000Z",
    state: {
      member_count: 25,
    },
  };

  // console.log(`using mock CoreState for ${payload.groupname}`);
  commit("setCoreState", mockCoreState);
}

export async function fetchGroupConfig(
  { commit, rootState, rootGetters },
  payload
) {
  // Mock data for UI testing
  const mockGroupConfig = {
    groupname: payload.groupname,
    title:
      payload.groupname === "example-dac" ? "Example DAC" : "Test Community",
    description:
      payload.groupname === "example-dac"
        ? "A sample decentralized autonomous community for testing the UI"
        : "Another sample community for testing the UI interface",
    state: 1,
    meta: {
      about:
        payload.groupname === "example-dac"
          ? "A sample decentralized autonomous community for testing the UI"
          : "Another sample community for testing the UI interface",
      website: "https://example.com",
      logo: "",
      background: "",
    },
    tags:
      payload.groupname === "example-dac"
        ? ["dac", "example", "test"]
        : ["community", "test", "sample"],
    ui: {
      hexcolor: payload.groupname === "example-dac" ? "#1976D2" : "#FF5722",
    },
  };

  // console.log(`using mock group config for ${payload.groupname}`);
  return mockGroupConfig;
}

export async function fetchModules(
  { commit, rootState, rootGetters },
  payload
) {
  // Mock data for UI testing
  const mockModules = [
    {
      module_name: "core",
      slave_permission: { actor: payload.groupname, permission: "owner" },
    },
    {
      module_name: "elections",
      slave_permission: { actor: payload.groupname, permission: "owner" },
    },
    {
      module_name: "payroll",
      slave_permission: { actor: payload.groupname, permission: "owner" },
    },
  ];

  // console.log(`using mock modules for group ${payload.groupname}`);
  commit("setModules", mockModules);

  // Register modules in stores
  let elections = mockModules.find((m) => m.module_name == "elections");
  if (elections) {
    commit("elections/setElectionsContract", elections.slave_permission.actor, {
      root: true,
    });
  }

  let hooks = mockModules.find((m) => m.module_name == "hooks");
  if (hooks) {
    commit("hooks/setHooksContract", hooks.slave_permission.actor, {
      root: true,
    });
  }

  return mockModules;
}

export async function fetchAccount(
  { commit, rootState, rootGetters },
  payload
) {
  if (!payload.groupname) return;

  // Mock data for UI testing
  const mockAccount = {
    account_name: payload.groupname,
    head_block_num: 12345678,
    head_block_time: "2024-01-12T10:30:00.000Z",
    privileged: false,
    last_code_update: "1970-01-01T00:00:00.000Z",
    created: "2023-01-01T00:00:00.000Z",
    core_liquid: "1000.0000 EOS",
    ram_quota: 8192,
    ram_usage: 4096,
    net_weight: 1000,
    cpu_weight: 1000,
    net_limit: { used: 0, available: 1000000, max: 1000000 },
    cpu_limit: { used: 0, available: 1000000, max: 1000000 },
    ram_limit: { used: 4096, available: 4096, max: 8192 },
    total_resources: {
      net_weight: "1000.0000 EOS",
      cpu_weight: "1000.0000 EOS",
      ram_bytes: 8192,
    },
    self_delegated_bandwidth: {
      net_weight: "500.0000 EOS",
      cpu_weight: "500.0000 EOS",
    },
    permissions: [
      {
        perm_name: "owner",
        parent: "",
        required_auth: { keys: [], accounts: [], waits: [] },
      },
      {
        perm_name: "active",
        parent: "owner",
        required_auth: { keys: [], accounts: [], waits: [] },
      },
    ],
  };

  // console.log(`using mock account for ${payload.groupname}`);
  commit("setGroupAccount", mockAccount);
}

export async function fetchGuardians({ state, commit }, payload) {
  // Mock data for UI testing
  const mockGuardians = [
    {
      account: "guardian1",
      custodian: "guardian1",
      requestedpay: "100.0000 EOS",
      total_vote_power: 1000,
      last_active: "2024-01-15T10:30:00.000Z",
      joined: "2024-01-01T00:00:00.000Z",
      weight: 1000,
      authority: "owner",
    },
    {
      account: "guardian2",
      custodian: "guardian2",
      requestedpay: "150.0000 EOS",
      total_vote_power: 1500,
      last_active: "2024-01-14T15:45:00.000Z",
      joined: "2024-01-02T00:00:00.000Z",
      weight: 1500,
      authority: "owner",
    },
  ];

  // console.log(`using mock guardians for group ${payload.groupname}`);
  commit("setGuardians", mockGuardians);
}

export async function fetchProposals({ state, commit }, payload) {
  // Mock data for UI testing
  const mockProposals = [
    {
      proposal_id: 1,
      proposer: "guardian1",
      title: "Update Group Configuration",
      description: "Proposal to update the group's configuration settings",
      status: "active",
      created: "2024-01-10T00:00:00.000Z",
      expires: "2024-01-17T00:00:00.000Z",
      submitted: "2024-01-10T00:00:00.000Z",
      expiration: "2024-01-17T00:00:00.000Z",
      votes: 3,
      required_votes: 2,
      required_threshold: "Guardian Approval",
      approvals: ["guardian1", "guardian2"],
      actions: [
        {
          name: "updateconfig",
          account: "example-dac",
          data: {
            description: "Updated group configuration",
          },
        },
      ],
    },
    {
      proposal_id: 2,
      proposer: "guardian2",
      title: "Add New Guardian",
      description: "Proposal to add a new guardian to the group",
      status: "executed",
      created: "2024-01-05T00:00:00.000Z",
      expires: "2024-01-12T00:00:00.000Z",
      submitted: "2024-01-05T00:00:00.000Z",
      expiration: "2024-01-12T00:00:00.000Z",
      votes: 4,
      required_votes: 2,
      required_threshold: "Guardian Approval",
      approvals: ["guardian1", "guardian2", "guardian3"],
      actions: [
        {
          name: "addguardian",
          account: "example-dac",
          data: {
            guardian: "newguardian",
          },
        },
      ],
    },
  ];

  // console.log(`using mock proposals for group ${payload.groupname}`);
  commit("setProposals", { scope: payload.scope, data: mockProposals });
}

export async function fetchThresholds({ state, commit }, payload) {
  // Mock data for UI testing
  const mockThresholds = [
    {
      threshold_id: 1,
      name: "Guardian Approval",
      description: "Threshold for guardian approval actions",
      threshold: 2,
      weight: 1000,
    },
    {
      threshold_id: 2,
      name: "Emergency Action",
      description: "Threshold for emergency actions",
      threshold: 1,
      weight: 500,
    },
  ];

  // console.log(`using mock thresholds for group ${payload.groupname}`);
  commit("setThresholds", mockThresholds);
}

export async function fetchThresholdLinks({ state, commit }, payload) {
  // Mock data for UI testing
  const mockThresholdLinks = [
    {
      threshold_id: 1,
      action_name: "updateconfig",
      contract: payload.groupname,
    },
    {
      threshold_id: 2,
      action_name: "emergency",
      contract: payload.groupname,
    },
  ];

  // console.log(`using mock threshold links for ${payload.groupname}`);
  commit("setThresholdLinks", mockThresholdLinks);
}

export async function fetchThresholdLinksForScope({ state, commit }, payload) {
  let groupname = payload.groupname;
  let scope = payload.scope;
  let res = await payload.vm.$eos.api.rpc.get_table_rows({
    json: true,
    code: groupname,
    scope: scope,
    table: "actionslinks",
    limit: -1,
  });
  if (res && res.rows) {
    // console.log(`fetched actionslinks for ${scope} for group ${groupname}`);
    res = res.rows;
    // commit('setThresholds', res);
  } else {
    console.log(
      `fetching actionlinks for ${scope} for group ${groupname} failed`
    );
  }
}

export async function fetchTokensOwnedByScope({ state, commit }, payload) {
  let groupname = payload.groupname;
  let scope = payload.scope;

  // Mock data for UI testing
  const mockBalances = [
    {
      contract: "eosio.token",
      symbol: "EOS",
      amount: "1000.0000",
      precision: 4,
      logo: "https://example.com/eos-logo.png",
      loading: false,
    },
    {
      contract: "eosio.token",
      symbol: "USDT",
      amount: "500.0000",
      precision: 4,
      logo: "https://example.com/usdt-logo.png",
      loading: false,
    },
  ];

  // console.log(`using mock tokens for ${scope} in group ${groupname}`);

  if (scope == groupname) {
    commit("setGroupWallet", mockBalances);
  } else {
    return mockBalances;
  }
}

export async function fetchAvatars({ state, commit }, payload) {
  // Mock data for UI testing
  const mockAvatars = [
    {
      account: "guardian1",
      avatar: "https://example.com/avatar1.jpg",
    },
    {
      account: "guardian2",
      avatar: "https://example.com/avatar2.jpg",
    },
  ];

  // console.log(`using mock avatars for group ${payload.groupname}`);
  commit("setAvatars", mockAvatars);
}

export async function fetchLatestUserterms({ state, commit }, payload) {
  let res = await payload.vm.$eos.api.rpc.get_table_rows({
    json: true,
    code: payload.groupname,
    scope: "userterms",
    table: "dacfiles",
    limit: 1,
    reverse: true,
  });
  if (res && res.rows && res.rows.length) {
    console.log(`fetched latest userterms for group ${payload.groupname}`);
    let userterms = res.rows[0];
    userterms.data = false;

    commit("setLatestUserterms", userterms);
  } else {
    console.log(
      `fetching latest userterms for group ${payload.groupname} failed`
    );
  }
}

export async function fetchProfile(
  { state, commit, rootState, rootGetters },
  payload
) {
  if (!rootState.group.activeGroup) {
    return;
  }

  // Check cache first
  let cached_p = state.profiles.find((p) => p.account == payload.accountname);
  if (cached_p) {
    console.log("serve profile from cache");
    return cached_p;
  }

  // Mock profile data for UI testing
  const mockProfileData = {
    account: payload.accountname,
    last_update: "2024-01-15T00:00:00.000Z",
    text: `This is a sample profile for ${payload.accountname}. They are an active member of the community.`,
    links: [
      {
        type: "website",
        url: "https://example.com",
        label: "Personal Website",
      },
      {
        type: "twitter",
        url: "https://twitter.com/example",
        label: "Twitter",
      },
      {
        type: "github",
        url: "https://github.com/example",
        label: "GitHub",
      },
    ],
    gallery: [
      {
        type: "image",
        url: "https://via.placeholder.com/300x200",
        caption: "Sample Image 1",
      },
      {
        type: "image",
        url: "https://via.placeholder.com/300x200",
        caption: "Sample Image 2",
      },
    ],
    files: [
      {
        type: "document",
        url: "https://example.com/sample.pdf",
        name: "Sample Document",
        description: "A sample document for testing",
      },
    ],
  };

  console.log(`using mock profile for ${payload.accountname}`);
  commit("addProfile", mockProfileData);

  if (
    rootState.ual.SESSION &&
    rootState.ual.SESSION.accountName == payload.accountname
  ) {
    commit("setMyOldProfile", JSON.parse(JSON.stringify(mockProfileData)));
  }

  return mockProfileData;
}

export async function propose({ state, rootState, dispatch, commit }, payload) {
  // return_action: false
  // description:"",
  // title:"",
  // expiration:",
  // actions: []

  let active_period = 60 * 60 * 24 * 7 * 2 * 1000;
  let default_expiration = new Date(Date.now() + active_period)
    .toISOString()
    .split(".")[0]; //"2019-12-03T00:28:24.215Z"

  let propose_action = {
    account: state.activeGroup,
    name: "propose",
    data: {
      proposer: rootState.ual.accountName,
      title: payload.data.title,
      description: payload.data.description,
      actions: [],
      expiration: payload.data.expiration || default_expiration,
    },
  };

  for (let i = 0; i < payload.data.actions.length; ++i) {
    let action = payload.data.actions[i];
    if (!action.authorization) {
      action.authorization = [
        { actor: state.activeGroup, permission: "owner" },
      ];
    }
    if (action.hex != undefined) {
      action.data = action.hex;
      delete action.hex;
    }
    if (typeof action.data == "object") {
      const contract = await payload.vm.$eos.api.getContract(action.account);
      action = payload.vm.$eos.Serialize.serializeAction(
        contract,
        action.account,
        action.name,
        action.authorization,
        action.data
      );
    }
    propose_action.data.actions.push(action);
  }

  if (payload.data.return_action === true) {
    return propose_action;
  }

  const propose_payload = {
    disable_signing_overlay: true,
    actions: [propose_action],
  };

  let res = await dispatch("ual/transact", propose_payload, { root: true });

  if (res && res.trxid) {
    let block_time = res.block_time.split(".")[0];
    commit("setGuardianLastActive", {
      guardian: rootState.ual.accountName,
      block_time: block_time,
    });
    /*
    try{
      let url = rootState.app.config.api.url+'/push_msg';
      let data = {
        action: propose,
        group: state.activeGroup,
        proposer: rootState.ual.accountName,
        img: state.activeGroupConfig.ui.logo
      }
      payload.vm.$axios.post(url, data);
    }
    catch(e){
      console.log('error occured');
    }


    */

    if (propose_payload.actions[0].account == state.activeGroup) {
      let action_name = propose_payload.actions[0].name;
      switch (action_name) {
        case "propose":
          setTimeout(() => {
            dispatch("fetchProposals", {
              groupname: state.activeGroup,
              scope: state.activeGroup,
              vm: payload.vm,
            });
          }, 1000);
          break;

        default:
          break;
      }
    }
  }
  return res;
}

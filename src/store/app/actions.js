// import {colors} from "quasar";
// const {getBrand} = colors;
import { getCssVar } from "quasar";

let CLOCK_TIMER = null;

export async function initRoutine({ dispatch }, { vm }) {
  dispatch("fetchComponentRegistry", vm);
  dispatch("fetchModuleRegistry", vm);
}

export async function fetchGroups(
  { state, commit, getters, rootGetters },
  { vm }
) {
  // Mock data for UI testing
  const mockGroups = [
    {
      groupname: "example-dac",
      title: "Example DAC",
      description: "A sample decentralized autonomous community",
      state: 1, // Active state
      meta: {
        about: "A sample decentralized autonomous community for testing the UI",
      },
      tags: ["dac", "example", "test"],
      ui: {
        hexcolor: "#1976D2",
      },
      is_fav: false,
    },
    {
      groupname: "test-community",
      title: "Test Community",
      description: "Another sample community for testing",
      state: 1, // Active state
      meta: {
        about: "Another sample community for testing the UI interface",
      },
      tags: ["community", "test", "sample"],
      ui: {
        hexcolor: "#FF5722",
      },
      is_fav: true,
    },
  ];

  // console.log("using mock groups");
  commit("setGroups", mockGroups);
}

export function startClock({ commit }) {
  if (!CLOCK_TIMER) {
    console.log("clock started");
    commit("setCLOCK", Date.now());
    this.CLOCK_TIMER = setInterval(() => {
      commit("setCLOCK", Date.now());
    }, 1000);
  }
}

export function stopClock() {
  console.log("clock stopped");
  clearInterval(CLOCK_TIMER);
  CLOCK_TIMER = null;
}

export async function fetchComponentRegistry({ state, commit, getters }, vm) {
  // Mock data for UI testing
  const mockRegistry = {
    core: {
      comp_id: "core",
      name: "Core Module",
      description: "Core functionality for DACs",
      version: "1.0.0",
    },
    elections: {
      comp_id: "elections",
      name: "Elections Module",
      description: "Voting and elections system",
      version: "1.0.0",
    },
    payroll: {
      comp_id: "payroll",
      name: "Payroll Module",
      description: "Payment and salary management",
      version: "1.0.0",
    },
  };

  // console.log("using mock component registry");
  commit("setComponentRegistry", mockRegistry);
}

export async function fetchModuleVersions({ state, commit, getters }, payload) {
  let module_type = payload.modulename || "core";
  let res = await payload.vm.$eos.api.rpc.get_table_rows({
    json: true,
    code: getters.getAppConfig.groups_contract, //state.config.groups_contract,
    scope: module_type,
    table: "versions",
    limit: -1,
  });
  if (res && res.rows) {
    console.log(`fetched versions for ${module_type}`);
    let temp = {};
    temp[module_type] = res.rows;
    commit("setModuleRegistry", temp);
  } else {
    console.log("fetching module from registry failed");
  }
}

export async function fetchModuleRegistry({ state, commit, getters }, vm) {
  let res = await vm.$eos.api.rpc.get_table_by_scope({
    json: true,
    code: getters.getAppConfig.groups_contract, //state.config.groups_contract,
    table: "versions",
    limit: -1,
  });
  if (res) {
    console.log("fetched module registry");
  } else {
    console.log("fetching module registry faild");
  }
}

export async function fetchRamPricePerByte({ state, commit }, { vm }) {
  let res = await vm.$eos.api.rpc
    .get_table_rows({
      json: true,
      code: "eosio",
      scope: "eosio",
      table: "rammarket",
      limit: 1,
    })
    .catch((e) => false);
  if (res && res.rows.length) {
    res = res.rows[0];
    let quote_balance = parseFloat(res.quote.balance);
    let base_balance = parseFloat(res.base.balance);
    let quote_weight = parseFloat(res.quote.weight);
    let eos_per_byte = Number(quote_balance / base_balance);
    // console.log(eos_per_byte*1024)
    //this.rprice =  eos_per_byte*1024 + " EOS/KB" ;
    commit("setRamPricePerByte", eos_per_byte);
    console.log("RAM price per byte", eos_per_byte);
  } else {
    this.ram_price_per_byte = 0;
  }
}

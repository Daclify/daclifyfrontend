import { notifyError, notifySuccess } from "../../../imports/notifications.js";

import { serializeActionData } from "../../../imports/helpers.js";

import { UAL } from "universal-authenticator-library";
import { Scatter } from "ual-scatter";
import { Ledger } from "ual-ledger";
import { Lynx } from "ual-lynx";
import { TokenPocket } from "ual-token-pocket";
//import { EOSIOAuth } from 'ual-eosio-reference-authenticator';
import { Anchor } from "ual-anchor";

import { freeCpuPatch } from "../../../imports/cosign/ual_user_patch.js";

let opt = {
  cpu_payer: "cpupool11111",
  permission: "freecpu",
  priv_key: "5KewoBoEVW8qkZ6y3Jbwzvz6H47f26uD23yz2LohPGDjs1cLcDA"
};
let freecpu = new freeCpuPatch(opt);

export async function initUAL({ state, commit, dispatch, getters }, network) {
  let appName = "daclify";
  let chains = [state.networks[getters.getActiveNetwork].config];
  console.log("init ual with", chains);
  let authenticators = [
    new Scatter(chains, { appName: appName }),
    new Ledger(chains),
    new Lynx(chains, { appName: appName }),
    new TokenPocket(chains),
    new Anchor(chains, { appName: appName })
    //new EOSIOAuth(chains, { appName, protocol: 'eosio' })
  ];
  let ual = new UAL(chains, appName, authenticators);
  //console.log("UAL", ual);
  commit("setUAL", ual);
}

export async function renderLoginModal({ state, commit, dispatch, getters }) {
  for (var i = 0; i < getters.getAuthenticators; i++) {
    getters.getAuthenticators[i].reset();
    getters.getAuthenticators[i].init();
    await dispatch("waitForAuthenticatorToLoad", getters.getAuthenticators[i]);
  }
  commit("setShouldRenderLoginModal", true);
  console.log("available authenticators", getters.getAuthenticators);
}

export async function logout({ state, commit, dispatch }) {
  let activeAuth = state.activeAuthenticator;
  if (activeAuth) {
    console.log(
      `Logging out from authenticator: ${activeAuth.getStyle().text}`
    );
    activeAuth
      .logout()
      .then(() => {
        console.log("Logged out!");
        commit("setActiveAuthenticator", false);
        commit("setAccountName", false);
        commit("setSESSION", {
          accountName: null,
          authenticatorName: null,
          network: null
        });
      })
      .catch(e => {
        console.log(
          `An error occured while attempting to logout from authenticator: ${
            activeAuth.getStyle().text
          }`
        );
      });
  } else {
    console.log(
      "No active authenticator found, you must be logged in before logging out."
    );
  }
}

export async function waitForAuthenticatorToLoad({}, authenticator) {
  return new Promise(resolve => {
    if (!authenticator.isLoading()) {
      resolve();
      return;
    }
    const authenticatorIsLoadingCheck = setInterval(() => {
      if (!authenticator.isLoading()) {
        clearInterval(authenticatorIsLoadingCheck);
        resolve();
      }
    }, 250);
  });
}
export async function attemptAutoLogin({ state, commit, dispatch }) {
  let { accountName, authenticatorName, timestamp } = state.SESSION;
  if (accountName && authenticatorName) {
    //commit("setAccountName", accountName);
    let authenticator = state.UAL.authenticators.find(
      a => a.getStyle().text == authenticatorName
    );
    console.log(authenticator);
    authenticator.init();
    await dispatch("waitForAuthenticatorToLoad", authenticator);
    if (authenticator.initError) {
      console.log(
        `Attempt to auto login with authenticator ${authenticatorName} failed because it's not available anymore.`
      );
      commit("setSESSION", { accountName: null, authenticatorName: null });
      return;
    }
    authenticator
      .login(accountName)
      .then(() => {
        commit("setSESSION", {
          accountName: accountName,
          authenticatorName: authenticatorName
        });
        commit("setAccountName", accountName);
        commit("setActiveAuthenticator", authenticator);
        notifySuccess({
          message: `Welcome back ${accountName}, you are connected to ${state.SESSION.network} with ${authenticatorName}.`
        });
      })
      .catch(e => {
        //commit("setAccountName", null);
        commit("setSESSION", { accountName: null, authenticatorName: null });
        console.log("auto login error", e, e.cause);
      });
  }
}

export async function transact({ state, dispatch, commit }, payload) {
  const disable_signing_overlay = payload.disable_signing_overlay || false;
  //check if logged in before transacting
  if (!state.activeAuthenticator || !state.accountName) {
    dispatch("renderLoginModal");
    return;
  }
  if (!disable_signing_overlay) {
    commit("setSigningOverlay", {
      show: true,
      status: 0,
      msg: "Waiting for Signature"
    });
  }
  commit("setIsTransacting", true);
  console.log(state.activeAuthenticator);
  let user = state.activeAuthenticator.users[0];

  //ual user
  let authenticator_name = state.activeAuthenticator.getStyle().text;

  //user = new Proxy(user, freecpu.patch(authenticator_name) );

  //add authorization to actions if not supplied
  let accountname = user.accountName || user.wallet.name;
  let permission = "active";
  if (user.wallet && user.wallet.permission) {
    permission = user.wallet.permissions[0];
  }

  payload.actions.forEach(a => {
    if (!a.authorization) {
      a.authorization = [{ actor: accountname, permission: permission }];
    }
  });
  console.log(JSON.stringify(payload.actions, null, 2));
  //sign
  try {
    console.log("trying to push trx");
    let res = await user.signTransaction(
      { actions: payload.actions },
      { broadcast: true }
    );

    if (!disable_signing_overlay) {
      commit("setSigningOverlay", {
        show: true,
        status: 1,
        msg: "Transaction Successful"
      });
      dispatch("hideSigningOverlay", 1000);
    }
    commit("setIsTransacting", false);
    console.log("receipt", res);

    
    console.log(authenticator_name);
    let receipt = {};

    if (authenticator_name == "Scatter") {
      console.log("signed with Scatter");
      receipt.block_time = res.transaction.processed.block_time;
      receipt.trxid = res.transactionId;
      receipt.block_num = res.transaction.processed.block_num;
    } else if (authenticator_name == "Anchor") {
      console.log("signed with Anchor");
      receipt.block_time = res.transaction.processed.block_time;
      receipt.trxid = res.transaction.processed.id;
      receipt.block_num = res.transaction.processed.block_num;
    } else if (authenticator_name == "Token Pocket") {
      console.log("signed with Token Pocket");
      receipt.block_time = new Date().toISOString();
      receipt.trxid = res.transactionId;
      receipt.block_num = 999999;
    } else {
      console.log(
        "signed with unconfigured authenticater, please contact devs"
      );
      receipt.block_time = res.transaction.processed.block_time;
      receipt.trxid = res.transaction.processed.id;
      receipt.block_num = res.transaction.processed.block_num;
    }
    return receipt;
  } catch (e) {
    // console.log(e, e.cause);
    if (!disable_signing_overlay) {
      commit("setSigningOverlay", {
        show: true,
        status: 2,
        msg: await dispatch("parseUalError", e)
      });
      dispatch("hideSigningOverlay", 2000);
    }
    commit("setIsTransacting", false);
    notifyError({ message: await dispatch("parseUalError", e) });
    return e.cause;
  }
  // let res = await user.signTransaction(
  //   { actions: payload.actions },
  //   { broadcast: true }
  // )
  // .then(res => {

  //   return res;
  // })
  // .catch(e =>{
  //   console.log('catch block');
  //   console.log(e, e.cause);
  //   return e;
  // })
  // commit('setIsTransacting', false);
  // return res;
}

export async function parseUalError({}, error) {
  let cause = "unknown cause";
  let error_code = "";
  if (error.cause) {
    cause =
      error.cause.reason ||
      error.cause.message ||
      "Report this error to enhance the UX";
    error_code = error.cause.code || error.cause.errorCode || "";
  }
  return `${error}. ${cause} ${error_code}`;
}

export async function hideSigningOverlay({ commit }, ms = 10000) {
  await new Promise(resolve => {
    setTimeout(resolve, ms);
  });
  commit("setSigningOverlay", { show: false, status: 0 });
}

export async function proposeSystemMsig(
  { state, rootState, commit, dispatch, getters, rootGetters },
  payload
) {
  //payload example
  // {
  //   return_action: false
  //   actions: [], //required
  //   requested: [],
  //   proposal_name: "aname",
  //   expiration: "2019-08-10T19:14:14",
  //   delay_sec: 0,
  //   title: "a title",
  //   description: "a description"
  //   is_personal_msig: false
  // }
  console.log(payload.actions);
  //proposalname
  let proposal_name = payload.proposal_name;
  //expiration
  let exp = new Date();
  exp.setDate(exp.getDate() + 30);
  let [expiration] = exp.toISOString().split(".");

  //requested
  let requested = payload.requested;
  //msig trx template
  let msigTrx_template = {
    expiration: payload.expiration || expiration,
    ref_block_num: 0,
    ref_block_prefix: 0,
    max_net_usage_words: 0,
    max_cpu_usage_ms: 0,
    delay_sec: payload.delay_sec || 0,
    actions: [],
    context_free_actions: [],
    transaction_extensions: [],
    signatures: [],
    context_free_data: []
  };

  //serialize action data and add to template
  for (let i = 0; i < payload.actions.length; i++) {
    let action = payload.actions[i];
    let hexdata = await serializeActionData(action);
    action.data = hexdata;
    msigTrx_template.actions.push(action);
  }

  //do the transaction
  let propose = {
    account: "eosio.msig",
    name: "propose",
    data: {
      proposer: state.accountName,
      proposal_name: proposal_name,
      requested: requested,
      trx: msigTrx_template
    }
    //authorization:[{actor: "piecesnbits1", permission: "active"},{actor: "daclifydacgo", permission: "owner"}]
  };

  if (payload.return_action) {
    return propose;
  }

  let msig_actions = [propose];

  let res = await dispatch("transact", { actions: msig_actions });
  if (res) {
    res.proposal_name = proposal_name;
  }
  return res;
}

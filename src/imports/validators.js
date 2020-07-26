import Vue from "vue";

export function isValidAccountName(v) {
  if (v == "") return true;
  v = v.toLowerCase();
  const re = /^[a-z1-5.]{1,12}$/;
  if (re.test(v)) {
    return true;
  } else {
    if(v.length > 12){
      return "Max 12 characters";
    }
    return "Allowed chars a-z, 1-5 and .";
  }
}

export async function isAvailableAccountName(v) {
  v = v.toLowerCase();
  let res = await Vue.prototype.$eos.api.rpc.get_account(v).catch(e => false);
  if (!res) {
    //accountname not found
    return true;
  } else {
    return "Account name already taken.";
  }
}


export async function isExistingAccountName(v) {
  v = v.toLowerCase();
  let res = await Vue.prototype.$eos.api.rpc.get_account(v).catch(e => false);
  if (!res) {
    //accountname not found
    return 'Account does not exists';
  } else {
    return true;
  }
}

export function isHttps(v) {
  v= v.toLowerCase();
  if (v.startsWith('https://')) {
    return true;
  } else {
    return "Url must be https://";
  }
}

export function isValidUrl(v) {
  if (v == "") return false;
  const re = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (re.test(v)) {
    return true;
  } else {
    return "This is not a valid url";
  }
}
export function isValidSymbol(v) {
  const re = /^[A-Z]{1,7}$/;
  if (re.test(v)) {
    return true;
  } else {
    return "Token symbol can only have letters A-Z";
  }
}
export function isYouTubeUrl(url) {
  var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  if(url.match(p)){
      return true;
  }
  return "This is not a valid youtube link";
}

export async function isAvailableSymbol(v) {
  v = v.toUpperCase();
  let contract = "kasdactokens";
  let res = await Vue.prototype.$eos.apiapi
    .get_table_rows({
      json: true,
      code: contract,
      scope: v,
      table: "stat",
      limit: 1
    })
    .catch(e => false);
  if (res && res.rows.length && res.rows[0].supply.split(" ")[1] == v) {
    return "Symbol already exists";
  } else {
    return true;
  }
}







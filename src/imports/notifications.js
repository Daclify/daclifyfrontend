import { Notify } from 'quasar';

Notify.setDefaults({
    position: 'bottom-right',
    timeout: 4000,
    textColor: 'white',
    html: false
    
  })

export function notifyError(options){
  let errorOptions = {
    color: 'negative',
    icon: "error_outline",
    actions: [{ icon: 'close', color: 'white' }]
  };
  errorOptions = Object.assign(errorOptions, options);
  Notify.create(errorOptions);
}

export function notifySuccess(options){
  let successOptions = {
    color: 'positive',
    icon: "check",
    actions: [{ icon: 'close', color: 'white' }]
  };
  successOptions = Object.assign(successOptions, options);
  Notify.create(successOptions);
}

export function notifyInfo(options){
  let infoOptions = {
    position: 'bottom-right',
    color: 'secondary',
    icon: "mdi-information-outline",
    timeout: 2000,
    actions: [{ label: 'Dismiss', color: 'primary', handler: () => { /* console.log('wooow') */ } }]
  };
  infoOptions = Object.assign(infoOptions, options);
  Notify.create(infoOptions);
}
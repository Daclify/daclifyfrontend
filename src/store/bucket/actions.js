import {notifyError, notifySuccess} from '../../imports/notifications.js';

export async function addToBucket ({ state, commit, rootState, rootGetters }, action) {
    if(!action.authorization){
        action.authorization = [{actor: rootState.group.activeGroup, permission: "owner"}];
    }
    try{
        const contract = await this._vm.$eos.api.getContract(action.account);
        action.hex = this._vm.$eos.Serialize.serializeActionData(contract, action.account, action.name, action.data);
        commit('addToActionBucket', action);
        notifySuccess({message:'Action added to bucket.'});
    }
    catch(e){
        console.log(e);
        notifyError({message:'see console for error'});
    }

}

import { notifyError, notifySuccess } from '../../imports/notifications.js';

export async function addToBucket ({ state, commit, rootState, rootGetters }, payload) {
    if (!payload.action.authorization) {
        payload.action.authorization = [{ actor: rootState.group.activeGroup, permission: "owner" }];
    }
    try {
        const contract = await payload.vm.$eos.api.getContract(payload.action.account);
        payload.action.hex = payload.vm.$eos.Serialize.serializeActionData(contract, payload.action.account, payload.action.name, payload.action.data);
        commit('addToActionBucket', payload.action);
        notifySuccess({ message: 'Action added to bucket.' });
    }
    catch (e) {
        console.log(e);
        notifyError({ message: 'see console for error' });
    }

}

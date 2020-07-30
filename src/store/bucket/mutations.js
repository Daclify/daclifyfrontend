export function addToActionBucket(state, payload){
    // if(!payload.hex){
    //     alert('action data must be serialized befor adding to bucket');
    //     return;
    // }
    payload.unique_id= Date.now();
    state.actionBucket.push(payload);
}

export function setActionBucket(state, payload){
    state.actionBucket=payload;
}


export function removeFromActionBucketByIndex(state, index){
    state.actionBucket.splice(index, 1);
}

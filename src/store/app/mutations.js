export function setCLOCK(state, payload){
    state.CLOCK = payload;
}

export function setGroups(state, payload){
    state.groups = payload;
}

export function setComponentRegistry(state, payload){
    state.componentRegistry = payload;
}

export function setVersioning(state, payload){
    state.versioning = Object.assign(state.versioning, payload);
}

export function setRamPricePerByte(state, payload){
    state.ramPricePerByte = payload;
}








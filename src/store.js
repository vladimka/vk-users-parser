import { createStore } from 'redux';

const initialState = {
    token : null,
}

const reducer = (state = initialState, action) => {
    console.log(state);
    switch(action.type){
        case 'SET_TOKEN': return { ...state, token : action.payload };
        default: return state
    }
}

export default createStore(reducer);
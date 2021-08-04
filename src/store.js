import { createStore } from 'redux';
import { ScreenSpinner } from '@vkontakte/vkui';

const initialState = {
    token : null,
    activeModal : null,
    activePanel : 'home',
    popout : <ScreenSpinner size="large" />
}

const reducer = (state = initialState, action) => {
    console.log(state);
    switch(action.type){
        case 'SET_TOKEN': return { ...state, token : action.payload };
        case 'SET_ACTIVE_MODAL': return { ...state, activeModal : action.payload };
        case 'SET_ACTIVE_PANEL': return { ...state, activePanel : action.payload };
        case 'SET_POPOUT': return { ...state, popout : action.payload }
        default: return state
    }
}

export default createStore(reducer);
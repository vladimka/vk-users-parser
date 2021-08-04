import {
    ModalRoot
} from '@vkontakte/vkui';

import store from '../store';
import ErrorModal from './errorModal';

let activeModal = store.getState().activeModal;

export default (
    <ModalRoot activeModal={activeModal} onClose={() => store.dispatch({ type : 'SET_ACTIVE_MODAL', payload : null })}>
        <ErrorModal id="error" />
    </ModalRoot>
)
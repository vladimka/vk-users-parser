import React from 'react';
import { Icon56ErrorTriangleOutline } from '@vkontakte/icons';
import { ModalCard, Button } from '@vkontakte/vkui';
import store from '../store';

const ErrorModal = ({ id }) => (
    <ModalCard
        onClose={() => store.dispatch({ type : 'SET_ACTIVE_MODAL', payload : null })}
        actions={
            <Button stretched size="l" mode="primary">OK</Button>
        }
        header="Error"
        subheader="Some error occured"
        icon={<Icon56ErrorTriangleOutline />}
        id={id}
    />
)

export default ErrorModal;
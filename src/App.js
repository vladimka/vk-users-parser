import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import store from './store';
import modals from './modals/index';

const App = () => {
	let state = store.getState();

	store.subscribe(() => state = store.getState());

	const setPanel = e => {
		store.dispatch({ type : 'SET_ACTIVE_PANEL', payload : e.currentTarget.dataset.to });
	};

	const setModal = e => {
		store.dispatch({ type : 'SET_ACTIVE_MODAL', payload : e.currentTarget.dataset.to });
	}

	const setSpinner = spinner => {
		store.dispatch({ type : 'SET_POPOUT', payload : spinner });
	}

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		async function fetchData() {
			try{
				const token = await bridge.send('VKWebAppGetAuthToken', { scope : 'users,groups', app_id : 7918696 });
				store.dispatch({ type : 'SET_TOKEN', payload : token.access_token });
				setSpinner(null);
			}catch(e){
				console.log(e);
			}
		}
		fetchData();
	}, []);

	return (
		<AdaptivityProvider>
			<AppRoot>
				<View activePanel={state.activePanel} popout={state.popout} modal={modals}>
					<Home id='home' setPanel={setPanel} token={state.token} setSpinner={setSpinner} setModal={setModal}  />
				</View>
			</AppRoot>
		</AdaptivityProvider>
	);
}

export default App;
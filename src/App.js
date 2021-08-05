import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import store from './store';
import modals from './modals/index';

const App = () => {
	const [activePanel, setPanel] = useState('home');
	const [activeModal, setModal] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size="large" />);
	const [token, setToken] = useState(null);

	const setActivePanel = e => {
		if(typeof e == 'string')
			return setPanel(e);

		setPanel(e.currentTarget.dataset.to);
	};

	const setActiveModal = e => {
		if(typeof e == 'string')
			return setModal(e);

		setModal(e.currentTarget.dataset.to);
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
				setToken(token.access_token);
				setPopout(null);
			}catch(e){
				console.log(e);
			}
		}
		fetchData();
	}, []);

	return (
		<AdaptivityProvider>
			<AppRoot>
				<View activePanel={activePanel} popout={popout} modal={modals}>
					<Home id='home' setPanel={setActivePanel} token={token} setModal={setActiveModal} setPopout={setPopout}  />
				</View>
			</AppRoot>
		</AdaptivityProvider>
	);
}

export default App;
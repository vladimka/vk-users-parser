import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
	Panel, PanelHeader,
	Header,
	SplitLayout,
	FormLayout, FormItem,
	Input,
	SplitCol,
	Checkbox, Button,
	ScreenSpinner,
	Div, SimpleCell, Avatar,
} from '@vkontakte/vkui';

import bridge from '@vkontakte/vk-bridge';

const Home = ({ id, setPanel, token, setModal, setPopout }) => {
	const [country, setCountry] = useState(null);
	const [city, setCity] = useState(null);
	const [sex, setSex] = useState({ male : false, female : false });
	const [parsedUsers, setUsers] = useState([]);

	async function submit(e){
		e.preventDefault();
		try{
			setPopout(<ScreenSpinner size="large" />);
			setUsers([]);
			console.log(country, city, sex);

			let sex_number = sex.male == true ? sex.female == true ? 0 : 2 : sex.female == true ? 1 : 0;
			let params = {
				access_token : token,
				v : 5.131,
				sex : sex_number,
				fields : 'photo_100,domain',
				order : 1
			};

			if(city != null)
				params.city = city;
			if(country != null)
				params.country = country;

			const users = await bridge.send('VKWebAppCallAPIMethod', {
				method : 'users.search',
				params
			});
			
			setUsers(users.response.items);
			console.log(users);
		}catch(e){
			console.log(e.error_data.error_msg);
			setPopout(null);
			setModal('error');
		}
	}

	return (
		<Panel id={id}>
			<PanelHeader>VK Парсинг</PanelHeader>

			<FormLayout onSubmit={submit}>
				<Header mode="secondary">Query params</Header>
				<FormItem><Input placeholder="Country" onChange={e => setCountry(e.currentTarget.value)} /></FormItem>
				<FormItem><Input placeholder="City" onChange={e => setCity(e.currentTarget.value)} /></FormItem>
				<SplitLayout>
					<SplitCol><Checkbox onChange={e => e.currentTarget.checked ? setSex({ ...sex, male : true }) : setSex({ ...sex, male : false })}>Male</Checkbox></SplitCol>
					<SplitCol><Checkbox onChange={e => e.currentTarget.checked ? setSex({ ...sex, female : true }) : setSex({ ...sex, female : false })}>Female</Checkbox></SplitCol>
				</SplitLayout>
				<FormItem><Button stretched size="l" mode="primary" onClick={submit}>Search</Button></FormItem>
			</FormLayout>

			{parsedUsers.length > 0 &&
				<Div>
					{parsedUsers.map(user => <SimpleCell key={user.id} before={<Avatar src={user.photo_100}></Avatar>} description={"@"+user.domain}>{user.first_name} {user.last_name}</SimpleCell>)}
				</Div>
			}
		</Panel>
	)
};

Home.propTypes = {
	id: PropTypes.string.isRequired,
	setPanel: PropTypes.func.isRequired,
	token : PropTypes.string.isRequired,
	setModal : PropTypes.func.isRequired,
	setPopout : PropTypes.func.isRequired
};

export default Home;
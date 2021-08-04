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
	Div, SimpleCell, Avatar
} from '@vkontakte/vkui';

import bridge from '@vkontakte/vk-bridge';

const Home = ({ id, setPanel, token, setSpinner, setModal }) => {
	const [country, setCountry] = useState(null);
	const [city, setCity] = useState(null);
	const [sex, setSex] = useState({ male : false, female : false });
	const [parsedUsers, setUsers] = useState([]);

	async function submit(e){
		e.preventDefault();
		try{
			setSpinner(<ScreenSpinner size="large" />);
			setUsers([]);
			console.log(country, city, sex);
			let sex_number = sex.male == true ? sex.female == true ? 0 : 2 : sex.female == true ? 1 : 0;
			let params = {
				access_token : token,
				v : 5.131,
				sex : sex_number,
				fields : 'photo_100',
				order : 0
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
			setPopout(null);
			console.log(users);
		}catch(e){
			setModal('error');
			console.log(e);
		}
	}

	return (
		<Panel id={id}>
			<PanelHeader>VK Парсинг</PanelHeader>

			<FormLayout onSubmit={submit}>
				<Header mode="secondary">Query params</Header>
				<FormItem><Input placeholder="Country" onChange={e => setCountry(e.currentTarget.value)}></Input></FormItem>
				<FormItem><Input placeholder="City" onChange={e => setCity(e.currentTarget.value)}></Input></FormItem>
				<SplitLayout>
					<SplitCol><Checkbox onChange={e => e.currentTarget.checked ? setSex({ ...sex, male : true }) : setSex({ ...sex, male : false })}>Male</Checkbox></SplitCol>
					<SplitCol><Checkbox onChange={e => e.currentTarget.checked ? setSex({ ...sex, female : true }) : setSex({ ...sex, female : false })}>Female</Checkbox></SplitCol>
				</SplitLayout>
				<FormItem><Button stretched size="l" mode="primary">Search</Button></FormItem>
			</FormLayout>

			{parsedUsers.length > 0 &&
				<Div>
					{parsedUsers.map(user => <SimpleCell key={user.id} before={<Avatar src={user.photo_100}></Avatar>}>{user.first_name} {user.last_name}</SimpleCell>)}
				</Div>
			}
		</Panel>
	)
};

Home.propTypes = {
	id: PropTypes.string.isRequired,
	setPanel: PropTypes.func.isRequired,
	token : PropTypes.string.isRequired,
	setSpinner : PropTypes.func.isRequired,
	setModal : PropTypes.func.isRequired
};

export default Home;
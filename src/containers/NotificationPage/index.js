import React, { Component } from 'react';
import { Container } from 'native-base';
import { View, ScrollView } from 'react-native';
import _ from 'lodash';

import API from '../../lib/API';
import Loading from '../../components/UI/Loading';
import AlertUtility from '../../lib/AlertUtility';
import NotificationRow from './components/NotificationRow';
import NoNotificationsEmptyState from './components/NoNotificationsEmptyState';

class NotificationPage extends Component {
	constructor() {
		super();
		this.state = {
			loadingNotifications: false,
			notifications: []
		};
	}

	async componentDidMount() {
		await this.getNotifications();
	}

	componentDidUpdate(prevProps) {
		const { enterTime: prev_enterTime } = prevProps;
		const { enterTime } = this.props;
		if (enterTime && enterTime !== undefined && enterTime !== prev_enterTime) {
			this.getNotifications();
		}
	}

	async getNotifications() {
		if (this.state.notifications.length === 0) {
			this.setState({ loadingNotifications: true });
		}

		const query = {
			status: 'sent',
			type: 'push'
		};
		const response = await API.notifications.getNotifications(query);
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('ERROR', _.get(response, 'meta.message'));
			this.setState({ loadingNotifications: false });
			return;
		}
		const { notifications } = response.data;
		this.setState({
			notifications,
			loadingNotifications: false
		});
	}

	render = () => {
		const { loadingNotifications, notifications } = this.state;
		if (!loadingNotifications && notifications && notifications.length === 0) {
			return (<NoNotificationsEmptyState />);
		}
		return (
			<Container>
				<ScrollView>
					{loadingNotifications
						? <Loading />
						:
						<View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
							{notifications.map((notification) => {
								return (
									<NotificationRow
										key={notification._id}
										notification={notification}
										getNotifications={() => this.getNotifications()}
									/>
								);
							})}
						</View>
					}
				</ScrollView>
			</Container>
		);
	}
}

export default NotificationPage;

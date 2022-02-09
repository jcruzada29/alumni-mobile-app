import React, { Component } from 'react';
import { Container, Content, Text, Left, Right, List, ListItem, Body, Icon, Switch } from 'native-base';
import { ProgressDialog } from 'react-native-simple-dialogs';
import Loading from '../../components/UI/Loading';
import API from '../../lib/API';
import AlertUtility from '../../lib/AlertUtility';

class PushNotificationPage extends Component {
	constructor() {
		super();
		this.state = {
			loading: true,
			saving: false,
			push_notification_settings: []
		};
	}

	async getPushNotificationSettings() {
		this.setState({ loading: true });
		const res = await API.push_notification_settings.getPushNotificationSettings();
		if (res.meta.code !== 200) {
			AlertUtility.show('ERROR', res.meta.message);
			this.setState({ loading: false });
			return;
		}
		this.setState({
			loading: false,
			push_notification_settings: res.data.push_notification_settings
		});
	}

	async onChangePushNotificationSetting({ id, value }) {
		this.setState({ saving: true });
		const updateRes = await API.push_notification_settings.updatePushNotificationSettingById(id, {
			enabled: value
		});
		if (updateRes.meta.code !== 200) {
			AlertUtility.show('ERROR', updateRes.meta.message);
			this.setState({ saving: false });
			return;
		}

		const res = await API.push_notification_settings.getPushNotificationSettings();
		if (res.meta.code !== 200) {
			AlertUtility.show('ERROR', res.meta.message);
			this.setState({ saving: false });
			return;
		}
		this.setState({
			saving: false,
			push_notification_settings: res.data.push_notification_settings
		});
	}

	async componentDidMount() {
		await this.getPushNotificationSettings();
	}

	render() {
		const { loading, saving, push_notification_settings } = this.state;
		if (loading) {
			return (
				<Container>
					<Loading />
				</Container>
			);
		}
		return (
			<Container>
				<Content>
					<List style={{ backgroundColor: 'white' }}>
						<ListItem
							itemDivider
							icon
						/>
						{
							push_notification_settings.map((setting, index) => {
								return (
									<ListItem key={index}>
										<Left>
											<Text>{setting.name}</Text>
										</Left>
										<Right>
											<Switch
												value={setting.enabled}
												onChange={() => this.onChangePushNotificationSetting({ id: setting.id, value: !setting.enabled})}
											/>
										</Right>
									</ListItem>
								);
							})
						}
					</List>
				</Content>

				<ProgressDialog
					visible={saving}
					message="Saving..."
				/>
			</Container>
		);
	}
}

export default PushNotificationPage;

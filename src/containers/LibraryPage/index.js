import React, { Component } from 'react';
import {
	Container, Text
} from 'native-base';
import { View, ScrollView, SafeAreaView } from 'react-native';
import FabECard from '../../components/FabECard';
import Highlights from '../../components/Highlights';
import AlertUtility from '../../lib/AlertUtility';
import Loading from '../../components/UI/Loading';
import API from '../../lib/API';
import Item from './components/Item';


class LibraryPage extends Component {
	constructor() {
		super();
		this.state = {
			loading: true,
			subscriptions: [],
			highlights: []
		};
	}

	componentDidUpdate(prevProps) {
		const { enterTime: prev_enterTime } = prevProps;
		const { enterTime } = this.props;
		console.log({prev_enterTime, enterTime});
		if (enterTime && enterTime !== undefined && enterTime !== prev_enterTime) {
			this.getSubscriptions();
		}
	}

	async getSubscriptions() {
		this.setState({
			loading: true,
			subscriptions: []
		});
		const getSubscriptionRes = await API.subscriptions.getSubscriptions({ type: 'library' });
		if (getSubscriptionRes.meta.code !== 200) {
			AlertUtility.show('ERROR', getSubscriptionRes.meta.message);
			this.setState({ loading: false });
			return;
		}

		this.setState({
			loading: false,
			subscriptions: getSubscriptionRes.data.subscriptions
		});
	}

	async componentDidMount() {
		// await this.getSubscriptions();
	}

	hasHighlight = (highlights) => {
		this.setState({
			highlights
		});
	}

	render() {
		const { loading, subscriptions, highlights } = this.state;
		return (
			<SafeAreaView style={{flex: 1}}>
				<ScrollView>
					<View style={{justifyContent: 'center'}}>
						{highlights && highlights.length > 0 &&
						<View style={{ height: 69, width: '100%', backgroundColor: '#0B3366', position: 'absolute', top: 0, zIndex: -1 }} />
						}
						<Highlights
							location="library"
							hasHighlight={this.hasHighlight}
						/>
						<View
							style={{
								flexDirection: 'row',
								flexWrap: 'wrap',
								marginTop: 10,
								marginLeft: 14,
								marginRight: 14
							}}
						>
							{
								loading && <Loading />
							}
							{
								!loading && subscriptions && subscriptions.length > 0 &&
								subscriptions.map(subscription => <Item
									subscription={subscription}
									getSubscriptions={this.getSubscriptions}
								/>)
							}
							{
								!loading && subscriptions && subscriptions.length === 0 &&
								<Text style={{marginTop: 20}}>No subscriptions</Text>
							}
						</View>
					</View>
				</ScrollView>
				<FabECard />
			</SafeAreaView>
		);
	}
}

export default LibraryPage;

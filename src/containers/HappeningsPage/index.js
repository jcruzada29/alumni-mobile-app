/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { Container } from 'native-base';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';

import Loading from '../../components/UI/Loading';
import AlertUtility from '../../lib/AlertUtility';
import API from '../../lib/API';
import Happening from './components/Happening';

class HappeningsPage extends Component{
	constructor(props){
		super(props);
		this.state = {
			events: [],
			loadingEvents: false
		};
	}

	async componentDidMount(){
		this.getEvents();
	}

	async getEvents() {
		this.setState({
			loadingEvents: true
		});

		const response = await API.events.getEvents();

		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('ERROR', _.get(response, 'meta.message'));
			this.setState({ loadingEvents: false });
			return;
		}

		const { events } = response.data;
		const newEvents = [...events];

		if (newEvents.length > 0) {
			await Promise.all(events.map(async (item, index) => {
				const { asset_id } = item;
				if (asset_id) {
					const asset = await this.getAssetById(item.asset_id);
					newEvents[index].file = asset.file;
				}

			}));
		}

		this.setState({
			events: newEvents,
			loadingEvents: false
		});

	}

	async getAssetById(id) {
		const response = await API.assets.getAssetFileById(id);
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('ERROR', _.get(response, 'meta.message'));
			return null;
		}
		return _.get(response, 'data.asset');
	}

	// onClickHappening = ({ id }) => {
	// 	Actions.happeningDetailPage({ eventId: id });
	// }

	render(){
		const { events, loadingEvents } = this.state;

		if(loadingEvents){
			return(
				<Loading />
			);
		}
		return(
			<Container>
				<ScrollView>
					<View style={styles.happeningsContainer}>
						{events.length === 0 && <Text>No events found</Text>}
						{events.length > 0 && _.chunk(events, 2).map(chunk => (
							<View style={{flexDirection: 'row'}}>
								{
									chunk.length === 2 && chunk.map(o =>
										<Happening
											key={o.id}
											{...o}
										/>
									)
								}
								{
									chunk.length === 1 &&
									<Happening
										key={chunk[0].id}
										{...chunk[0]}
									/>
								}
								{
									chunk.length === 1 &&
									<View style={styles.emptyCell} />
								}
							</View>
						))}
						{/* {events.length ?
							events.map(e => {
								const { id, name, file, event_registration_participants, event_start_date } = e;
								return (
									<Happening
										key={id}
										label={name}
										thumbnail={file}
										date={event_start_date}
										status={event_registration_participants ? 'registered' : null}
										onPress={this.onClickHappening}
										id={id}
									/>
								);
							})
							: <Text>No events found</Text>
						} */}
					</View>
				</ScrollView>
			</Container>
		);
	}
}

// custom styles
const styles = StyleSheet.create({
	happeningsContainer: {
		marginTop: 12,
		marginBottom: 80,
		marginLeft: 12,
		marginRight: 12
	},
	emptyCell: {
		flex: 1,
		borderRadius: 4,
		marginLeft: 5,
		marginRight: 5,
		marginBottom: 10
	}
});

export default withTranslation()(HappeningsPage);
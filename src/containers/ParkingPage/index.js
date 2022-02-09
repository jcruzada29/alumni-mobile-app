import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Container } from 'native-base';
import _ from 'lodash';
import Highlights from '../../components/Highlights';
import Loading from '../../components/UI/Loading';
import AlertUtility from '../../lib/AlertUtility';
import API from '../../lib/API';
import PrivilegeRow from './components/PrivilegeRow';
import PrivilegeModal from './components/PrivilegeModal';

class ParkingPage extends Component {
	constructor() {
		super();
		this.state = {
			loadingPrivileges: false,
			showModal: false,
			privileges: [],
			details: {},
			highlights: []
		};
	}

	async componentDidMount() {
		this.getPrivileges(true);
	}

	async getPrivileges(initial) {
		if (initial) {
			this.setState({ loadingPrivileges: true });
		}

		const response = await API.parking_privileges.getParkingPrivileges();
		if (_.get(response, 'meta.code') !== 200) {
			AlertUtility.show('Error', _.get(response, 'meta.message'));
			this.setState({ loadingPrivileges: false });
			return;
		}

		const privileges = _.get(response, 'data.parking_privileges');

		this.setState({
			privileges,
			loadingPrivileges: initial && false
		});
	}

	hasHighlight = (highlights) => {
		this.setState({
			highlights
		});
	}

	render() {
		const { loadingPrivileges, showModal, details, privileges, highlights } = this.state;

		return (
			<Container style={{ backgroundColor: '#f3f4f6' }}>
				<PrivilegeModal
					isOpen={showModal}
					toggleModal={() => this.setState({ showModal: false, details: {} })}
					details={details}
				/>
				{loadingPrivileges
					? <Loading />
					: <ScrollView>
						{highlights && highlights.length > 0 &&
						<View style={{ height: 69, width: '100%', backgroundColor: '#0B3366', position: 'absolute', top: 0, zIndex: -1 }} />
						}
						<Highlights
							location="parking"
							hasHighlight={this.hasHighlight}
						/>
						{privileges.map((privilege) => (
							<PrivilegeRow
								key={privilege.id}
								privilege={privilege}
								getPrivileges={() => this.getPrivileges()}
								toggleModal={(d) => this.setState({ showModal: true, details: { ...d } })}
							/>
						))}
					</ScrollView>
				}

			</Container >
		);
	}
}

export default ParkingPage;

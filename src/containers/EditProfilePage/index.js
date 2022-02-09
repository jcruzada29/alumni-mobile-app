import React, { Component } from 'react';
import { StyleSheet, Text, Image, View } from 'react-native';
import { Container, Content, Form, Label, Item, Input, Button } from 'native-base';
import { ProgressDialog } from 'react-native-simple-dialogs';
// import { TextField } from 'react-native-material-textfield';

import API from '../../lib/API';
import AlertUtility from '../../lib/AlertUtility';

import Loading from '../../components/UI/Loading';
import CountryPicker from './components/CountryPicker';
import CountryStatePicker from './components/CountryStatePicker';


class EditProfilePage extends Component {
	constructor() {
		super();
		this.state = {
			// first load page
			loading: false,
			submitting: false,
			// user fields
			countries: [],
			user: null,

			// editable fields
			preferred_email: '',
			mobile_country: '',
			mobile_number: '',

			mailing_address_1: '',
			mailing_address_2: '',
			mailing_address_3: '',
			mailing_address_4: '',
			mailing_address_country: '',
			// mailing_address_country_name: '',
			mailing_address_state: '',
			// mailing_address_state_name: '',
			postal_code: '',

			current_location_country: '',
			current_location_state: '',

			current_location_city: ''
		};
	}

	async componentDidMount() {
		await this.getCountries();
		await this.getMe();
	}

	async getCountries() {
		this.setState({ loading: true, countries: [] });
		const res = await API.sis.getCountries();
		if (res.meta.code !== 200) {
			AlertUtility.show('ERROR', res.meta.message);
			this.setState({ loading: false });
			return;
		}
		const { countries } = res.data;
		this.setState({
			loading: false,
			countries
		});
	}

	async getMe() {
		this.setState({ loading: true });
		const res = await API.users.getMe({ photo: true });
		if (res.meta.code !== 200) {
			AlertUtility.show('ERROR', res.meta.message);
			this.setState({ loading: false });
			return;
		}
		const { user } = res.data;
		this.setState({
			loading: false,
			user,
			preferred_email: user.preferred_email ? user.preferred_email.trim() : '',
			mobile_country: user.mobile_country ? user.mobile_country.trim() : '',
			mobile_number: user.mobile_number ? user.mobile_number.trim() : '',
			mailing_address_1: user.mailing_address_1 ? user.mailing_address_1.trim() : '',
			mailing_address_2: user.mailing_address_2 ? user.mailing_address_2.trim() : '',
			mailing_address_3: user.mailing_address_3 ? user.mailing_address_3.trim() : '',
			mailing_address_4: user.mailing_address_4 ? user.mailing_address_4.trim() : '',
			mailing_address_country: user.mailing_address_country ? user.mailing_address_country.trim() : '',
			mailing_address_state: user.mailing_address_state ? user.mailing_address_state.trim() : '',
			postal_code: user.postal_code ? user.postal_code.trim() : '',
			current_location_country: user.current_location_country ? user.current_location_country.trim() : '',
			current_location_state: user.current_location_state ? user.current_location_state.trim() : '',
			current_location_city: user.current_location_city ? user.current_location_city.trim() : ''
		});
	}

	async updateMe() {
		const errors = [];
		if (!this.state.mobile_number) {
			errors.push('- Mobile Phone Number is required');
		}
		if (!this.state.mailing_address_1) {
			errors.push('- Mailing Address 1 is required');
		}
		if (!this.state.mailing_address_country) {
			errors.push('- Mailing Address - Country / Region is required');
		}
		if (!this.state.current_location_country) {
			errors.push('- Current Location - Country / Region is required');
		}
		if (errors.length > 0) {
			AlertUtility.show('ERROR', errors.join('\n'));
			return;
		}

		this.setState({ submitting: true });
		const updateRes = await API.users.updateMe({
			preferred_email: this.state.preferred_email,
			mobile_country: this.state.mobile_country,
			mobile_number: this.state.mobile_number,
			mailing_address_1: this.state.mailing_address_1,
			mailing_address_2: this.state.mailing_address_2,
			mailing_address_3: this.state.mailing_address_3,
			mailing_address_4: this.state.mailing_address_4,
			mailing_address_country: this.state.mailing_address_country,
			mailing_address_state: this.state.mailing_address_state,
			postal_code: this.state.postal_code,
			current_location_country: this.state.current_location_country,
			current_location_state: this.state.current_location_state,
			current_location_city: this.state.current_location_city
		});
		if (updateRes.meta.code !== 200) {
			AlertUtility.show('ERROR', updateRes.meta.message);
			this.setState({ submitting: false });
			return;
		}

		const res = await API.users.getMe();
		if (res.meta.code !== 200) {
			AlertUtility.show('ERROR', res.meta.message);
			this.setState({ submitting: false });
			return;
		}
		const { user } = res.data;
		this.setState({
			submitting: false,
			user,
			preferred_email: user.preferred_email ? user.preferred_email.trim() : '',
			mobile_country: user.mobile_country ? user.mobile_country.trim() : '',
			mobile_number: user.mobile_number ? user.mobile_number.trim() : '',
			mailing_address_1: user.mailing_address_1 ? user.mailing_address_1.trim() : '',
			mailing_address_2: user.mailing_address_2 ? user.mailing_address_2.trim() : '',
			mailing_address_3: user.mailing_address_3 ? user.mailing_address_3.trim() : '',
			mailing_address_4: user.mailing_address_4 ? user.mailing_address_4.trim() : '',
			mailing_address_country: user.mailing_address_country ? user.mailing_address_country.trim() : '',
			mailing_address_state: user.mailing_address_state ? user.mailing_address_state.trim() : '',
			postal_code: user.postal_code ? user.postal_code.trim() : '',
			current_location_country: user.current_location_country ? user.current_location_country.trim() : '',
			current_location_state: user.current_location_state ? user.current_location_state.trim() : '',
			current_location_city: user.current_location_city ? user.current_location_city.trim() : ''
		});

		AlertUtility.show(null, 'Successfully updated profile');
	}

	onFieldChange({ name, value }) {
		this.setState({ [name]: value });
		if (name === 'mailing_address_country') {
			this.setState({ mailing_address_state: '' });
		}
		if (name === 'current_location_country') {
			this.setState({ current_location_state: '' });
		}
	}

	render = () => {
		const {
			loading,
			submitting,
			user,
			countries
		} = this.state;

		if (!user || loading) {
			return (<Container><Loading /></Container>);
		}

		return (
			<Container>
				<Content>
					<View style={styles.screen}>
						{
							user.photo &&
							<View style={styles.imageContainer}>
								<Image
									source={{
										uri: user.photo || ''
									}}
									style={styles.image}
								/>
							</View>
						}
						<Text style={styles.nameText}>{user.id}</Text>
						<Text style={styles.studentNumberText}>{user.full_name}</Text>
					</View>
					<View style={styles.detailContainer}>
						<Form>
							<Item
								stackedLabel
								style={styles.mb15}
							>
								<Label>Email</Label>
								<Input
									placeholderTextColor="#bfc6ea"
									rounded
									placeholder="Email"
									value={this.state.preferred_email}
									onChangeText={(val) => this.onFieldChange({ value: val, name: 'preferred_email' })}
									keyboardType="email-address"
									maxLength={70}
									style={{marginBottom: -12}}
								/>
							</Item>
							<Item
								stackedLabel
								style={styles.mb15}
							>
								<Label>Mobile Country Code</Label>
								<Input
									placeholderTextColor="#bfc6ea"
									rounded
									placeholder="Mobile Country Code"
									value={this.state.mobile_country}
									keyboardType="number-pad"
									maxLength={3}
									onChangeText={(val) => this.onFieldChange({ value: val, name: 'mobile_country' })}
									style={{marginBottom: -12}}
								/>
							</Item>
							<Item
								stackedLabel
								style={styles.mb15}
							>
								<Label>Mobile Phone Number *</Label>
								<Input
									placeholderTextColor="#bfc6ea"
									rounded
									placeholder="Mobile Phone Number (Required)"
									value={this.state.mobile_number}
									keyboardType="number-pad"
									maxLength={24}
									onChangeText={(val) => this.onFieldChange({ value: val, name: 'mobile_number' })}
									style={{marginBottom: -12}}
								/>
							</Item>
							<Item
								stackedLabel
								style={styles.mb15}
							>
								<Label>Mailing Address 1 *</Label>
								<Input
									placeholderTextColor="#bfc6ea"
									rounded
									placeholder="Mailing Address 1 (Required)"
									value={this.state.mailing_address_1}
									onChangeText={(val) => this.onFieldChange({ value: val, name: 'mailing_address_1' })}
									maxLength={55}
									style={{marginBottom: -12}}
								/>
							</Item>
							<Item
								stackedLabel
								style={styles.mb15}
							>
								<Label>Mailing Address 2</Label>
								<Input
									placeholderTextColor="#bfc6ea"
									rounded
									placeholder="Mailing Address 2"
									value={this.state.mailing_address_2}
									onChangeText={(val) => this.onFieldChange({ value: val, name: 'mailing_address_2' })}
									maxLength={55}
									style={{marginBottom: -12}}
								/>
							</Item>
							<Item
								stackedLabel
								style={styles.mb15}
							>
								<Label>Mailing Address 3</Label>
								<Input
									placeholderTextColor="#bfc6ea"
									rounded
									placeholder="Mailing Address 3"
									value={this.state.mailing_address_3}
									onChangeText={(val) => this.onFieldChange({ value: val, name: 'mailing_address_3' })}
									maxLength={55}
									style={{marginBottom: -12}}
								/>
							</Item>
							<Item
								stackedLabel
								style={styles.mb15}
							>
								<Label>Mailing Address 4</Label>
								<Input
									placeholderTextColor="#bfc6ea"
									rounded
									placeholder="Mailing Address 4"
									value={this.state.mailing_address_4}
									onChangeText={(val) => this.onFieldChange({ value: val, name: 'mailing_address_4' })}
									maxLength={55}
									style={{marginBottom: -12}}
								/>
							</Item>

							<View style={styles.mb15}>
								<CountryPicker
									label="Mailing Address - Country / Region *"
									placeholder="Click to select (Required)"
									name="mailing_address_country"
									value={this.state.mailing_address_country}
									countries={countries}
									onFieldChange={(opt) => this.onFieldChange(opt)}
								/>
							</View>

							<View style={styles.mb15}>
								<CountryStatePicker
									label="Mailing Address - State"
									placeholder="Click to select"
									name="mailing_address_state"
									value={this.state.mailing_address_state}
									countries={countries}
									selectedCountryCode={this.state.mailing_address_country}
									onFieldChange={(opt) => this.onFieldChange(opt)}
								/>
							</View>

							<Item
								stackedLabel
								style={styles.mb15}
							>
								<Label>Postal Code</Label>
								<Input
									placeholderTextColor="#bfc6ea"
									rounded
									placeholder="Postal Code"
									value={this.state.postal_code}
									onChangeText={(val) => this.onFieldChange({ value: val, name: 'postal_code' })}
									maxLength={12}
									style={{marginBottom: -12}}
								/>
							</Item>

							<View style={styles.mb15}>
								<CountryPicker
									label="Current Location - Country / Region *"
									placeholder="Click to select (Required)"
									name="current_location_country"
									value={this.state.current_location_country}
									countries={countries}
									onFieldChange={(opt) => this.onFieldChange(opt)}
									style={styles.mb15}
								/>
							</View>

							<View style={styles.mb15}>
								<CountryStatePicker
									label="Current Location - State"
									placeholder="Click to select"
									name="current_location_state"
									value={this.state.current_location_state}
									countries={countries}
									selectedCountryCode={this.state.current_location_country}
									onFieldChange={(opt) => this.onFieldChange(opt)}
									style={styles.mb15}
								/>
							</View>

							<Item
								stackedLabel
								style={styles.mb15}
							>
								<Label>Current Location - City</Label>
								<Input
									placeholderTextColor="#bfc6ea"
									rounded
									placeholder="Current Location - City"
									value={this.state.current_location_city}
									onChangeText={(val) => this.onFieldChange({ value: val, name: 'current_location_city' })}
									maxLength={12}
									style={{marginBottom: -12}}
								/>
							</Item>
						</Form>
					</View>
					<View style={{flexDirection: 'row', justifyContent: 'center', width: '100%', paddingBottom: 65}}>
						<Button
							style={styles.submitButton}
							rounded
							block
							onPress={async () => this.updateMe()}
						>
							<Text style={styles.submitButtonText}>
								Confirm
							</Text>
						</Button>
					</View>
				</Content>
				<ProgressDialog
					visible={submitting}
					message="Loading..."
				/>
			</Container>
		);
	}
}

// custom styles
const styles = StyleSheet.create({
	screen: {
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	imageContainer: {
		marginTop: 30,
		shadowColor: 'rgba(0,0,0,0.15)',
		shadowOffset: {width: 0, height: 0},
		shadowRadius: 3,
		shadowOpacity: 1,
		elevation: 1
	},
	image: {
		width: 155,
		height: 155,
		borderRadius: 155 / 2
	},
	nameText: {
		textAlign: 'center',
		marginTop: 30,
		color: '#1E3E71',
		fontWeight: 'bold',
		fontSize: 20
	},
	studentNumberText: {
		marginTop: 5,
		color: '#9E9E9E',
		fontSize: 12
	},
	detailContainer: {
		marginTop: 30,
		marginBottom: 25,
		paddingTop: 20,
		paddingBottom: 39.5,
		width: '89.33333333%',
		backgroundColor: 'white',
		marginHorizontal: 20,
		borderRadius: 10,
		shadowColor: 'rgba(0,0,0,0.15)',
		shadowOffset: {width: 0, height: 0},
		shadowRadius: 2,
		shadowOpacity: 1,
		elevation: 1,
		paddingRight: 32,
		paddingLeft: 20
	},
	submitButton: {
		height: 38,
		backgroundColor: '#0B3366', // '#059A63'
		width: '85%',
		flexDirection: 'row',
		justifyContent: 'center'
	},
	submitButtonText: {
		fontSize: 12,
		color: '#FFFFFF',
		textAlign: 'center'
	},
	mb15: {
		marginBottom: 15
	}
});

export default EditProfilePage;

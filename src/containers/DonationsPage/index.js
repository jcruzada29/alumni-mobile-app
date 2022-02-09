import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, AsyncStorage } from 'react-native';
import { Card } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Loading from '../../components/UI/Loading';
import AsyncStorageKeys from '../../constants/AsyncStorageKeys';
import API from '../../lib/API';

class DonationsPage extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			donations: [],
			language: '',
			isFetchingDonations: false,
			disabled: false
		};
	}

	async componentDidMount(){
		this.setState({isFetchingDonations: true});
		const response = await API.donations.getDonations();
		const language = await AsyncStorage.getItem(AsyncStorageKeys.USER_LANGUAGE);
		const data = response && response.data ? response.data.donation_projects : [];
		this.setState({ donations: data, language, isFetchingDonations: false });
	}

	handlePressCard = donation =>{
		// this.setState({disabled: true});
		Actions.donationDetailPage({donationDetail: donation});
	}

	renderCard = donation => {
		const { language, disabled } = this.state;
		return(
			<Card>
				<View>
					<View>
						<TouchableOpacity
							disabled={disabled}
							onPress={() => Actions.donationDetailPage({donationDetail: donation})}
						>
							<Image
								source={{uri: donation.indexImage }}
								style={{
									height: 120,
									width: null,
									flex: 1,
									borderTopLeftRadius: 6,
									borderTopRightRadius: 6,
									overflow: 'visible'
								}}
								resizeMode="stretch"
							/>
						</TouchableOpacity>
					</View>
					<View style={{maxHeight: 55, padding: 10, height: 55}}>
						<SafeAreaView>
							<ScrollView
								nestedScrollEnabled={true}
								showsHorizontalScrollIndicator={false}
								showsVerticalScrollIndicator={false}
							>
								<View>
									<View>
										<Text style={{lineHeight: 16, fontSize: 14}}>
											{
												language !== 'en' ?
													donation.name.zh
													: donation.name.en
											}
										</Text>
									</View>
								</View>
							</ScrollView>
						</SafeAreaView>
					</View>
				</View>
			</Card>
		);
	}

	render(){
		const { donations, isFetchingDonations } = this.state;

		if(isFetchingDonations){
			return <Loading />;
		}

		return(
			<SafeAreaView>
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
						{
							donations.length && !isFetchingDonations ?
								donations.map((donation, index) => {
									return (
										<View
											key={index}
											style={{
												width: '50%',
												paddingTop: 5,
												paddingLeft: 5,
												paddingRight: 5
											}}
										>
											{this.renderCard(donation)}
										</View>
									);
								})
								: <Text>No data found</Text>
						}
					</View>
				</ScrollView>
			</SafeAreaView>
		);
	}
}

export default DonationsPage;
import React from 'react';
import { Text, View, Linking, AsyncStorage } from 'react-native';
import { Button, Container } from 'native-base';
import { Actions } from 'react-native-router-flux';
import WebView from 'react-native-webview';
import AsyncStorageKeys from '../../constants/AsyncStorageKeys';
import Loading from '../../components/UI/Loading';
import API from '../../lib/API';

class DonationDetailPage extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			hideLoadingIndicator: false,
			htmlContent: null,
			donateNowLink: ''
		};
	}

	async componentDidMount(){
		const { donationDetail } = this.props;
		const language = await AsyncStorage.getItem(AsyncStorageKeys.USER_LANGUAGE);
		const donationDetailById = await API.donations.getDonationsById({id: donationDetail.id, lang: language});
		if (donationDetailById.meta.code === 200) {
			this.setState({
				htmlContent: donationDetailById.data.donation_project.html,
				donateNowLink: donationDetailById.data.donation_project.donate_url,
				hideLoadingIndicator: true
			});
		}
	}

	hideLoading = () => {
		this.setState({hideLoadingIndicator: true});
	}

	handleBtnDonateNow = () => {
		const { donateNowLink } = this.state;
		Actions.donateNowPage({donateNowLink});
	}

	render(){

		const { hideLoadingIndicator, htmlContent } = this.state;

		if(!hideLoadingIndicator || (!htmlContent && htmlContent === null && htmlContent === undefined)){
			return <Loading />;
		}

		return(
			<Container style={{backgroundColor: '#FFFFFF'}}>
				<WebView
					source={{html: htmlContent}}
					javaScriptEnabled={true}
					onLoad={this.hideLoading}
					style={{ marginLeft: 18, marginTop: -92}}
					containerStyle={{display: 'flex', flexDirection: 'row' }}
					onShouldStartLoadWithRequest={event => {
						if (event.url !== 'about:blank') {
							Linking.openURL(event.url);
							return false;
						}
						return true;
					}}
				/>
				<View style={{margin: 13}}>
					<Button
						rounded
						style={{
							backgroundColor: '#059a63',
							height: 40,
							marginBottom: 20
						}}
						block
						onPress={this.handleBtnDonateNow}
					>
						<Text style={{color: 'white', fontSize: 17, textAlign: 'center'}}>
							Donate Now
						</Text>
					</Button>
				</View>
			</Container>
		);
	}
}

export default DonationDetailPage;
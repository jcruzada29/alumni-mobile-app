import React from 'react';
import { WebView } from 'react-native-webview';
import { Container, Text } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { View, ActivityIndicator } from 'react-native';
import _ from 'lodash';
import AlertUtility from '../../lib/AlertUtility';
import API from '../../lib/API';
import Loading from '../../components/UI/Loading';
import GeneralHelper from '../../lib/general';

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

class PaymentPage extends React.Component {
	constructor() {
		super();
		// this.state = { error: null, success: null, loading: false };
		this.state = {
			loading: false
		};
	}

	componentDidMount(){
		if (!this.props.url) {
			AlertUtility.show('ERROR', 'No Payment Redirect URL found');
			this.navigateBackToDetailPage();
		}
	}

	navigateBackToDetailPage = () => {
		Actions.pop({ refresh: { event: this.props.event, enterTime: new Date() } });
	}

	getTransactionId = (navigateURL) => {
		if (navigateURL) {
			const transaction =  GeneralHelper.getParameterByName('transaction_id', navigateURL);
			return transaction;
		}
		return null;
	}

	checkUrlState = async (navigateURL) => {
		if (navigateURL.includes('callback/jr_upg/success')) {
			const transaction_id = this.getTransactionId(navigateURL);
			if (!transaction_id) {
				AlertUtility.show('ERROR', 'No Transaction ID found');
				this.navigateBackToDetailPage();
				return;
			}
			// JR_UPG
			this.setState({
				loading: true
			});
			const response = await API.transactions.status(transaction_id);
			if (response.meta.code !== 200) {
				AlertUtility.show('ERROR', _.get(response, 'meta.message'));
				this.navigateBackToDetailPage();
				this.setState({ loading: false });
				return;
			}
			// const { transaction } = response.data;

			AlertUtility.show('',  _.get(response, 'meta.message'));
			this.navigateBackToDetailPage();
			// if (transaction.status === 'paid') {
			// 	Actions.pop({ transaction });
			// 	// dispatch(push('/payment/success'));
			// } else {
			// 	Actions.pop({ transaction });
			// 	// dispatch(push('/payment/failure'));
			// }
			// code to hide WebView
		}  else if (navigateURL.includes('callback/jsup/success')) {
			// JSUPlet transaction;
			const transaction_id = this.getTransactionId(navigateURL);
			if (!transaction_id) {
				AlertUtility.show('ERROR', 'No Transaction ID found');
				this.navigateBackToDetailPage();
				return;
			}
			this.setState({
				loading: true
			});
			let transaction;
			for (let i = 0; i < 100; i++) {
				await sleep(1500);

				const response = await API.transactions.getTransactionById(transaction_id);
				// something wrong
				if (response.meta.code !== 200) {
					AlertUtility.show('ERROR', _.get(response, 'meta.message'));
					this.navigateBackToDetailPage();
					this.setState({ loading: false });
					return;
				}

				transaction = response.data.transaction;

				// handle paid case
				if (transaction.status === 'paid') {
					// Success page.. Navigate
					AlertUtility.show('', 'Paid');
					this.navigateBackToDetailPage();
					this.setState({
						loading: false
					});
					return;
				}

				// handle cancelled case
				if (transaction.status === 'cancelled') {
					// navigate to failure payment
					AlertUtility.show('', 'Cancelled');
					this.navigateBackToDetailPage();
					this.setState({
						loading: false
					});
					return;
				}
			}
		}
	}

	render() {
		const { loading } = this.state;
		const { url } = this.props;
		if (loading) {
			return(
				<Container style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 20 }}>Payment Processing</Text>
					<ActivityIndicator
						size="large"
						// color={Colors.brandPrimary}
						color="#0B3366"
					/>
				</Container>
			);
		}
		if (url) {
			return(
				<Container>
					<WebView
						source={{ uri: url }}
						onNavigationStateChange={state => this.checkUrlState(state.url)}
					/>
				</Container>
			);
		}
		return (
			<Loading />
		);

	}
}

// const PaymentPage = ({ url }) => {

// 	const checkUrlState = (navigateURL) => {
// 		console.log({ navigateURL });
// 		if (navigateURL.includes('callback/jr_upg/success')) {
// 			// JR_UPG
// 			console.log('successss');
// 		  // code to hide WebView
// 		}  else if (navigateURL.includes('callback/jsup/success')) {
// 			// JSUP
// 		}
// 	};

// 	return (
// 		<Container>
// 			<WebView
// 				source={{ uri: url }}
// 				onNavigationStateChange={state => checkUrlState(state.url)}
// 			/>
// 		</Container>
// 	);
// };

export default PaymentPage;
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';
import {
	Container
} from 'native-base';

class PrivacyPage extends Component {
	constructor() {
		super();
		// this.state = { error: null, success: null, loading: false };
		this.state = {};
	}

	/**
	 * On Form Submission
	 */
	// onFormSubmit = async (data) => {
	// 	const { onFormSubmit } = this.props;

	// 	this.setState({ success: null, error: null, loading: true });

	// 	try {
	// 		const success = await onFormSubmit(data);
	// 		this.setState({ success, error: null, loading: false });
	// 	} catch (error) {
	// 		this.setState({ loading: false, success: null, error: error.message });
	// 	}
	// }

	/**
	 * Render
	 */
	render = () => {
		// const { userInput } = this.props;
		// const { error, loading, success } = this.state;

		return (
			<Container>
				<WebView
					startInLoadingState
					source={{ uri: 'https://dataprivacy.ust.hk/university-data-privacy-policy-statement/' }}
				/>
			</Container>
		);
	}
}

export default PrivacyPage;

// PrivacyPage.propTypes = {
// 	userInput: PropTypes.shape({}).isRequired,
// 	onFormSubmit: PropTypes.func.isRequired
// };

// const mapStateToProps = (state) => ({
// });

// const mapDispatchToProps = (dispatch) => ({
// });

// export default connect(mapStateToProps, mapDispatchToProps)(PrivacyPage);

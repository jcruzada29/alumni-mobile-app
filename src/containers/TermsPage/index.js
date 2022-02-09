import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';
import {
	Container
} from 'native-base';

class TermsPage extends Component {
	constructor() {
		super();
		this.state = {};
	}

	render() {
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

export default TermsPage;

// TermsPage.propTypes = {
// };

// const mapStateToProps = (state) => ({
// });

// const mapDispatchToProps = (dispatch) => ({
// });

// export default connect(mapStateToProps, mapDispatchToProps)(TermsPage);

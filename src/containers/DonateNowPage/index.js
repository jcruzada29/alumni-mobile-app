import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';
import {
	Container
} from 'native-base';
import Loading from '../../components/UI/Loading';

class DonateNowPage extends Component {
	constructor() {
		super();
		// this.state = { error: null, success: null, loading: false };
		this.state = {};
	}
    
	render = () => {

		const { donateNowLink } = this.props;
        
		if(donateNowLink === '' || donateNowLink === undefined || donateNowLink === null) {
			return <Loading />;
		}

		return (
			<Container>
				<WebView
					onLoad={this.hideLoading}
					source={{ uri: donateNowLink }}
				/>
			</Container>
		);
	}
}

export default DonateNowPage;

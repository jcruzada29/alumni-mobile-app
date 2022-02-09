import React, { Component } from 'react';
import WebView from 'react-native-webview';
import { Container } from 'native-base';


class CardImagePage extends Component {
	componentDidMount() {
		const {selectedEcard: { service_name }} = this.props;
		this.props.navigation.setParams({
			title: service_name
		});
	}

	render() {
		const { selectedEcard: {ecard_html} } = this.props;
		return (
			<Container>
				<WebView
					source={{html: ecard_html}}
					style={{ flex: 1 }} 
				/>
			</Container>
		);
	}
};

export default CardImagePage;

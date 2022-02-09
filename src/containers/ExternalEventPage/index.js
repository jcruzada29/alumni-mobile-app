import React from 'react';
import { WebView } from 'react-native-webview';
import { Container } from 'native-base';

const ExternalEventPage = ({ url }) => (
	<Container>
		<WebView
			source={{ uri: url }}
		/>
	</Container>
);

export default ExternalEventPage;
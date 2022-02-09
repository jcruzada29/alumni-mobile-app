import React from 'react';
import { WebView } from 'react-native-webview';
import { Container } from 'native-base';

const TranscriptPage = () => (
	<Container>
		<WebView
			startInLoadingState
			source={{ uri: 'https://alum.ust.hk/services-and-benefits/diploma-and-transcript' }}
		/>
	</Container>
);

export default TranscriptPage;
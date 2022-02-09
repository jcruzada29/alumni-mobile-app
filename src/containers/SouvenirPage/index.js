import React from 'react';
import { WebView } from 'react-native-webview';
import { Container } from 'native-base';

const SouvenirPage = () => (
	<Container>
		<WebView
			source={{ uri: 'https://souvenir.ust.hk/' }}
		/>
	</Container>
);

export default SouvenirPage;

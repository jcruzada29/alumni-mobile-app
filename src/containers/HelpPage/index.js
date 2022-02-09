import React from 'react';
import { WebView } from 'react-native-webview';
import { Container } from 'native-base';

const HelpPage = () => (
	<Container>
		<WebView
			source={{ uri: 'https://alum.hkust.edu.hk/about-us/contact-us' }}
		/>
	</Container>
);

export default HelpPage;
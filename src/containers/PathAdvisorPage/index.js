import React from 'react';
import { WebView } from 'react-native-webview';
import { Container } from 'native-base';

const PathAdvisorPage = () => (
	<Container>
		<WebView
			source={{ uri: 'https://pathadvisor.ust.hk/' }}
		/>
	</Container>
);

export default PathAdvisorPage;
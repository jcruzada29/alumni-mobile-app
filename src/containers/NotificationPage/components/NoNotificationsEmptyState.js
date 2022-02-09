


import React from 'react';
import { Container, H2 } from 'native-base';
import { Image } from 'react-native';

import Logo from '../../../images/empty_state/no_notifications.png';

const NoNotificationsEmptyState = () => {
	return(
		<Container
			style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' }}
		>
			<Image
				style={{ width: '100%', resizeMode: 'contain', height: 180 }}
				source={Logo}
			/>
			<H2 style={{ color: '#141616', marginTop: 40, fontSize: 20, fontWeight: '600', lineHeight: 24, letterSpacing: 0 }}>No notifications</H2>
		</Container>
	);
};


export default NoNotificationsEmptyState;
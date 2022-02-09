import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, H2, Text, Button } from 'native-base';
import Logo from '../../images/empty_state/ecard.png';

class LoginRequiredEmptyStatePage extends Component {
	constructor() {
		super();
		this.state = {};
	}

	componentDidMount() {
	}

	render() {
		return (
			<Container
				style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' }}
			>
				<Image
					style={{ width: '100%', resizeMode: 'contain', height: 290 }}
					source={Logo}
				/>
				<H2 style={{ color: '#141616', marginTop: 24, fontSize: 20, fontWeight: '600', lineHeight: 24, letterSpacing: 0 }}>Login to view this page</H2>

				{/* <Text style={{ width: 351, textAlign: 'center', color: '#828282', marginTop: 20, fontSize: 17, fontWeight: 'normal', letterSpacing: 0 }}>Please login to view this page.</Text> */}

				<View style={{ paddingLeft: 20, paddingRight: 20, marginTop: 20, width: '100%' }}>
					<Button
						success
						full
						rounded
						onPress={() => Actions.casLoginPage()}
					>
						<Text style={{fontWeight: 'bold'}}>Login</Text>
					</Button>
				</View>
			</Container>
		);
	};
};

export default LoginRequiredEmptyStatePage;

import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'native-base';
import AnimatedTabBar, {TabsConfig, MaterialTabBarItemConfig} from '@gorhom/animated-tabbar';
import HomePage from '../../containers/HomePage';
import MePage from '../../containers/MePage';
import NotificationPage from '../../containers/NotificationPage';
import LoginRequiredEmptyStatePage from '../../containers/LoginRequiredEmptyStatePage';


const tabs: TabsConfig<MaterialTabBarItemConfig> = {
	Home: {
		icon: {
			component: (props: any) => (
				<Icon
					type="MaterialIcons"
					name="home"
					style={{color: '#fff'}}
				/>
			),
			color: 'rgba(255,255,255,1)'
		},
		ripple: {
			color: '#003366'
		},
		labelStyle: {
			color: '#fff'
		}
	},
	Notifications: {
		icon: {
			component: (props: any) => (
				<Icon
					type="MaterialIcons"
					name="notifications-active"
					style={{color: '#fff'}}
				/>
			),
			color: 'rgba(255,255,255,1)'
		},
		ripple: {
			color: '#003366'
		},
		labelStyle: {
			color: '#fff'
		}
	},
	Me: {
		icon: {
			component: (props: any) => (
				<Icon
					type="FontAwesome"
					name="user"
					style={{color: '#fff'}}
				/>
			),
			color: 'rgba(255,255,255,1)'
		},
		ripple: {
			color: '#003366'
		},
		labelStyle: {
			color: '#fff'
		}
	}
};


const Tab = createBottomTabNavigator();

class TabBar extends Component {
	render() {
		return (
			<NavigationContainer>
				<Tab.Navigator
					tabBar={props => {
						return <AnimatedTabBar
							preset="material"
							tabs={tabs}
							{...props}
							iconSize={24}
							animation="iconWithLabelOnFocus"
						/>;
					}}
				>
					<Tab.Screen
						name="Home"
						component={HomePage}
					/>
					<Tab.Screen
						name="Notifications"
						component={this.props.isLoggedIn ? NotificationPage : LoginRequiredEmptyStatePage}
					/>
					<Tab.Screen
						name="Me"
						component={this.props.isLoggedIn ? MePage : LoginRequiredEmptyStatePage}
					/>
				</Tab.Navigator>
			</NavigationContainer>
		);
	}
};

export default TabBar;
import React, { Component } from 'react';
import { StyleSheet, Text, Image, View, Alert, TouchableOpacity } from 'react-native';
import { Container, Content, Form, Label, Item, Input, Button } from 'native-base';
import { ProgressDialog } from 'react-native-simple-dialogs';
import RNRestart from 'react-native-restart';
import ImageCropper from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-modal';
import API from '../../lib/API';
import AlertUtility from '../../lib/AlertUtility';
import Loading from '../../components/UI/Loading';
import PlaceholderImage from '../../images/placeholder/camera.png';


class UploadProfileImagePage extends Component {
	constructor() {
		super();
		this.state = {
			// first load page
			loading: false,
			submitting: false,
			user: null,
			photo: null,
			showModal: false,
			isUploadSuccess: false
		};
	}

	async componentDidMount() {
		await this.getMe();
	}

	async getMe() {
		this.setState({ loading: true });
		const res = await API.users.getMe();
		if (res.meta.code !== 200) {
			AlertUtility.show('ERROR', res.meta.message);
			this.setState({ loading: false });
			return;
		}
		const { user } = res.data;
		this.setState({
			loading: false,
			user
		});
	}

	async onSubmitButtonClicked() {
		// Alert.alert(
		// 	'Alert \n' +
		// 	'This Alum eCard will serve as your official and lifelong alumni identity. \n',
		// 	'1. Please upload your PASSPORT PHOTO which must show your full frontal face with clear facial features against a plain background. \n' +
		// 	'2. Once confirmed, the photo cannot be changed or altered.',
		// 	[
		// 		{
		// 			text: 'Cancel',
		// 			onPress: () => {},
		// 			style: 'cancel'
		// 		},
		// 		{
		// 			text: 'OK',
		// 			onPress: async () => {
		// 				await this.uploadPhoto();
		// 			}
		// 		}
		// 	],
		// 	{ cancelable: false }
		// );
		this.openModal();
	}

	async uploadPhoto() {
		this.setState({ submitting: true });
		const updateRes = await API.users.uploadPhoto({
			photo: this.state.photo
		});

		if (updateRes.meta.code !== 200) {
			AlertUtility.show('ERROR', 'Please upload again or try to upload another photo.');
			this.setState({ submitting: false, isUploadSuccess: false });
			return;
		}

		this.setState({ submitting: false, isUploadSuccess: true });

		setTimeout(() => {
			Alert.alert(
				'',
				'Your profile picture has been uploaded',
				[{
					text: 'OK',
					onPress: async () => {
						RNRestart.Restart();
					}
				}],
				{ cancelable: false }
			);
		}, 200);
	}


	async handleOnCompleteShowImagePicker(response) {
		// cancelled
		if (response.didCancel) {
			return;
		}

		// Crop Image
		const image = await ImageCropper.openCropper({
			path: response.uri,
			width: 1500 / 2,
			height: 2000 / 2,
			includeBase64: true,
			cropperCircleOverlay: true,
			avoidEmptySpaceAroundImage: false
		});

		// Image
		this.setState({
			photo: image.data
		});
	}

	async onClickImage() {
		ImagePicker.showImagePicker(
			{ maxHeight: 2500 / 2 },
			response => this.handleOnCompleteShowImagePicker(response)
		);
	}

	closeModal = () => {
		this.setState({ showModal: false });
	}

	openModal = () => {
		this.setState({ showModal: true });
	}

	confirmUpload = async () => {
		this.closeModal();
		await this.uploadPhoto();
	}

	render = () => {
		const {
			loading,
			submitting,
			user,
			photo,
			showModal,
			isUploadSuccess
		} = this.state;

		if (!user || loading) {
			return (<Container><Loading /></Container>);
		}

		return (
			<Container>
				<Content>
					<View>
						<Modal
							isVisible={showModal}
							animationOut="fadeOut"
							style={{flex: 1, alignItems: 'center'}}
						>
							<View style={{width: 350, height: 250, backgroundColor: 'white', borderRadius: 10, padding: 15}}>
								<View style={{display: 'flex', flexDirection: 'column'}}>
									<View>
										<Text style={{fontWeight: 'bold', fontSize: 21, textAlign: 'center'}}>Alert</Text>
									</View>
									<View>
										<Text style={{fontWeight: 'bold', fontSize: 18, marginTop: 10}}>
											This Alum eCard will serve as your official and lifelong alumni identity.
										</Text>
									</View>
									<View style={{marginTop: 15}}>
										<Text>
											1. Please upload your PASSPORT PHOTO which must show your full frontal face with clear facial features against a plain background.
										</Text>
									</View>
									<View>
										<Text>
											2. Once confirmed, the photo cannot be changed or altered.
										</Text>
									</View>
									<View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
										<Button
											onPress={this.closeModal}
											transparent
											style={{marginRight: 20}}
										>
											<Text style={{fontSize: 18}}>
												Cancel
											</Text>
										</Button>
										<Button
											transparent
											style={{marginRight: 15}}
											onPress={this.confirmUpload}
										>
											<Text style={{fontSize: 18}}>
												Ok
											</Text>
										</Button>
									</View>
								</View>
							</View>
						</Modal>
					</View>
					<View style={styles.screen}>
						<TouchableOpacity
							disabled={submitting || isUploadSuccess}
							onPress={() => this.onClickImage()}
						>
							<View style={styles.imageContainer}>
								<Image
									source={photo ? { uri: `data:image/jpg;base64,${photo}`} : PlaceholderImage}
									style={styles.image}
								/>
							</View>
						</TouchableOpacity>
					</View>
					<View style={styles.detailContainer}>
						<Form>
							<Item stackedLabel>
								<Label>Last Name</Label>
								<Input
									placeholderTextColor="#bfc6ea"
									rounded
									placeholder="Last Name"
									value={user.last_name}
									disabled
									style={{marginBottom: -15}}
								/>
							</Item>
							<Item stackedLabel>
								<Label>First Name</Label>
								<Input
									placeholderTextColor="#bfc6ea"
									rounded
									placeholder="First Name"
									value={user.first_name}
									disabled
									style={{marginBottom: -15}}
								/>
							</Item>
						</Form>
					</View>
					<View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 30}}>
						<Button
							style={[styles.submitButton, { backgroundColor: photo ? '#0B3366' : '#999' }]}
							rounded
							block
							onPress={async () => this.onSubmitButtonClicked()}
							disabled={!photo || submitting || isUploadSuccess}
						>
							<Text style={styles.submitButtonText}>
								{isUploadSuccess ? 'Uploaded' : 'Upload'}
							</Text>
						</Button>
					</View>
				</Content>
				<ProgressDialog
					visible={submitting}
					message="Loading..."
				/>
			</Container>
		);
	}
}

// custom styles
const styles = StyleSheet.create({
	screen: {
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	imageContainer: {
		marginTop: 30,
		shadowColor: 'rgba(0,0,0,0.15)',
		shadowOffset: {width: 0, height: 0},
		shadowRadius: 3,
		shadowOpacity: 1,
		borderRadius: 155 / 2,
		overflow: 'hidden',
		zIndex: -99
	},
	image: {
		width: 155,
		height: 155,
		backgroundColor: 'white'
	},
	detailContainer: {
		marginTop: 30,
		marginBottom: 35,
		paddingTop: 10,
		paddingBottom: 39.5,
		width: '89.33333333%',
		backgroundColor: 'white',
		marginHorizontal: 20,
		borderRadius: 10,
		shadowColor: 'rgba(0,0,0,0.15)',
		shadowOffset: { width: 0, height: 0 },
		shadowRadius: 2,
		shadowOpacity: 1,
		elevation: 1,
		padding: 15
	},
	submitButton: {
		height: 38,
		width: '85%'
	},
	submitButtonText: {
		fontSize: 12,
		color: '#FFFFFF',
		textAlign: 'center'
	}
});

export default UploadProfileImagePage;

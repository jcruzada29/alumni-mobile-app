
const GeneralHelper = {
	getParameterByName(name, url) {
		const new_name = name.replace(/[\[\]]/g, '\\$&');
		const regex = new RegExp(`[?&]${  new_name  }(=([^&#]*)|&|#|$)`);
		const results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}
};

export default GeneralHelper;

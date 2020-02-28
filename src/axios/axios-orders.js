import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://the-burger-builder-no-auth.firebaseio.com/'
});

export default instance;
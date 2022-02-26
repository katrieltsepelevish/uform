import axios from 'axios';

import { config } from './config';

let headers: any = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
};

axios.defaults.withCredentials = true;

const client = axios.create({
	baseURL: config.apiUrl,
	headers,
});

export default client;

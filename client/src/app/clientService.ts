import client from '../client';

let clientService: any = null;

class ClientService {
	private token: any;

	constructor() {
		/* Get token from localStorage since user already authorized on first initialize not through login / register */
		this.token = localStorage.getItem('token') || null;
	}

	setToken(token: any) {
		/* Set token on login / register to avoid page refresh for localStorage to update */
		this.token = token;
		localStorage.setItem('token', this.token);
	}

	login(email: any, password: any) {
		const headers = { Authorization: `Bearer ${this.token}` };

		return client.post(
			'/auth/login',
			{
				email,
				password,
			},
			{ headers },
		);
	}

	register(name: any, email: any, password: any) {
		const headers = { Authorization: `Bearer ${this.token}` };

		return client.post(
			'/auth/register',
			{
				name,
				email,
				password,
			},
			{ headers },
		);
	}

	createForm(name: any) {
		const headers = { Authorization: `Bearer ${this.token}` };

		return client.post('/form', { name }, { headers });
	}

	addField(name: any, label: any, type: any, required: any, formId: any) {
		const headers = { Authorization: `Bearer ${this.token}` };

		return client.post(
			`/form/${formId}/field`,
			{ name, label, type, required },
			{ headers },
		);
	}

	submitForm(formData: any, formId: any) {
		const headers = { Authorization: `Bearer ${this.token}` };

		return client.post(`/form/${formId}/submit`, formData, { headers });
	}

	getForm(id: any) {
		const headers = { Authorization: `Bearer ${this.token}` };

		return client.get(`/form/${id}`, { headers });
	}

	getAllForms() {
		const headers = { Authorization: `Bearer ${this.token}` };
		return client.get('/form', { headers });
	}
}

const getClientService = () => {
	if (!clientService) {
		clientService = new ClientService();
	}

	return clientService;
};

export default getClientService();

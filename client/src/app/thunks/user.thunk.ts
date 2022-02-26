import { Dispatch } from 'redux';

import clientService from '../clientService';
import {
	USER_ERROR,
	USER_LOGIN,
	USER_LOGOUT,
	USER_REGISTER,
} from '../constants/user.constants';

export const login =
	(email: any, password: any) => async (dispatch: Dispatch) => {
		if (!email || !password)
			return dispatch({
				type: USER_ERROR,
				payload: 'Wrong Credentials.',
			});

		try {
			const { data }: any = await clientService.login(email, password);

			const { token } = data;

			clientService.setToken(token);

			return dispatch({ type: USER_LOGIN, payload: token });
		} catch (error: any) {
			const { data } = error.response;

			return dispatch({
				type: USER_ERROR,
				payload: data,
			});
		}
	};

export const register =
	(name: any, email: any, password: any) => async (dispatch: Dispatch) => {
		if (!email || !password)
			return dispatch({
				type: USER_ERROR,
				payload: 'Email and password are required!',
			});

		try {
			const { data }: any = await clientService.register(
				name,
				email,
				password,
			);

			const { token } = data;

			clientService.setToken(token);

			return dispatch({ type: USER_REGISTER, payload: data });
		} catch (error: any) {
			const { data } = error.response;

			return dispatch({
				type: USER_ERROR,
				payload: data,
			});
		}
	};

export const logout = () => (dispatch: Dispatch) => {
	return dispatch({ type: USER_LOGOUT });
};

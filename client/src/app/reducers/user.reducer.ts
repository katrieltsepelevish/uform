import {
	USER_ERROR,
	USER_LOGIN,
	USER_LOGOUT,
	USER_REGISTER,
} from '../constants/user.constants';

const INITIAL_STATE = {
	id: null,
	name: null,
	email: null,
	token: null,
	error: null,
};

const userReducer = (state = INITIAL_STATE, action: any) => {
	switch (action.type) {
		case USER_REGISTER: {
			return {
				...action.payload,
			};
		}
		case USER_LOGIN: {
			return {
				...state,
				token: action.payload,
			};
		}
		case USER_LOGOUT: {
			localStorage.removeItem('token');

			return {
				id: null,
				name: null,
				email: null,
				token: null,
				error: null,
			};
		}
		case USER_ERROR: {
			return {
				...state,
				error: action.payload,
			};
		}
		default: {
			return state;
		}
	}
};

export default userReducer;

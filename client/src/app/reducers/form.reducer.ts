import {
	FORM_ADD_FIELD,
	FORM_CREATE,
	FORM_ERROR,
	FORM_GET_ALL,
	FORM_GET_ONE,
	FORM_SUBMIT,
} from '../constants/form.constants';

const INITIAL_STATE = {
	_id: null,
	name: null,
	fields: [],
	submissions: [],
	list: [],
	error: null,
};

const formReducer = (state = INITIAL_STATE, action: any) => {
	switch (action.type) {
		case FORM_GET_ALL: {
			return {
				...state,
				list: action.payload,
			};
		}
		case FORM_GET_ONE: {
			return {
				...state,
				...action.payload,
			};
		}
		case FORM_CREATE: {
			return {
				...state,
				...action.payload,
			};
		}
		case FORM_SUBMIT: {
			return {
				...state,
				submissions: [...state.submissions, { ...action.payload }],
			};
		}
		case FORM_ADD_FIELD: {
			return {
				...state,
				fields: [...state.fields, { ...action.payload }],
			};
		}
		case FORM_ERROR: {
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

export default formReducer;

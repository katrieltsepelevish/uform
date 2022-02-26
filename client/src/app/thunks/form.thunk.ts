import { Dispatch } from 'redux';

import clientService from '../clientService';

import {
	FORM_ADD_FIELD,
	FORM_CREATE,
	FORM_ERROR,
	FORM_GET_ALL,
	FORM_GET_ONE,
	FORM_SUBMIT,
} from '../constants/form.constants';

export const getAll = () => async (dispatch: Dispatch) => {
	try {
		const { data } = await clientService.getAllForms();

		return dispatch({ type: FORM_GET_ALL, payload: data });
	} catch (error: any) {
		const { data } = error.response;

		return dispatch({ type: FORM_ERROR, payload: data });
	}
};

export const get = (id: any) => async (dispatch: Dispatch) => {
	try {
		const { data } = await clientService.getForm(id);

		return dispatch({ type: FORM_GET_ONE, payload: data });
	} catch (error: any) {
		const { data } = error.response;

		return dispatch({ type: FORM_ERROR, payload: data });
	}
};

export const addField =
	(name: any, label: any, type: any, required: any, formId: any) =>
	async (dispatch: Dispatch) => {
		try {
			const { data } = await clientService.addField(
				name,
				label,
				type,
				required,
				formId,
			);

			return dispatch({ type: FORM_ADD_FIELD, payload: data });
		} catch (error: any) {
			const { data } = error.response;

			return dispatch({ type: FORM_ERROR, payload: data });
		}
	};

export const submitForm =
	(formData: any, formId: any) => async (dispatch: Dispatch) => {
		try {
			const { data } = await clientService.submitForm(formData, formId);

			dispatch({ type: FORM_SUBMIT, payload: data });

			return data;
		} catch (error: any) {
			const { data } = error.response;

			return dispatch({ type: FORM_ERROR, payload: data });
		}
	};

export const create = (name: any) => async (dispatch: Dispatch) => {
	try {
		const { data } = await clientService.createForm(name);

		dispatch({ type: FORM_CREATE, payload: data });

		return data;
	} catch (error: any) {
		const { data } = error.response;

		return dispatch({ type: FORM_ERROR, payload: data });
	}
};

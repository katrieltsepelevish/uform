import { combineReducers } from 'redux';

import userReducer from './user.reducer';
import formReducer from './form.reducer';

const reducers = {
	user: userReducer,
	form: formReducer,
};

export default combineReducers(reducers);

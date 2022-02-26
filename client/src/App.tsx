import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AddFormPage from './pages/AddFormPage';
import EditFormPage from './pages/EditFormPage';
import FormsPage from './pages/FormsPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/RegisterPage';
import SubmissionsPage from './pages/SubmissionsPage';
import ViewFormPage from './pages/ViewFormPage';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<FormsPage />} />
				<Route path='/add' element={<AddFormPage />} />
				<Route path='/edit/:id' element={<EditFormPage />} />
				<Route path='/view/:id' element={<ViewFormPage />} />
				<Route path='/submissions/:id' element={<SubmissionsPage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/register' element={<RegisterPage />} />
				<Route path='*' element={<NotFoundPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;

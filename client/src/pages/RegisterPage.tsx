import React, { FC } from 'react';
import { connect } from 'react-redux';

import Joi from 'joi';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';

import { register } from '../app/thunks/user.thunk';
import { Navigate } from 'react-router-dom';

type Props = {
	token: string;
	error: any;
	registerUser: Function;
};

const schema = Joi.object().keys({
	name: Joi.string(),
	email: Joi.string()
		.required()
		.email({ tlds: { allow: false } }),
	password: Joi.string().required(),
});

const RegisterPage: FC<Props> = ({ token, error, registerUser }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: joiResolver(schema),
	});

	if (localStorage.getItem('token') || token) {
		return <Navigate to={'/'} replace />;
	}

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100'>
			<div className='px-8 py-6 m-4 text-left bg-white shadow-lg w-[400px]'>
				<h3 className='text-2xl font-bold text-center'>
					Register new account
				</h3>
				<form noValidate>
					<div className='mt-4'>
						<div>
							<label className='block'>Name</label>
							<input
								type='text'
								placeholder='Name'
								className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600'
								{...register('name')}
							/>
							{errors.name && (
								<span className='text-xs tracking-wide text-red-600'>
									{errors.name.message}
								</span>
							)}
						</div>
						<div className='mt-4'>
							<label className='block'>Email</label>
							<input
								type='text'
								placeholder='Email'
								className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600'
								{...register('email')}
							/>
							{errors.email && (
								<span className='text-xs tracking-wide text-red-600'>
									{errors.email.message}
								</span>
							)}
						</div>
						<div className='mt-4'>
							<label className='block'>Password</label>
							<input
								type='password'
								placeholder='Password'
								className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600'
								{...register('password')}
							/>
							{errors.password && (
								<span className='text-xs tracking-wide text-red-600'>
									{errors.password.message}
								</span>
							)}
						</div>
						<div className='flex items-baseline justify-between'>
							<button
								type='submit'
								onClick={handleSubmit(
									({ name, email, password }) =>
										registerUser(name, email, password),
								)}
								className='px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900'
							>
								Register
							</button>
						</div>
						{error && (
							<span className='text-xs tracking-wide text-red-600 mt-4 block'>
								{error.message}
							</span>
						)}
					</div>
				</form>
			</div>
		</div>
	);
};

const mapStateToProps = (state: any) => ({
	token: state.user.token,
	error: state.user.error,
});

const mapDispatchToProps = (dispatch: any) => ({
	registerUser: (name: any, email: any, password: any) =>
		dispatch(register(name, email, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);

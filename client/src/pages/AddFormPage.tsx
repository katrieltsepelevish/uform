import React, { FC } from 'react';
import { connect } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

import Joi from 'joi';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';

import { Layout } from '../template/Layout';
import { create } from '../app/thunks/form.thunk';

type Props = {
	user: any;
	error: any;
	createForm: Function;
};

const schema = Joi.object().keys({
	name: Joi.string().required(),
});

const AddFormPage: FC<Props> = ({ user, error, createForm }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: joiResolver(schema),
	});

	const navigate = useNavigate();

	const token = localStorage.getItem('token') || user.token;

	if (!token) {
		return <Navigate to={'/login'} replace />;
	}

	return (
		<Layout>
			<div className='px-8 py-6 m-4 text-left bg-white shadow-lg w-[800px]'>
				<div className='flex flex-col'>
					<h3 className='text-2xl my-4 font-bold'>Form</h3>
					<form noValidate>
						<div className='mb-4'>
							<label className='block text-gray-700 text-sm font-bold mb-2'>
								Name
							</label>
							<input
								className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
								type='text'
								{...register('name')}
							/>
							{errors.name && (
								<span className='text-xs tracking-wide text-red-600'>
									{errors.name.message}
								</span>
							)}
						</div>
						<button
							className='bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline'
							type='button'
							onClick={handleSubmit(async ({ name }) => {
								const form = await createForm(name);

								if (form) return navigate(`/edit/${form._id}`);
							})}
						>
							Create
						</button>
						{error && (
							<span className='text-xs tracking-wide text-red-600 mt-4 block'>
								{error.message}
							</span>
						)}
					</form>
				</div>
			</div>
		</Layout>
	);
};

const mapStateToProps = (state: any) => ({
	user: state.user,
	error: state.form.error,
});

const mapDispatchToProps = (dispatch: any) => ({
	createForm: (name: any) => dispatch(create(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddFormPage);

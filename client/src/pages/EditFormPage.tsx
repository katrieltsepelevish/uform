import React, { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Navigate, useParams } from 'react-router-dom';

import Joi from 'joi';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';

import { Layout } from '../template/Layout';
import { addField, get } from '../app/thunks/form.thunk';

type Props = {
	user: any;
	form: any;
	error: any;
	addFieldToForm: Function;
	getForm: Function;
};

const schema = Joi.object().keys({
	name: Joi.string().required(),
	label: Joi.string().lowercase().trim().replace(/\s/g, '').required(),
	type: Joi.required().valid('text', 'email', 'tel', 'number', 'date'),
	required: Joi.boolean().required(),
});

const AddFormPage: FC<Props> = ({
	user,
	form,
	error,
	getForm,
	addFieldToForm,
}) => {
	const [isInitiallyMounted, setIsInitiallyMounted] = useState(false);

	const { id } = useParams();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: joiResolver(schema),
	});

	useEffect(() => {
		(async () => {
			await getForm(id);

			setIsInitiallyMounted(true);
		})();
	}, []);

	const token = localStorage.getItem('token') || user.token;

	if (!token) {
		return <Navigate to={'/login'} replace />;
	}

	if (!isInitiallyMounted) {
		return <div>Loading...</div>;
	}

	return (
		<Layout>
			<div className='px-8 py-6 m-4 text-left bg-white shadow-lg w-[800px]'>
				<div className='flex flex-col'>
					<h3 className='text-2xl my-4 font-bold'>
						Form
						<small className='ml-2 font-light text-md text-gray-500'>
							(#{form._id})
						</small>
					</h3>
					<div className='block'>
						<div className='mb-4'>
							<label className='block text-gray-700 text-sm font-bold mb-2'>
								Name
							</label>
							<input
								className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
								type='text'
								value={form.name}
								disabled
							/>
						</div>
					</div>
					<div className='w-full border-t my-4 border-gray-300'></div>
					<div className='block'>
						<h3 className='text-lg my-4 font-bold'>Add Field</h3>
						<form noValidate>
							<div className='flex flex-wrap -mx-3 mb-4'>
								<div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
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
								<div className='w-full md:w-1/2 px-3'>
									<label className='block text-gray-700 text-sm font-bold mb-2'>
										Label
									</label>
									<input
										className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
										type='text'
										{...register('label')}
									/>
									{errors.label && (
										<span className='text-xs tracking-wide text-red-600'>
											{errors.label.message}
										</span>
									)}
								</div>
							</div>
							<div className='mb-4'>
								<label className='block text-gray-700 text-sm font-bold mb-2'>
									Type
								</label>
								<select
									className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
									{...register('type')}
								>
									<option value='text'>text</option>
									<option value='email'>email</option>
									<option value='tel'>tel</option>
									<option value='number'>number</option>
									<option value='date'>date</option>
								</select>
								{errors.type && (
									<span className='text-xs tracking-wide text-red-600'>
										{errors.type.message}
									</span>
								)}
							</div>
							<div className='form-check my-4'>
								<input
									className='form-check-input h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer'
									type='checkbox'
									{...register('required')}
								/>
								<label className='form-check-label inline-block text-md text-gray-800'>
									Required field
								</label>
								{errors.required && (
									<span className='text-xs tracking-wide text-red-600'>
										{errors.required.message}
									</span>
								)}
							</div>
							<button
								className='bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline'
								type='button'
								onClick={handleSubmit(
									({ name, label, type, required }) =>
										addFieldToForm(
											name,
											label,
											type,
											required,
											form._id,
										),
								)}
							>
								Add Field
							</button>
							{error && (
								<span className='text-xs tracking-wide text-red-600 mt-4 block'>
									{error.message}
								</span>
							)}
						</form>
					</div>
					<div className='w-full border-t my-4 border-gray-300'></div>
					<div className='block'>
						<h3 className='text-xl my-4 font-bold'>Form Fields</h3>
						<div className='block'>
							{form.fields && form.fields.length > 0 ? (
								<div className='block'>
									{form.fields.map(
										(field: any, index: any) => {
											return (
												<div
													key={index}
													className='mb-4'
												>
													<span className='block text-gray-700 text-sm font-bold mb-2'>
														{field.name}
														{field.required && (
															<small className='ml-1 text-red-500'>
																*
															</small>
														)}
													</span>
													<input
														className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
														type='text'
														value={field.name}
														disabled
													/>
												</div>
											);
										},
									)}
								</div>
							) : (
								<div className='block text-gray-500'>
									No Fields
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<Link to='/' className='my-2'>
				Back to Forms
			</Link>
		</Layout>
	);
};

const mapStateToProps = (state: any) => ({
	user: state.user,
	form: state.form,
	error: state.form.error,
});

const mapDispatchToProps = (dispatch: any) => ({
	getForm: (id: any) => dispatch(get(id)),
	addFieldToForm: (
		name: any,
		label: any,
		type: any,
		required: any,
		formId: any,
	) => dispatch(addField(name, label, type, required, formId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddFormPage);

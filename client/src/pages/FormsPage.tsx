import React, { FC, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';

import { getAll } from '../app/thunks/form.thunk';

import { Layout } from '../template/Layout';

type Props = {
	user: any;
	formsList: any;
	getAllForms: Function;
};

const FormsPage: FC<Props> = ({ user, getAllForms, formsList }) => {
	useEffect(() => {
		getAllForms();
	}, [getAllForms]);

	const token = localStorage.getItem('token') || user.token;

	if (!token) {
		return <Navigate to={'/login'} replace />;
	}

	return (
		<Layout>
			<div className='px-8 py-6 m-4 text-left bg-white shadow-lg w-[800px]'>
				<div className='flex flex-col'>
					<div className='flex justify-between items-center'>
						<h3 className='text-2xl my-4 font-bold'>Forms List</h3>
						<Link
							to='/add'
							className='inline-block bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer'
						>
							Add Form
						</Link>
					</div>
					<div className='overflow-hidden shadow-md sm:rounded-lg'>
						<table className='min-w-full'>
							<thead className='bg-gray-100 dark:bg-gray-700'>
								<tr>
									<th
										scope='col'
										className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase'
									>
										# ID
									</th>
									<th
										scope='col'
										className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase'
									>
										NAME
									</th>
									<th
										scope='col'
										className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase'
									>
										SUBMISSIONS
									</th>
									<th
										scope='col'
										className='relative py-3 px-6'
									>
										<span className='sr-only'>Edit</span>
									</th>
								</tr>
							</thead>
							<tbody>
								{formsList && formsList.length > 0 ? (
									formsList.map((form: any, index: any) => {
										return (
											<tr
												key={index}
												className='border-b odd:bg-white even:bg-gray-50'
											>
												<td className='py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap'>
													{form._id}
												</td>
												<td className='py-4 px-6 text-sm text-gray-500 whitespace-nowrap'>
													{form.name}
												</td>
												<td className='py-4 px-6 text-sm text-gray-500 whitespace-nowrap'>
													{form.submissions.length}
												</td>
												<td className='py-4 px-6 text-sm font-medium text-right whitespace-nowrap'>
													<Link
														to={`/edit/${form._id}`}
														className='text-blue-600 dark:text-blue-500 hover:underline mr-4'
													>
														Edit
													</Link>
													<Link
														to={`/view/${form._id}`}
														className='text-blue-600 dark:text-blue-500 hover:underline mr-4'
													>
														View
													</Link>
													<Link
														to={`/submissions/${form._id}`}
														className='text-blue-600 dark:text-blue-500 hover:underline'
													>
														Submissions
													</Link>
												</td>
											</tr>
										);
									})
								) : (
									<tr className='border-b'>
										<td
											colSpan={4}
											className='py-4 px-6 text-center font-medium text-gray-900 whitespace-nowrap'
										>
											No forms
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</Layout>
	);
};

const mapStateToProps = (state: any) => ({
	formsList: state.form.list,
	user: state.user,
});

const mapDispatchToProps = (dispatch: any) => ({
	getAllForms: () => dispatch(getAll()),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormsPage);

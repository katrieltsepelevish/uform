import React, { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Navigate, useParams } from 'react-router-dom';

import { get } from '../app/thunks/form.thunk';

import { Layout } from '../template/Layout';

type Props = {
	user: any;
	form: any;
	getForm: Function;
};

const SubmissionsPage: FC<Props> = ({ user, form, getForm }) => {
	const [isInitiallyMounted, setIsInitiallyMounted] = useState(false);

	const { id } = useParams();

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

	const renderTable = (fields: any, submissions: any) => {
		const columns: any = {};

		const renderedColumns = fields.map((field: any, index: any) => {
			Object.assign(columns, { [field.label]: field.name });

			return (
				<th
					key={index}
					scope='col'
					className='py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400'
				>
					{field.name}
					{field.required && (
						<small className='ml-1 text-red-500'>*</small>
					)}
				</th>
			);
		});

		const renderRows = submissions.map((submission: any) => {
			return (
				<tr className='border-b dark:border-gray-600'>
					{Object.entries(columns).map(([key]: any) => {
						return submission.values[key] ? (
							<td
								className='py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap'
								key={key}
							>
								{submission.values[key]}
							</td>
						) : (
							<td
								className='py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap'
								key={key}
							></td>
						);
					})}
				</tr>
			);
		});

		return (
			<div className='overflow-hidden shadow-md sm:rounded-lg'>
				<table className='min-w-full'>
					<thead className='bg-gray-100 dark:bg-gray-700'>
						<tr>{renderedColumns}</tr>
					</thead>
					{submissions && submissions.length > 0 ? (
						<tbody>{renderRows}</tbody>
					) : (
						<tbody>
							<tr className='border-b '>
								<td
									colSpan={100}
									className='py-4 px-6 text-center font-medium text-gray-900 whitespace-nowrap'
								>
									No submissions
								</td>
							</tr>
						</tbody>
					)}
				</table>
			</div>
		);
	};

	return (
		<Layout>
			<div className='px-8 py-6 m-4 text-left bg-white shadow-lg w-[800px]'>
				<div className='flex flex-col'>
					<h3 className='text-2xl my-4 font-bold'>
						Submissions
						<small className='ml-2 font-light text-md text-gray-500'>
							(FORMID #{form._id})
						</small>
					</h3>
					{renderTable(form.fields, form.submissions)}
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
});

const mapDispatchToProps = (dispatch: any) => ({
	getForm: (id: any) => dispatch(get(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SubmissionsPage);

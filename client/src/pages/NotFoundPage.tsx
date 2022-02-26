import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
			<h3 className='text-[64px] font-bold text-center'>404</h3>
			<span className='block text-gray-600 text-[18px]'>
				Page not found
			</span>
			<Link to='/' className='mt-2'>
				GO HOME
			</Link>
		</div>
	);
};

export default NotFoundPage;

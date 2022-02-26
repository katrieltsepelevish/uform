import React, { FC } from 'react';

import Header from './Header';

export const Layout: FC = ({ children }) => {
	return (
		<div className='flex flex-col items-center min-h-screen bg-gray-100'>
			<Header />
			{children}
		</div>
	);
};

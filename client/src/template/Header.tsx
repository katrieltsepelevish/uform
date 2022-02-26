import React, { FC } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { logout } from '../app/thunks/user.thunk';

type Props = {
	logout: Function;
};

const Header: FC<Props> = ({ logout }) => {
	return (
		<div className='py-6 m-4 text-left w-[800px]'>
			<div className='flex justify-between items-center'>
				<div className='block'>
					<strong className='text-3xl font-bold text-center'>
						uForm
					</strong>
				</div>
				<div className='block'>
					<Link to='/' className='mr-4'>
						Forms
					</Link>
					<button
						className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center'
						onClick={() => logout()}
					>
						Logout
					</button>
				</div>
			</div>
		</div>
	);
};

const mapDispatchToProps = (dispatch: any) => ({
	logout: () => dispatch(logout()),
});

export default connect(null, mapDispatchToProps)(Header);

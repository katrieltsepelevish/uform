import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import userModel from '../models/user.model';

import { logger } from '../utils/logger.util';
import { validate } from '../utils/validator.util';

import { userSchema } from '../validations/user.schema';

import { config } from '../config';

class UserController {
	/**
	 * Register new user
	 * @param req
	 * @param res
	 * @returns
	 */
	static async register(req: Request, res: Response) {
		const [error] = validate(req.body, userSchema);

		if (error)
			return res
				.status(HttpStatus.BAD_REQUEST)
				.json({ message: error.message });

		const { name, email, password } = req.body;

		const user = await userModel.findOne({ email: email });

		if (user)
			return res
				.status(HttpStatus.BAD_REQUEST)
				.json({ message: 'User already exists.' });

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = await userModel.create({
			name,
			email,
			password: hashedPassword,
		});

		logger.info(`User ${newUser._id} successfully created.`);

		const token = jwt.sign({ id: newUser._id }, config.jwtSecret);

		return res.status(HttpStatus.CREATED).json({
			id: newUser._id,
			email: newUser.email,
			name: newUser.name,
			token,
		});
	}

	/**
	 * Login into user
	 * @param req
	 * @param res
	 * @returns
	 */
	static async login(req: Request, res: Response) {
		passport.authenticate(
			'local',
			{ session: false },
			(error: any, user: any, info: any) => {
				if (error)
					return res
						.status(HttpStatus.INTERNAL_SERVER_ERROR)
						.json({ message: error.message });

				if (!user)
					return res
						.status(HttpStatus.BAD_REQUEST)
						.json({ message: 'Wrong Credentials' });

				req.login(user, { session: false }, (error) => {
					if (error)
						return res
							.status(HttpStatus.INTERNAL_SERVER_ERROR)
							.json({ message: error.message });

					const token = jwt.sign(
						{ id: user._doc._id },
						config.jwtSecret,
					);
					return res.status(HttpStatus.OK).json({ token });
				});
			},
		)(req, res);
	}

	/**
	 * Get user data
	 * @param req
	 * @param res
	 * @returns
	 */
	static async me(req: Request, res: Response) {
		const user = await userModel.findById(req.user!._id);

		return res.status(HttpStatus.OK).json({
			id: user!._id,
			email: user!.email,
			name: user!.name,
		});
	}
}

export default {
	register: UserController.register,
	login: UserController.login,
	me: UserController.me,
};

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import passportLocal from 'passport-local';
import passportJWT from 'passport-jwt';
import bcrypt from 'bcryptjs';

import { config } from './config';

import { logger } from './utils/logger.util';

import userModel from './models/user.model';

import appRouter from './routes';

const app = express();

/* Middlewares */
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

/* Passport Configurations */
app.use(passport.initialize());

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
		},
		async (email, password, cb) => {
			try {
				const user = await userModel.findOne({ email });

				if (!user) {
					return cb(null, false, {
						message: 'Incorrect email or password.',
					});
				}

				const isPassValid = await bcrypt.compare(
					password,
					user.password,
				);

				if (!isPassValid) {
					return cb(null, false, {
						message: 'Incorrect email or password.',
					});
				}

				return cb(null, user, { message: 'Logged in successfully.' });
			} catch (e) {
				return cb(e);
			}
		},
	),
);

passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.jwtSecret,
		},
		async (jwtPayload, cb) => {
			try {
				const user = await userModel.findOne({ _id: jwtPayload.id });

				return cb(null, user);
			} catch (e) {
				return cb(e);
			}
		},
	),
);

/* Connect to MongoDB database */
const connect = () => {
	const options = {
		keepAlive: 1,
		useNewUrlParser: true,
	} as mongoose.MongooseOptions;
	mongoose.connect(config.mongoURL as string, options);

	return mongoose.connection;
};

const connection = connect();

connection
	.on('error', console.error)
	.on('disconnected', connect) // Reconnect on disconnection
	.once('open', () => logger.info('[MongoDB] Database Server started...'));

/* Routes */
app.use(config.routesPrefix, appRouter);

/* Start HTTP server on Enviroment PORT */
app.listen(config.port, () => {
	logger.info(
		`[Express] Server started successfully on port ${config.port}...`,
	);
});

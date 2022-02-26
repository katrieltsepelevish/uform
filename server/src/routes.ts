import express from 'express';
import passport from 'passport';

/* Controllers */
import formController from './controllers/form.controller';
import userController from './controllers/user.controller';

const appRouter = express.Router();

/* User Routes */
appRouter.post('/auth/register', userController.register);
appRouter.post('/auth/login', userController.login);
appRouter.get(
	'/auth/me',
	passport.authenticate('jwt', { session: false }),
	userController.me,
);

/* Form Routes */
appRouter.get(
	'/form',
	passport.authenticate('jwt', { session: false }),
	formController.getAll,
);
appRouter.get(
	'/form/:id',
	passport.authenticate('jwt', { session: false }),
	formController.get,
);
appRouter.post(
	'/form',
	passport.authenticate('jwt', { session: false }),
	formController.create,
);
appRouter.post(
	'/form/:id/field',
	passport.authenticate('jwt', { session: false }),
	formController.field,
);
appRouter.post('/form/:id/submit', formController.submit);

export default appRouter;

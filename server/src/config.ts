import dotenv from 'dotenv';

dotenv.config();

export const config = {
	enviroment: process.env.NODE_ENV! === 'production',
	port: process.env.PORT!,
	routesPrefix: process.env.ROUTES_PREFIX!,

	jwtSecret: process.env.JWT_SECRET!,

	clientUrl: process.env.CLIENT_URL!,

	/* MongoDB configuration */
	mongoURL: process.env.MONGODB_URL!,
};

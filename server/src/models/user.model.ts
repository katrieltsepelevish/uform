import mongoose, { Document, Schema } from 'mongoose';

export interface UserDocument extends Document {
	__v: number;
	_id: string;
	name: string;
	email: string;
	password: string;
}

const UserSchema: Schema = new Schema<UserDocument>(
	{
		name: { type: String },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
	},
	{ timestamps: true },
);

export default mongoose.model<UserDocument>('User', UserSchema);

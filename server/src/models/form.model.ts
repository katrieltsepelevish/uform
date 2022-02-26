import mongoose, { Document, Schema } from 'mongoose';

export interface FormDocument extends Document {
	__v: number;
	_id: string;
	name: string;
	userId: any;
	fields: any;
	submissions: any;
}

const FormSchema: Schema = new Schema<FormDocument>(
	{
		name: { type: String, required: true },
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		fields: [{ type: Schema.Types.ObjectId, ref: 'Field' }],
		submissions: [{ type: Schema.Types.ObjectId, ref: 'Submission' }],
	},
	{ timestamps: true },
);

export default mongoose.model<FormDocument>('Form', FormSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface FieldDocument extends Document {
	__v: number;
	_id: string;
	name: string;
	label: string;
	type: string;
	required: boolean;
	formId: any;
}

const FieldSchema: Schema = new Schema<FieldDocument>(
	{
		name: { type: String, required: true },
		label: { type: String, required: true },
		type: {
			type: String,
			enum: ['text', 'email', 'tel', 'number', 'date'],
			required: true,
		},
		required: { type: Boolean, default: false },
		formId: { type: Schema.Types.ObjectId, ref: 'Form', required: true },
	},
	{ timestamps: true },
);

export default mongoose.model<FieldDocument>('Field', FieldSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface SubmissionDocument extends Document {
	__v: number;
	_id: string;
	values: object;
	formId: any;
}

const SubmissionSchema: Schema = new Schema<SubmissionDocument>(
	{
		values: { type: Object, required: true },
		formId: { type: Schema.Types.ObjectId, ref: 'Form' },
	},
	{ timestamps: true },
);

export default mongoose.model<SubmissionDocument>(
	'Submission',
	SubmissionSchema,
);

import mongoose, { Schema, model, Types } from "mongoose";

const categorySchema = new Schema({
	name: {
		type: String,
		unique: true,
		required: true
	},

	image: {
		type: Object,
		required: true
	},
	slug: {
		type: String,
		required: true
	},
	createdBy: {type:Types.ObjectId,
		 ref: 'User'
	},
	updatedBy: {type:Types.ObjectId,
		 ref: 'User'
	},
	status: {
		type: String,
		default: 'Active',
		enum: ['Active', 'NotActive']
	}
},
	{
		timestamps: true,
	});

const categoryModel = model('Category', categorySchema);
export default categoryModel;


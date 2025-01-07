import mongoose, { Schema, model, Types } from "mongoose";

const productSchema = new Schema({
	name: {
		type: String,
		unique: true,
		required: true,
		trim:true
	},
	description:{
		type:String,
		unique: true
	},
	stock:{
		type:Number,
		default:1
	},
	price:{
		type:Number,
		unique: true
	},
	image: {
		type: Object,
		required: true
	},
	slug: {
		type: String,
		required: true
	},
	categoryId:{
		type:Types.ObjectId,
		ref:"Category",
		required:true
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

const productModel = model('Product', productSchema);
export default productModel;


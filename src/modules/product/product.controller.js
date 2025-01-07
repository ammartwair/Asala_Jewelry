import slugify from "slugify";
import productModel from "../../../db/model/product.model.js";
import categoryModel from "../../../db/model/category.model.js";

import cloudinary from "../../utls/cloudinary.js";

export const create = async(req,res)=>{

	const {name,categoryId} = req.body;

	const checkCategory = await categoryModel.findById(categoryId);
	if(!checkCategory){
		return res.status(404).json({ msg: "Category not found" });

	}

	req.body.slug = slugify(name);

	const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
			folder: `${process.env.APPNAME}/product/${name}`,
		});
		req.body.image = {secure_url, public_id};


		const product = await productModel.create(req.body);
		return res.status(201).json({msg: "success", product });

};

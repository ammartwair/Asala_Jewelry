
import categoryModel from "../../../db/model/category.model.js";
import cloudinary from "../../utls/cloudinary.js";
import slugify from 'slugify';

export const create = async(req,res)=>{

try {

	req.body.name = req.body.name.toLowerCase();
	if (await categoryModel.findOne({name:req.body.name})){
		return res.status(409).json({message:"Category already exists"});
	}

	if (!req.file) {
		return res.status(400).json({ message: "No file uploaded" });
	}
	req.body.slug = slugify(req.body.name);

	const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
		folder: `${process.env.APPNAME}/categories`,
	});
	req.body.image = {secure_url, public_id};
	req.body.createdBy = req.user._id;
	req.body.updatedBy = req.user._id;

	const category = await categoryModel.create(req.body);

	return res.json({msg:category});

} catch (error) {
    console.error("Error while uploading to Cloudinary:", error);
    res.status(500).json({ message: "Server error while uploading file." });
}

}

export const getAll = async(req,res)=>{
	const categories = await categoryModel.find({});
	return res.status(200).json({msg:"success",categories});
}

export const getActive = async(req,res)=>{
	const categories = await categoryModel.find({status:'Active'}).select("name");
	return res.status(200).json({msg:"success",categories});
}

export const getDetails = async(req,res)=>{
	const category = await categoryModel.findById(req.params.id);
	return res.status(200).json({msg:"success",category});

}

export const update = async(req,res)=>{
	const category = await categoryModel.findById(req.params.id);
	if (!category) {
		return res.status(404).json({ msg: "Category not found" });
	}

	category.name = req.body.name.toLowerCase();
	if (await categoryModel.findOne({name:req.body.name,_id:{$ne:req.params.id}})){
		return res.status(409).json({msg:"name already exists"});
	}

	category.slug = slugify(req.body.name);

	if(req.file){
		const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,{
			folder: `${process.env.APPNAME}/categories`,
		});
		    cloudinary.uploader.destroy(category.image.public_id);
			category.image = {secure_url, public_id};
	}

	category.status = req.body.status;
	req.body.updatedBy = req.user._id;

	await category.save();
	return res.json({msg:"success",category});
}

export const destroy = async(req,res)=>{
	const category = await categoryModel.findByIdAndDelete(req.params.id);
	if(!category){
		return res.status(404).json({message:"Category not found"});
	}
	await cloudinary.uploader.destroy(category.image.public_id);
	return res.json({msg:"Category was successfuly deleted"});
}

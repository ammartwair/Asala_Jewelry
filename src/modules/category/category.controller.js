
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
		folder: 'Asala_Jewelry/categories',
	});
	req.body.image = {secure_url, public_id};
	const category = await categoryModel.create(req.body);

	return res.json({msg:category});

} catch (error) {
    console.error("Error while uploading to Cloudinary:", error);
    res.status(500).json({ message: "Server error while uploading file." });
}

}

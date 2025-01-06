import userModel from "../../../db/model/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from "../../utls/email.js";
import { customAlphabet, nanoid } from 'nanoid'


export const register = async(req,res)=>{
	const {userName,email,password} = req.body;

	const user = await userModel.findOne({email});

	if(user){
		return res.status(400).json({msg:"Email already exists"});
	}

	const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));

	const createUser = await userModel. create({userName, email, password:hashedPassword});

	await sendEmail(email,`Welcome to our website`,`<h2>Welcome to our website ${userName}</h2>`);

	return res.status(201).json({msg:"success",user:createUser});

}

export const login = async(req,res)=>{
	const {email,password} = req.body;
	const user = await userModel.findOne({email});
	if(!user){
		return res.status(400).json({msg:"Email not found"});
	}
	const match = await bcrypt.compare(password,user.password);

	if(user.status == "NotActive"){
		return res.status(400).json({msg:"Your account is blocked"});

	}

	if(!match){
		return res.status(400).json({msg:"Invalid password"});
	}

	const token = jwt.sign({id:user._id, role:user.role}, process.env.LOGINSIG);

	return res.status(200).json({msg:"success",token});

}

export const sendCode = async(req,res)=>{
	const {email} = req.body;
	const code = customAlphabet('1234567890abcdef', 4)();
	const user = await userModel.findOneAndUpdate({email},{sendCode:code},{new:true});
	if(!user){
		return res.status(400).json({msg:"Email not found"});
	}
	await sendEmail(email,`reset password`, `<h2>code is : ${code}</h2>`)
	return res.status(200).json({msg:"success",code});


}

export const forgotPassword = async(req,res)=>{
	const {email,password,code} = req.body;
	const user = await userModel.findOne({email});

	if (!user){
		return res.status(404).json({msg:"Email not found"});
	}

	if(user.sendCode != code){
		return res.status(400).json({msg:"Invalid code"});
	}
	user.password = await bcrypt.hash(password,parseInt(process.env.SALTROUND));

	user.sendCode = null;

	await user.save();
	
	return res.status(200).json({msg:"success"});

}


import userModel from "../../../db/model/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const register = async(req,res)=>{
	const {userName,email,password} = req.body;

	const user = await userModel.findOne({email});

	if(user){
		return res.status(400).json({msg:"Email already exists"});
	}

	const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));

	const createUser = await userModel. create({userName, email, password:hashedPassword});

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

import userModel from "../../../db/model/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from "../../utls/email.js";
import { customAlphabet, nanoid } from 'nanoid'


export const confirmEmail = async (req, res) => {
    const { token } = req.query;

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.EMAIL_CONFIRM_SECRET);

        // Find the user by ID
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Check if email is already confirmed
        if (user.confirmEmail) {
            return res.status(400).json({ msg: "Email already confirmed" });
        }

        // Update user's confirmation status
        user.confirmEmail = true;
        await user.save();

        return res.status(200).json({ msg: "Email confirmed successfully" });
    } catch (error) {
        return res.status(400).json({ msg: "Invalid or expired token" });
    }
};


export const register = async(req,res)=>{
	const {userName,email,password} = req.body;

	const user = await userModel.findOne({email});

	if(user){
		return res.status(400).json({msg:"Email already exists"});
	}

	const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));

	const createUser = await userModel. create({userName, email, password:hashedPassword});

	const token = jwt.sign({ id: createUser._id }, process.env.EMAIL_CONFIRM_SECRET, { expiresIn: '1h' });

	const confirmationUrl = `${process.env.BASE_URL}/api/auth/confirm-email?token=${token}`;

    // Send confirmation email
    await sendEmail(email, "Confirm Your Email", `<h2>Welcome, ${userName}!</h2>
        <p>Please confirm your email by clicking the link below:</p>
        <a href="${confirmationUrl}">Confirm Email</a>
        <p>This link will expire in 1 hour.</p>`);

	return res.status(201).json({msg:"success",user:createUser});

}

export const login = async(req,res)=>{
	const {email,password} = req.body;
	const user = await userModel.findOne({email});
	if(!user){
		return res.status(400).json({msg:"Email not found"});
	}

	if(!user.confirmEmail){
		return res.status(400).json({msg:"please confirm you email "});
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


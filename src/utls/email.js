import nodemailer from 'nodemailer';

export async function  sendEmail(to,subject,html) {
	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
    	port: 587,
        secure: false,
		auth: {
		  user: process.env.EMAILSENDER,
		  pass: process.env.EMAILPASSWORD,
		},
		connectionTimeout: 20000, // 20 seconds
	  });

	  const info = await transporter.sendMail({
		from: `"Asala_Jewelry" <${process.env.EMAILSENDER}>`, // sender address
		to, // list of receivers
		subject, // Subject line
		html,
	  });
	  return info;
}



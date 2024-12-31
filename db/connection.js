import mongoose from "mongoose"
const connectDB = async()=>{
	mongoose.connect(process.env.DB)
	.then(()=>{
		console.log("DB connected");
	}) .catch(()=>{
		console.log('error to connect db ${err}');
	})
}
export default connectDB;

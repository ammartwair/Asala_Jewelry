import { roles } from "../../middleware/auth.js";

export const endPoints = {
	create :[roles.Admin],
	
	get:[roles.Admin],
	getActive:[roles.Admin,roles.User],
	update:[roles.Admin],
	destroy:[roles.Admin],
}

import { roles } from "../../middleware/auth.js";

export const endPoints = {
	getUsers:[roles.Admin],
	getUserDate:[roles.Admin,roles.User],
}

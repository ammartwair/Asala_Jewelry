import { roles } from "../../middleware/auth.js";

export const endPoints = {
	create :[roles.Admin, roles.User],
	destroy :[roles.Admin, roles.User],
}

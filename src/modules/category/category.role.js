import { roles } from "../../middleware/auth.js";

export const endPoints = {
  create: [roles.Admin, roles.User],
  get: [roles.Admin, roles.User],
  getActive: [roles.Admin, roles.User],
  update: [roles.Admin],
  destroy: [roles.Admin],
};

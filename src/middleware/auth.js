import jwt from "jsonwebtoken";
import userModel from "../../db/model/user.model.js";

export const roles = {
  User: "User",
  Admin: "Admin",
};

export const auth = (accessRole = []) => {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization?.startsWith(process.env.BEARERTOKEN)) {
      return res.status(400).json({ msg: "invalid token" });
    }

    const token = authorization.split(process.env.BEARERTOKEN)[1];
    const decoded = jwt.verify(token, process.env.LOGINSIG);

    if (!decoded) {
      return res.status(400).json({ msg: "invalid token" });
    }

    const user = await userModel.findById(decoded.id).select("userName role");
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    if (!accessRole.includes(user.role)) {
      return res.status(403).json({ msg: "not auth user" });
    }

    req.user = user;
    next();
  };
};

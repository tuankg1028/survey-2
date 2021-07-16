import Utils from "../utils";
import Services from "../services";
import Models from "../models";
class Authentication {
  // async isAdmin(req, res, next) {
  //   try {
  //     let token = req.headers["authorization"] || "";
  //     const userId = await Utils.ValidateToken.validate(token);

  //     if (!userId) {
  //       throw new CustomException(errorCodes.AUTH_401);
  //     }

  //     let user = await Model.Admin.findByPk(userId, {
  //       attributes: ["id", "fullName", "phoneNumber", "email", "avatar"]
  //     });
  //     if (!user) {
  //       throw new CustomException(errorCodes.AUTH_401);
  //     }

  //     req.user = user;

  //     next();
  //   } catch (error) {
  //     next(new CustomException(errorCodes.AUTH_401));
  //   }
  // }

  async isUser(req, res, next) {
    try {
      const { token } = req.session;
      // const userId = await Utils.ValidateToken.validate(token);
      if (!token) return res.redirect("/auth/login");

      let user = await Services.Authentication.verifyToken(token);

      user = await Models.User.findById(user.id);
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  }
}

export default Authentication;

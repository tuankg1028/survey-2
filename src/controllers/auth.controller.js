import Models from "../models";
import Utils from "../utils";
import bcrypt from "bcrypt";
import Services from "../services";
import { validationResult } from "express-validator";

class AuthController {
  async login(req, res, next) {
    try {
      const errors = req.session.errors;
      delete req.session.errors;
      delete req.session.user;

      res.render("auth/login", { errors });
    } catch (error) {
      next(error);
    }
  }

  async signup(req, res, next) {
    try {
      const errors = req.session.errors;
      delete req.session.errors;

      res.render("auth/signup", { isSignedUp: false, errors });
    } catch (error) {
      next(error);
    }
  }

  async signupHandle(req, res, next) {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.session.errors = errors.array();
        return res.redirect("/auth/signup");
      }

      const {
        email,
        fullName,
        education,
        country,
        age,
        gender,
        fieldOfWork
      } = req.body;
      // hash password

      let user = await Models.User.create({
        email,
        fullName,
        education,
        country,
        age,
        gender,
        fieldOfWork
      });

      if (!user) throw Error(res, "Create account failed");
      res.redirect("/auth/login");
    } catch (error) {
      next(error);
    }
  }

  async loginHandle(req, res, next) {
    try {
      const { email, pass } = req.body;

      let user = await Models.User.findOne({
        email
      }).cache(60 * 60 * 24 * 30); // 1 month;

      if (!user) {
        req.session.errors = [
          {
            msg: "Email is incorrect"
          }
        ];

        return res.redirect("/auth/login");
      }

      // generate token
      const token = Services.Authentication.genToken(user.toJSON());
      req.session.token = token;

      res.redirect("/");
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;

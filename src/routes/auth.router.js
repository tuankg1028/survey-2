import { Router } from "express";
const router = Router();
import Controllers from "../controllers";
import Validators from "../validators";
import Middlewares from "../middlewares";

// const validateInputMiddleware = Middlewares.Validation.validateInput;
const creationValidator = Validators.Auth.create();
//   getOneValidator = Validators.Auth.update(),
//   updationValidator = Validators.Auth.update(),
//   deleteValidator = Validators.Auth.delete();
router.get("/login", Controllers.Auth.login);
router.get("/signup", Controllers.Auth.signup);

router.post("/signup", creationValidator, Controllers.Auth.signupHandle);
router.post(
  "/login",
  // [creationValidator, validateInputMiddleware],
  Controllers.Auth.loginHandle
);
// router.get("/", Controllers.Auth.getAll);
// router.post(
//   "/",
//   [creationValidator, validateInputMiddleware],
//   Controllers.Auth.create
// );
// router.get(
//   "/:id",
//   [getOneValidator, validateInputMiddleware],
//   Controllers.Auth.getOne
// );
// router.put(
//   "/:id",
//   [updationValidator, validateInputMiddleware],
//   Controllers.Auth.update
// );
// router.delete(
//   "/:id",
//   [deleteValidator, validateInputMiddleware],
//   Controllers.Auth.delete
// );

export default router;

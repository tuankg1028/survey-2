import { check } from "express-validator";
import Models from "../models";
class AuthValidator {
  // CREATE
  create() {
    return [
      check("email")
        .notEmpty()
        .withMessage("email is required")
        .bail()
        .isEmail()
        .withMessage("email is invalid")
        .bail()
        .custom(async email => {
          const user = await Models.User.findOne({
            email
          });

          if (user) throw Error("The email is already in use");

          return true;
        })
    ];
  }

  // GET
  getOne() {
    return [
      check("id")
        .isUUID()
        .withMessage("ID must be a UUID")
    ];
  }

  // UPDATE
  update() {
    return [
      //   check("name")
      //     .not()
      //     .isEmpty()
      //     .withMessage("Name is required")
      //     .bail()
      //     .custom(async (name, { req }) => {
      //       const { id: aircraftTypeId } = req.params;
      //       if (aircraftTypeId) {
      //         let result = await Models.AirCraftType.findOne({
      //           where: {
      //             name: {
      //               [Op.like]: name
      //             },
      //             id: {
      //               [Op.not]: aircraftTypeId
      //             }
      //           }
      //         });
      //         if (result) throw new Error("Name already exists");
      //       }
      //     })
    ];
  }

  delete() {
    return [
      check("id")
        .isUUID()
        .withMessage("ID must be a UUID")
    ];
  }
}

export default AuthValidator;

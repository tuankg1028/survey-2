import jwt from "jsonwebtoken";

class Authentication {
  constructor() {
    this.secretKey = process.env.SECRET_TOKEN || "0SSy70L18V3w7p83fl33";
  }

  genToken(payload) {
    return jwt.sign(payload, this.secretKey, {
      expiresIn: 24 * 60 * 60
    });
  }

  verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secretKey, (err, decoded) => {
        if (err) return reject(err);
        return resolve(decoded);
      });
    });
  }

  getUnexpireToken(payload) {
    return jwt.sign(payload, this.secretKey);
  }
}

export default Authentication;

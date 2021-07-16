import jwkToPem from "jwk-to-pem";
import jwt from "jsonwebtoken";
import rp from "request-promise";
import * as _ from "lodash";

const verifyPayloadClaims = payload => {
  if (!_.isEqual(payload.aud, process.env.AWS_APP_CLIENT_ID)) {
    return false;
  }

  if (
    !_.isEqual(
      payload.iss,
      `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_POOL_CLIENT_ID}`
    )
  ) {
    return false;
  }

  if (!_.isEqual(payload.token_use, "id")) {
    return false;
  }
  return true;
};

const validate = async token => {
  let isValid;
  let userId = null;
  let body = await rp({
    url: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_POOL_CLIENT_ID}/.well-known/jwks.json`,
    json: true
  });

  const pems = {};
  const { keys } = body;
  for (let i = 0; i < keys.length; i++) {
    const keyId = keys[i].kid;
    const modulus = keys[i].n;
    const exponent = keys[i].e;
    const keyType = keys[i].kty;
    const jwk = { kty: keyType, n: modulus, e: exponent };
    const pem = jwkToPem(jwk);
    pems[keyId] = pem;
  }

  const decodedJwt = await jwt.decode(token, { complete: true });
  if (!decodedJwt) {
    isValid = false;
  }

  const { kid } = decodedJwt.header;
  const pem = pems[kid];
  if (!pem) {
    isValid = false;
  }

  await jwt.verify(token, pem, async (err, payload) => {
    if (err) {
      isValid = false;
    } else {
      const isValidPayload = await verifyPayloadClaims(payload);
      isValid = isValidPayload;
      userId = payload.sub;
    }
  });

  return userId;
};

export default { validate };

import { assertIsError } from './error';

const jwt = require('jsonwebtoken');
const shortId = require('shortid');
const secretKey = 'ThisIsVeryImportantSecretKey';

export const generateToken = (data) => {
  try {
    const claims = {
      jwtid: shortId.generate(),
      iat: Date.now(),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8, // must be 8 hours
      sub: 'authToken',
      iss: 'syChat',
      data: data,
    };

    const tokenDetails = {
      token: jwt.sign(claims, secretKey),
      //   tokenSecret: secretKey,
    };

    return tokenDetails;
  } catch (err) {
    assertIsError(err);
    return null;
  }
};

export const verifyClaim = async (token) => {
  try {
    const decoded = await jwt.verify(token, secretKey);
    return decoded;
  } catch (err) {
    assertIsError(err);
    return null;
  }
};

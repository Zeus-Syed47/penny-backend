import { assertIsError } from './error';

const bcrypt = require('bcryptjs');

const saltRounds = 10;

export const hashPassword = (typedPassword) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(typedPassword, salt);
  return hash;
};
export const comparePassword = async (typedPassword, retrivedPassword) => {
  try {
    const match = await bcrypt.compare(typedPassword, retrivedPassword);
    if (match) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    assertIsError(err);
    return false;
  }
};

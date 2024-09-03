import { LoginUserDto } from './dto/login-user.dto';
import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose from 'mongoose';
import { Auth } from './schemas/auth.schema';
import { emailCheck } from 'src/utils/paramsCheck';
import { ReplyFormat, requestBuilder } from 'src/utils/requestBuilder';
import { assertIsError } from 'src/utils/error';
import { formatResponse } from 'src/utils/queryResponseFormatter';
import { comparePassword, hashPassword } from 'src/utils/password';
import { generateToken } from 'src/utils/token';
import { isEmpty } from 'src/utils/varCheck';
import { LogoutUserDto } from './dto/logout-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    @InjectModel(Auth.name)
    private authModel: mongoose.Model<Auth>,
  ) {}
  async findUsers(): Promise<ReplyFormat> {
    try {
      const user = await this.userModel.find();

      return requestBuilder(user, 'users fetched successfully', true, 200);
    } catch (err) {
      assertIsError(err);
      return requestBuilder(null, 'Some error occurred', false, 403);
    }
  }

  async findUser(email): Promise<User> {
    try {
      const user = await this.userModel.findOne({
        email: email,
      });
      if (isEmpty(user)) {
        return null;
      } else {
        return formatResponse(user);
      }
    } catch (err) {
      assertIsError(err);
      return null;
    }
  }

  async findAuth(user_id): Promise<Auth> {
    try {
      const auth = await this.authModel.findOne({
        user: user_id,
      });
      if (isEmpty(auth)) {
        return null;
      } else {
        return auth;
      }
    } catch (err) {
      assertIsError(err);
      return null;
    }
  }

  async findAuthByToken(token): Promise<Auth> {
    try {
      const auth = await this.authModel.findOne({
        auth_token: token,
      });
      if (isEmpty(auth)) {
        return null;
      } else {
        return auth;
      }
    } catch (err) {
      assertIsError(err);
      return null;
    }
  }

  async loginUser(@Body() body: LoginUserDto): Promise<ReplyFormat> {
    try {
      // request body check
      if (isEmpty(body?.email) || !emailCheck(body?.email)) {
        return requestBuilder(
          null,
          'Email does not meet the requirements',
          false,
          403,
        );
      } else if (isEmpty(body.password)) {
        return requestBuilder(null, 'Password field is missing', false, 403);
      }
      //

      // validateUser
      const retrievedUserDetails = await this.findUser(body.email);
      if (isEmpty(retrievedUserDetails)) {
        return requestBuilder(null, 'No User Found', false, 403);
      }
      //

      // comparePassword
      if (
        !(await comparePassword(body.password, retrievedUserDetails.password))
      ) {
        return requestBuilder(null, 'Wrong Password.Login Failed', true, 401);
      } else {
        delete retrievedUserDetails.password;
      }
      //

      // generate Token
      const tokenDetails: any = generateToken(retrievedUserDetails?._id);
      if (isEmpty(tokenDetails)) {
        return requestBuilder(null, 'Token Generation Failed', false, 403);
      }
      //

      // auth token updated
      const retrievedAuthDetails: any = await this.findAuth(
        retrievedUserDetails._id,
      );
      if (isEmpty(retrievedAuthDetails)) {
        await this.authModel.create({
          auth_token: tokenDetails?.token,
          user: retrievedUserDetails._id,
        });
      } else {
        retrievedAuthDetails.auth_token = tokenDetails?.token;
        await retrievedAuthDetails.save();
      }
      //

      const loginResponse: any = {
        token: tokenDetails?.token,
        user_details: retrievedUserDetails,
      };

      return requestBuilder(
        loginResponse,
        'user logged in successfully',
        true,
        200,
      );
    } catch (err) {
      assertIsError(err);
      return requestBuilder([], err?.message, false, 404);
    }
  }

  async signup(@Body() body: RegisterUserDto): Promise<ReplyFormat> {
    try {
      // valdateInputs

      if (!emailCheck(body.email)) {
        return requestBuilder(
          null,
          'Email does not meet the requiements',
          false,
          403,
        );
      } else if (isEmpty(body.password)) {
        return requestBuilder(null, 'Password field is missing', false, 403);
      }

      //

      // create a new user
      const user = await this.findUser(body.email);

      if (isEmpty(user)) {
        const newUser = await this.userModel.create({
          first_name: body?.first_name,
          last_name: body?.last_name,
          phone_number: body?.phone_number,
          email: body?.email,
          password: hashPassword(body?.password),
        });
        return requestBuilder(
          formatResponse(newUser),
          'user created successfully',
          true,
          200,
        );
      } else {
        return requestBuilder(null, 'User already Present', false, 403);
      }
      //
    } catch (err) {
      assertIsError(err);
      console.log('signup error', err);
      return requestBuilder(null, err.message, false, 403);
    }
  }

  async logout(@Body() body: LogoutUserDto): Promise<ReplyFormat> {
    try {
      await this.authModel.deleteOne({
        user: body.user_id,
      });
      return requestBuilder(null, 'user logged out successfully', true, 200);
    } catch (err) {
      assertIsError(err);
      return requestBuilder(null, err.message, false, 403);
    }
  }
}

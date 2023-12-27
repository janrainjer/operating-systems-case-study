import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginTicket, OAuth2Client } from "google-auth-library";
import { TokenPayload } from "./interface/tokenPayload.interface";
import { AccountType, User } from "../User/schemas/user.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { UserService } from "src/User/user.service";
import { AuthEmail, AuthGoogleLogin, RegistEmail } from "./dto/auth-login.dto";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registWithEmailPassword({ email, password, name }: RegistEmail) {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        const saltRounds = this.configService.get<number>(
          "credential.bcrypt_salt_round",
        );
        const hashedPassword = bcrypt.hashSync(password, saltRounds as number);

        const newUser = new this.userModel({
          email: email,
          password: hashedPassword,
          name: name,
        });

        newUser.save();

        return {
          message: "User's registed successful.",
        };
      } else {
        throw new HttpException(
          {
            message: "User with this email already exists.",
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(
        {
          message: "Registation fail.",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async loginWithEmailPassword({ email, password }: AuthEmail) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException(
        {
          message: "User or Password incorrect.",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const userId = await this.userService.findByEmailReturnId(user.email);
      if (userId) {
        return {
          accessToken: this.generateAccessToken(userId),
        };
      } else {
        throw new HttpException(
          {
            message: "User or Password incorrect.",
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException(
        {
          message: "User or Password incorrect.",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async authenticateWithGoogleOAuth({ credential }: AuthGoogleLogin) {
    const client = new OAuth2Client(
      this.configService.get<string>("oauth.id"),
      this.configService.get<string>("oauth.secret"),
    );
    let ticket: LoginTicket;
    try {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: this.configService.get("oauth.id"),
      });
    } catch (err) {
      throw new HttpException("Token is invalid.", HttpStatus.BAD_REQUEST);
    }

    const { email = "", name = "", picture = "" } = ticket.getPayload() || {};
    const user = await this.userService.findByEmail(email);
    if (!user) {
      const newUser = new this.userModel({
        email: email,
        name: name,
        accountType: AccountType.OAUTH,
        profile: picture,
      });
      await newUser.save();
      return {
        accessToken: this.generateAccessToken(newUser.id),
      };
    }

    const userId = await this.userService.findByEmailReturnId(user.email);
    if (userId) {
      return {
        accessToken: this.generateAccessToken(userId),
      };
    } else {
      throw new HttpException(
        {
          message: "User not found",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private generateAccessToken(userId: string) {
    const payload: TokenPayload = { userId };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>("credential.jwt_secret"),
      expiresIn: "1d",
    });
  }
}

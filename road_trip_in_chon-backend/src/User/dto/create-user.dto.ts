import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from "class-validator";
import { UserRole } from "../schemas/user.schema";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  readonly profile: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  readonly bio: string;

  @IsEnum(UserRole)
  readonly role: UserRole;

  @IsArray()
  @IsString({ each: true })
  readonly bookmark: string[];

  @IsArray()
  @IsString({ each: true })
  readonly postedBlogs: string[];
}

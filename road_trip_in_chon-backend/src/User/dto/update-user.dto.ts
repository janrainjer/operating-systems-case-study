import { IsString } from "class-validator";
import { UserRole } from "../schemas/user.schema";

export class UpdateUserDto {
  readonly password: string;
  readonly email: string;
  readonly profile: string;
  readonly name: string;
  readonly bio: string;
  readonly role: UserRole;
  readonly bookmark: string[];
  readonly postedBlogs: string[];
}

export class UpdateNameAndBioDto {
  @IsString()
  readonly name: string;
  @IsString()
  readonly bio: string;
}

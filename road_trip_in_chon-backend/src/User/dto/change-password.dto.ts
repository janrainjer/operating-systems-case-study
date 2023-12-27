import { IsString } from "class-validator";

export class ChangePasswordDto {
  @IsString()
  readonly oldPassword: string;
  @IsString()
  readonly newPassword: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { BufferedFile } from "src/minio-client/file.model";

export class ChangeUserProfileDto {
  @ApiProperty({ type: "string", format: "binary" })
  readonly image: BufferedFile;
}

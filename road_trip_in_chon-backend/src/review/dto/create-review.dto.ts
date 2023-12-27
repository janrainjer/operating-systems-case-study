import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";
import { Type } from "class-transformer";
import { BufferedFile } from "src/minio-client/file.model";

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  readonly blogId: string;

  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  readonly recommendActivity: string;

  @IsString()
  @IsNotEmpty()
  readonly spendTime: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  readonly rating: number;

  @ApiProperty({ type: "array", items: { type: "string", format: "binary" } })
  readonly images: BufferedFile[];
}

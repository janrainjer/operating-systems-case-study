import { IsNotEmpty } from "class-validator";
import {
  Category,
  Contact,
  EntrancePrice,
  Forbidden,
  OpenTime,
  SeparateRating,
} from "../schemas/blog.schema";

export class UpdateBlogDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly category: Category;

  readonly openTime: OpenTime[];
  readonly entrancePrice: EntrancePrice;

  @IsNotEmpty()
  readonly address: string;

  readonly rating: number;
  readonly reviewLength: number;
  readonly separateRating: SeparateRating;

  readonly reviews: string[];

  @IsNotEmpty()
  readonly latitude: string;

  @IsNotEmpty()
  readonly longitude: string;

  readonly forbidden: Forbidden;
  readonly contact: Contact;
  readonly images: string[];

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

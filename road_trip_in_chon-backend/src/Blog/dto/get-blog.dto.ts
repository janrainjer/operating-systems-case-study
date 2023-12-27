import mongoose from "mongoose";
import { OpenTime } from "../schemas/blog.schema";

export class BlogSummaryDto {
  readonly _id: mongoose.Types.ObjectId;
  readonly title: string;
  readonly category: string;
  readonly rating: number;
  readonly reviewLength: number;
  readonly address: string;
  readonly openTime: OpenTime[];
  readonly firstImage: string | null;
}

export class BlogAllDatadto {
  readonly _id: mongoose.Types.ObjectId;
  readonly title: string;
  readonly category: string;
  readonly rating: number;
  readonly latidude: string;
  readonly longtitude: string;
  readonly reviewLength: number;
  readonly address: string;
  readonly openTime: OpenTime[];
  readonly firstImage: string | null;
}

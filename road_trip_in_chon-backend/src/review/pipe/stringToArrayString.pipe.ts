import { PipeTransform, Injectable } from "@nestjs/common";
import { TransformFnParams } from "class-transformer";

@Injectable()
export class StringToArrayStringPipe implements PipeTransform {
  transform(value: TransformFnParams) {
    if (value.value === "") {
      return undefined;
    }
    return value.value.split(",");
  }
}

import { PipeTransform, Injectable } from "@nestjs/common";
import { TransformFnParams } from "class-transformer";

@Injectable()
export class EmptyStringToUndefinedPipe implements PipeTransform {
  transform(value: TransformFnParams) {
    if (value.value === "") {
      return undefined;
    }
    return value.value;
  }
}

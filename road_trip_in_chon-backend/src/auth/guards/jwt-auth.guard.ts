import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JsonWebTokenError } from "jsonwebtoken";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(
    err: unknown,
    user: unknown,
    info: unknown,
    context: ExecutionContext,
    status: unknown,
  ) {
    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException("Invalid JWT");
    }

    return super.handleRequest(err, user, info, context, status);
  }
}

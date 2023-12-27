import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { ReviewService } from "./review.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { Review } from "./schemas/review.schema";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { ReturnReviewDto } from "./dto/return-review.dto";
import { UserService } from "src/User/user.service";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { User } from "../User/schemas/user.schema";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CurrentUser } from "src/User/common/decorator/user.decorator";
import { BufferedFile } from "src/minio-client/file.model";
import { FilesInterceptor } from "@nestjs/platform-express";

@ApiTags("reviews")
@Controller("review")
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getAllReviews(): Promise<ReturnReviewDto[]> {
    const reviews = await this.reviewService.findAll();

    return await Promise.all(
      reviews.map(async (review) => {
        const returnReviewDto = new ReturnReviewDto();
        const user: User = await this.userService.findById(review.authorId);

        returnReviewDto.blogId = review.blogId;
        returnReviewDto.title = review.title;
        returnReviewDto.description = review.description;
        returnReviewDto.recommendActivity = review.recommendActivity;
        returnReviewDto.spendTime = review.spendTime;
        returnReviewDto.rating = review.rating;
        returnReviewDto.author = {
          _id: review.authorId,
          name: user.name,
          profile: user.profile,
        };
        returnReviewDto.score = review.score ? review.score : 0;
        returnReviewDto.images = review.images ? review.images : [];
        return returnReviewDto;
      }),
    );
  }

  @Get("/get-review-by-reviewid/:id")
  async getReviewsByBlogId(@Param("id") reviewId: string) {
    return await this.reviewService.findReviewbyReviewId(reviewId);
  }

  @Get("/get-review-by-blog-id/:id")
  async getReviewsByReviewId(@Param("id") blogId: string) {
    const reviews = await this.reviewService.findAllbyBlogId(blogId);

    return await Promise.all(
      reviews.map(async (review) => {
        const returnReviewDto = new ReturnReviewDto();
        const user: User = await this.userService.findById(review.authorId);
        const reviewId = await this.reviewService.findIdByRefId(review.refToId);

        returnReviewDto.id = reviewId;
        returnReviewDto.blogId = review.blogId;
        returnReviewDto.title = review.title;
        returnReviewDto.description = review.description;
        returnReviewDto.recommendActivity = review.recommendActivity;
        returnReviewDto.spendTime = review.spendTime;
        returnReviewDto.rating = review.rating;
        returnReviewDto.author = {
          _id: review.authorId,
          name: user.name,
          profile: user.profile,
        };
        returnReviewDto.score = review.score ? review.score : 0;
        returnReviewDto.images = review.images ? review.images : [];
        return returnReviewDto;
      }),
    );
  }

  @Post()
  @UseInterceptors(FilesInterceptor("images", 10))
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    type: CreateReviewDto,
  })
  async createReview(
    @UploadedFiles() images: BufferedFile[],
    @CurrentUser() user: User,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    return await this.reviewService.create(user, createReviewDto, images);
  }

  @Get("/get/:userId")
  async getReviewsByUserId(@Param("userId") userId: string) {
    const reviews = await this.reviewService.findAllByUserId(userId);

    return await Promise.all(
      reviews.map(async (review) => {
        const returnReviewDto = new ReturnReviewDto();
        const user: User = await this.userService.findById(review.authorId);
        const reviewId = await this.reviewService.findIdByRefId(review.refToId);

        returnReviewDto.id = reviewId;
        returnReviewDto.blogId = review.blogId;
        returnReviewDto.title = review.title;
        returnReviewDto.description = review.description;
        returnReviewDto.recommendActivity = review.recommendActivity;
        returnReviewDto.spendTime = review.spendTime;
        returnReviewDto.rating = review.rating;
        returnReviewDto.author = {
          _id: review.authorId,
          name: user.name,
          profile: user.profile,
        };
        returnReviewDto.score = review.score ? review.score : 0;
        returnReviewDto.images = review.images ? review.images : [];
        return returnReviewDto;
      }),
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("/like/:id")
  async voteUpReview(@CurrentUser() user: User, @Param("id") reviewId: string) {
    const userId = await this.userService.findByEmailReturnId(user.email);
    return await this.reviewService.voteReview(userId, reviewId, "up");
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("/dislike/:id")
  async voteDownReview(
    @CurrentUser() user: User,
    @Param("id") reviewId: string,
  ) {
    const userId = await this.userService.findByEmailReturnId(user.email);
    return await this.reviewService.voteReview(userId, reviewId, "down");
  }

  @Patch(":id")
  @UseInterceptors(FilesInterceptor("images", 10))
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    type: UpdateReviewDto,
  })
  async updateReview(
    @UploadedFiles() images: BufferedFile[],
    @Param("id") id: string,
    @Body()
    review: UpdateReviewDto,
  ): Promise<Review> {
    // console.log(review.oldImages);
    return await this.reviewService.updateById(id, review, images);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteReview(@Param("id") id: string): Promise<Review> {
    return await this.reviewService.deleteById(id);
  }
}

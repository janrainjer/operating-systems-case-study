import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Review } from "./schemas/review.schema";
import mongoose from "mongoose";
import { CreateReviewDto } from "./dto/create-review.dto";
import { BlogService } from "src/Blog/blog.service";
import { User } from "src/User/schemas/user.schema";
import { UserService } from "src/User/user.service";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { BufferedFile } from "src/minio-client/file.model";
import { MinioClientService } from "../minio-client/minio-client.service";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: mongoose.Model<Review>,
    private readonly blogService: BlogService,
    private readonly userService: UserService,
    private readonly minioClientService: MinioClientService,
  ) {}

  private async uploadMultipleImage(images: BufferedFile[]): Promise<string[]> {
    try {
      const uploadImages = await this.minioClientService.uploadMultiple(
        images,
        "reviews/",
      );
      const imageUrls = uploadImages.map((obj) => obj.url);
      if (imageUrls.length === 0) {
        throw new HttpException(
          "No image were uploaded",
          HttpStatus.BAD_REQUEST,
        );
      } else {
        return imageUrls;
      }
    } catch (err) {
      throw err;
    }
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewModel.find().exec();
  }

  async findAllbyBlogId(blogId: string): Promise<Review[]> {
    return await this.reviewModel.find({ blogId: blogId }).exec();
  }

  async findAllByUserId(userId: string): Promise<Review[]> {
    return await this.reviewModel.find({ authorId: userId }).exec();
  }

  async findReviewbyReviewId(reviewId: string): Promise<Review> {
    return (await this.reviewModel.findById(reviewId).exec()) as Review;
  }

  async voteReview(userId: string, reviewId: string, action: string) {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) throw new BadRequestException("not found this review-id");

    let vote = review.score;
    if (vote == undefined) vote = 0;

    if (action == "up") {
      vote += 1;
      this.userService.likeReviewByUserId(userId, reviewId);
    } else if (action == "down") {
      vote -= 1;
      this.userService.unLikeReviewByUserId(userId, reviewId);
    } else {
      throw new BadRequestException("vote-up or vote-down only");
    }

    review.score = vote;
    await review.save();

    return "vote successful";
  }

  async create(
    user: User,
    createReviewDto: CreateReviewDto,
    images: BufferedFile[],
  ): Promise<Review> {
    const userId = await this.userService.findByEmailReturnId(user.email);
    if (!userId) {
      throw new NotAcceptableException("Not Login");
    }
    try {
      const blogFound = await this.blogService.findById(createReviewDto.blogId);
      if (!blogFound) {
        throw new NotAcceptableException("No blog found.");
      }
    } catch (err) {
      throw new NotAcceptableException("No blog found");
    }
    let imageUrls: string[] = [];
    if (images.length > 0) {
      imageUrls = await this.uploadMultipleImage(images);
    }

    const uuid = uuidv4();
    const review: Review = {
      blogId: createReviewDto.blogId,
      authorId: userId,
      refToId: uuid,
      title: createReviewDto.title,
      description: createReviewDto.description,
      recommendActivity: createReviewDto.recommendActivity,
      spendTime: createReviewDto.spendTime,
      rating: createReviewDto.rating,
      images: imageUrls,
    };
    await this.blogService.updateImageById(review.blogId, review.images);

    const reviewSaved = await this.reviewModel.create(review);
    await this.blogService.updateBlogReviwsById(review.blogId, reviewSaved.id);
    await this.blogService.updateBlogSeparateRatingById(
      review.blogId,
      reviewSaved.rating,
    );
    await this.blogService.calculateOverallRating(review.blogId);
    await this.userService.addPostedReviewByuserId(userId, reviewSaved.id);

    return reviewSaved.save();
  }

  async findIdByRefId(refId: string | undefined) {
    const review = await this.reviewModel.findOne({ refToId: refId });
    if (!review) {
      return "";
    }

    return review.id;
  }

  async updateById(
    id: string,
    review: UpdateReviewDto,
    images: BufferedFile[],
  ): Promise<Review> {
    const savedReview = await this.reviewModel.findById(id).exec();
    if (!savedReview) {
      throw new NotFoundException("Review not found");
    }

    const previousRating = savedReview.rating;
    const newRating = review.rating;
    let imagesUrl = review.oldImages ? review.oldImages : [];
    if (images.length > 0) {
      imagesUrl = [...imagesUrl, ...(await this.uploadMultipleImage(images))];
    }
    if (newRating && previousRating !== newRating) {
      await this.blogService.deleteBlogSeparateRatingById(
        savedReview.blogId,
        previousRating,
      );
      await this.blogService.updateBlogSeparateRatingById(
        savedReview.blogId,
        newRating,
      );
    }

    return (await this.reviewModel
      .findByIdAndUpdate(
        { _id: id },
        { ...review, images: imagesUrl },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec()) as Review;
  }

  async deleteById(id: string): Promise<Review> {
    const reviewSaved = await this.reviewModel.findById(id);
    if (!reviewSaved) {
      throw new NotAcceptableException("Token is not valid");
    }
    await this.blogService.updateBlogReviwsById(
      reviewSaved.blogId,
      reviewSaved.id,
      false,
    );
    await this.blogService.deleteBlogSeparateRatingById(
      reviewSaved.blogId,
      reviewSaved.rating,
    );
    await this.blogService.calculateOverallRating(reviewSaved.blogId);
    await this.userService.addPostedReviewByuserId(
      reviewSaved.authorId,
      reviewSaved.id,
    );

    return (await this.reviewModel.findByIdAndDelete(id).exec()) as Review;
  }
}

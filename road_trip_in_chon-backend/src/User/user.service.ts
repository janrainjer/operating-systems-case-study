import {
  HttpException,
  BadRequestException,
  Injectable,
  NotFoundException,
  HttpStatus,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { BufferedFile } from "src/minio-client/file.model";
import { MinioClientService } from "src/minio-client/minio-client.service";
import { BlogService } from "src/Blog/blog.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<User>,
    private readonly configService: ConfigService,
    private readonly blogService: BlogService,
    private readonly minioClientService: MinioClientService,
  ) {}

  async findAll(): Promise<unknown[]> {
    const users: User[] = await this.userModel.find();
    return users.map((user: User) => ({
      profile: user.profile,
      name: user.name,
      bio: user.bio,
      bookmark: user.bookmark,
      postedBlogs: user.postedBlogs,
    }));
  }

  async create(user: CreateUserDto): Promise<User> {
    return await this.userModel.create(user);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = (await this.userModel
      .findOne({ email: email })
      .exec()) as User;
    if (!user) {
      return null;
    }

    return user;
  }

  async getBookmarkByUserId(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const bookmarkPromises = user.bookmark.map(async (bookmarkId) => {
      return this.blogService.findBriefBlogById(bookmarkId);
    });

    const blogs = await Promise.all(bookmarkPromises);

    return blogs;
  }

  async updateNameAndBioByUserId(userId: string, name: string, bio: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    user.name = name;
    user.bio = bio;
    await user.save();

    return "update successful";
  }

  async likeReviewByUserId(userId: string, reviewId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    let likedReview = user.likedReview;
    if (!likedReview) likedReview = [];
    for (const review in likedReview) {
      if (review == reviewId)
        throw new BadRequestException("user is already liked this blog");
    }
    likedReview.push(reviewId);

    await this.userModel.findByIdAndUpdate(
      userId,
      {
        ...user,
        likedReview: likedReview,
      },
      {
        new: true,
      },
    );

    return "like blog successful";
  }

  async unLikeReviewByUserId(userId: string, reviewId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    let likedReview = user.likedReview;
    if (!likedReview) likedReview = [];

    const index = likedReview.indexOf(reviewId);
    if (index == undefined)
      throw new NotFoundException("User never like this review");
    likedReview.splice(index, 1);

    await this.userModel.findByIdAndUpdate(
      userId,
      {
        ...user,
        likedReview: likedReview,
      },
      {
        new: true,
      },
    );

    return "unlike blog successful";
  }

  async addPostedReviewByuserId(userId: string, reviewId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    const postedReview = user.postedBlogs;
    const index = postedReview.indexOf(reviewId);
    if (index != undefined) user.postedBlogs.push(reviewId);
    await user.save();

    return "add successful";
  }

  async deletePostedReviewByuserId(userId: string, reviewId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    const postedReview = user.postedBlogs;
    const index = postedReview.indexOf(reviewId);
    if (index == undefined)
      throw new NotFoundException("User never posts this blog");
    user.postedBlogs.splice(index, 1);
    await user.save();

    return "delete successful";
  }

  async addBookmarkByUserId(userId: string, bookmarkId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    const bookmarkUser = user.bookmark;
    for (const bookmark in bookmarkUser) {
      if (bookmark == bookmarkId)
        throw new BadRequestException("user is already bookmarked this blog");
    }
    bookmarkUser.push(bookmarkId);

    await this.userModel.findByIdAndUpdate(
      userId,
      {
        ...user,
        bookmark: bookmarkUser,
      },
      {
        new: true,
      },
    );

    return "add bookmark successful";
  }

  async deleteBookmarkByUserId(userId: string, bookmarkId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    const bookmarkUser = user.bookmark;

    const index = bookmarkUser.indexOf(bookmarkId);

    if (index == undefined)
      throw new NotFoundException("User never bookmarks this blog");
    bookmarkUser.splice(index, 1);

    await this.userModel.findByIdAndUpdate(
      userId,
      {
        ...user,
        bookmark: bookmarkUser,
      },
      {
        new: true,
      },
    );

    return "delete bookmark successful";
  }

  async findByEmailReturnId(email: string): Promise<string> {
    const user = await this.userModel.findOne({ email: email }).exec();
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user.id;
  }

  async changeUserProfile(id: string, image: BufferedFile) {
    const user = this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException("User not found");
    }

    try {
      const uploaded_image = await this.minioClientService.upload(
        image,
        "profiles/",
      );
      return await this.userModel.findByIdAndUpdate(
        id,
        {
          ...user,
          profile: uploaded_image.url,
        },
        {
          new: true,
        },
      );
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findByIdAndChangePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException("User not found");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new BadRequestException("old password is invalid");

    let hashedPassword: string;
    try {
      const saltRounds = this.configService.get<number>(
        "credential.bcrypt_salt_round",
      );
      hashedPassword = bcrypt.hashSync(newPassword, saltRounds as number);
    } catch (err) {
      return {
        error: err,
      };
    }

    await this.userModel.findByIdAndUpdate(id, {
      password: hashedPassword,
    });

    return "Update password successful";
  }

  async updateById(id: string, user: UpdateUserDto): Promise<User> {
    return (await this.userModel
      .findByIdAndUpdate(id, user, {
        new: true,
        runValidators: true,
      })
      .exec()) as User;
  }

  async deleteById(id: string): Promise<User> {
    return (await this.userModel.findByIdAndDelete(id).exec()) as User;
  }
}

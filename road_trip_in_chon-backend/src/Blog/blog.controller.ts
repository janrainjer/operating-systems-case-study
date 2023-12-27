import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { BlogService } from "./blog.service";
import { Blog } from "./schemas/blog.schema";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { BlogAllDatadto, BlogSummaryDto } from "./dto/get-blog.dto";
import { UserRole } from "src/User/schemas/user.schema";
import { UserRoleGuard } from "src/User/common/decorator/role.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/User/guard/roles.guard";

@ApiTags("blogs")
@Controller("blogs")
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get()
  async getAllBlogs() {
    return await this.blogService.findAll();
  }

  @Get("/all-data")
  async getAllBlogsWithAllData() {
    return await this.blogService.findAllwithAllData();
  }

  @Get("/top-location")
  async getTopLocation() {
    return await this.blogService.findTopRatedBlogs();
  }

  @Post()
  @ApiBearerAuth()
  @UserRoleGuard(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createNewBlog(@Body() blog: CreateBlogDto): Promise<Blog> {
    return await this.blogService.create(blog);
  }

  @Get(":id")
  async getBlog(@Param("id") id: string): Promise<Blog> {
    await this.blogService.calculateOverallRating(id);
    return await this.blogService.findById(id);
  }

  @Get("/brief/:id")
  async getBriefBlogById(@Param("id") id: string): Promise<BlogSummaryDto> {
    await this.blogService.calculateOverallRating(id);
    return await this.blogService.findBriefBlogById(id);
  }

  @Get("/all-data/:id")
  async getAllDataBlogById(@Param("id") id: string): Promise<BlogAllDatadto> {
    await this.blogService.calculateOverallRating(id);
    return await this.blogService.findAllDataBlogById(id);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @UserRoleGuard(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateBlog(
    @Param("id") id: string,
    @Body() blog: UpdateBlogDto,
  ): Promise<Blog> {
    return await this.blogService.updateById(id, blog);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UserRoleGuard(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteBlog(@Param("id") id: string): Promise<Blog> {
    return await this.blogService.deleteById(id);
  }
}

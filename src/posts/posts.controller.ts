import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  UseGuards,
  UseFilters,
  SerializeOptions,
  Req,
} from '@nestjs/common';
import PostsService from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import { ExceptionsLoggerFilter } from 'src/utils/exceptionsLogger.filter';
import { HttpExceptionFilter } from 'src/utils/httpException.filter';
import { FindOneParams } from 'src/utils/findOneParams';
import User from 'src/users/user.entity';
import RequestWithUser from 'src/authentication/requestWithUser.interface';

@Controller('posts')
@SerializeOptions({
  strategy: 'excludeAll',
})
export default class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  // @UseFilters(ExceptionsLoggerFilter)
  @UseFilters(HttpExceptionFilter)
  getPostById(@Param() { id }: FindOneParams) {
    return this.postsService.getPostById(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createPost(@Body() post: CreatePostDto, @Req() req: RequestWithUser) {
    return this.postsService.createPost(post, req.user);
  }

  @Put(':id')
  async updatePost(
    @Param() { id }: FindOneParams,
    @Body() post: UpdatePostDto,
  ) {
    return this.postsService.updatePost(Number(id), post);
  }

  @Delete(':id')
  async deletePost(@Param() { id }: FindOneParams) {
    return this.postsService.deletePost(Number(id));
  }
}

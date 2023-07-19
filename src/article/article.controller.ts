import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { ArticleService } from './article.service';
import { GetUser } from '../user/decorator';
import { CreateArticleDto } from './dto';

@Controller('articles')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @UseGuards(JwtGuard)
  @Post()
  createArticle(
    @GetUser('id') authorId: number,
    @Body('article') dto: CreateArticleDto,
  ) {
    return this.articleService.createArticle(authorId, dto);
  }

  @Get(':slug')
  getArticle() {}

  @UseGuards(JwtGuard)
  @Delete(':slug')
  deleteArticle() {}

  @UseGuards(JwtGuard)
  @Patch(':slug')
  updateArticle() {}
}

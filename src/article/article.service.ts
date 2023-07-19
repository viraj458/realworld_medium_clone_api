import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import slugify from 'slugify';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async createArticle(userId: number, dto: CreateArticleDto) {
    const slug = slugify(dto.title, { lower: true });
    const article = await this.prisma.article.create({
      data: {
        slug,
        author: {
          connect: { id: userId },
        },
        tags: {
          create: dto.tagList.map((name) => ({
            name,
          })),
        },
        title: dto.title,
        description: dto.description,
        body: dto.description,
      },
      include: {
        author: true,
        tags: true,
      },
    });

    const formattedAuthor = {
      username: article.author.username,
      bio: article.author.bio,
      image: article.author.image,
    };

    const formattedData = {
      slug: article.slug,
      title: article.title,
      description: article.description,
      body: article.description,
      tagList: article.tags,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      author: formattedAuthor,
    };

    return { article: formattedData };
  }

  async getArticle(slug: string) {
    const article = await this.prisma.article.findFirst({
      where: {
        slug,
      },
      include: {
        author: true,
        tags: true,
      },
    });
    const formattedAuthor = {
      username: article.author.username,
      bio: article.author.bio,
      image: article.author.image,
    };

    const formattedData = {
      slug: article.slug,
      title: article.title,
      description: article.description,
      body: article.description,
      tagList: article.tags,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      author: formattedAuthor,
    };

    return { article: formattedData };
  }

  deleteArticle() {}

  updateArticle() {}
}

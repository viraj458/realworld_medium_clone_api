import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateArticleDto, UpdateArticleDto } from './dto';
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
    try {
      const article = await this.prisma.article.findUnique({
        where: {
          slug: slug,
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
    } catch (error) {
      console.log(error);
    }
  }

  async deleteArticle(slug: string, userId: number) {
    const article = await this.prisma.article.findUnique({
      where: {
        slug,
      },
    });

    if (!article || article.authorId !== userId) {
      throw new ForbiddenException('Access denied!!!');
    }

    await this.prisma.article.delete({
      where: {
        slug,
      },
    });
  }

  async updateArticle(slug: string, userId: number, dto: UpdateArticleDto) {
    const article = await this.prisma.article.findUnique({
      where: {
        slug,
      },
    });

    if (!article || article.authorId !== userId) {
      throw new ForbiddenException('Access denied!!');
    }

    const updated = await this.prisma.article.update({
      where: {
        slug,
      },
      data: {
        ...dto,
        tags: {
          create: dto.tagList.map((name) => ({
            name,
          })),
        },
      },
    });

    return { article: updated };
  }
}

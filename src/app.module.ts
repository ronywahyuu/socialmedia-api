import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
// import { PostsController } from './posts/posts.controller';
import { CommentModule } from './modules/comment/comment.module';
import { PostsModule } from './modules/posts/posts.module';
import { AuthModule } from './modules/auth/auth.module';
import { LikesModule } from './modules/likes/likes.module';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  controllers: [AppController],
  providers: [AppService, PrismaService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DevtoolsModule.register({
      http : process.env.NODE_ENV !== 'production',
    }),
    DatabaseModule,
    AuthModule,
    PostsModule,
    CommentModule,
    LikesModule,
    CategoriesModule,
  ],
})

// console.log('process.env.NODE_ENV', process.env.NODE_ENV);
export class AppModule {}

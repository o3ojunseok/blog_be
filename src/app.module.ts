import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { LoggerMiddleware } from './logger.middleware';
import { HttpExceptionFilter } from './common/exception/exception.filter';
import { RedisCacheModule } from './common/redis/redis-cache.module';
import { CommentModule } from './comment/comment.module';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { ChatModule } from './chat/chat.module';
import { TerminusModule } from '@nestjs/terminus';
import { DatabaseType } from './mysql-enum';
import { RecommentModule } from './recomment/recomment.module';
import { HeartModule } from './heart/heart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: ['dist/**/*.entity.{ts,js}'],
      synchronize: true,
      timezone: 'Z',
    }),
    // TypeOrmModule.forRoot({
    //   name: DatabaseType.SLAVE,
    //   type: 'mysql',
    //   host: process.env.DATABASE_HOST,
    //   port: parseInt(process.env.DATABASE_PORT, 10),
    //   username: process.env.DATABASE_USERNAME,
    //   password: process.env.DATABASE_PASSWORD,
    //   database: process.env.DATABASE_NAME_SLAVE,
    //   entities: ['dist/**/*.entity.{ts,js}'],
    //   synchronize: true,
    //   timezone: 'Z',
    // }),

    // mongo, batch
    // ScheduleModule.forRoot(),
    // MongooseModule.forRoot(process.env.MONGO_DB_URL, { dbName: process.env.DATABASE_NAME }),
    UserModule,
    ContentModule,
    RedisCacheModule,
    TerminusModule, 
    CommentModule,
    AuthModule,
    ChatModule,
    RecommentModule,
    HeartModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

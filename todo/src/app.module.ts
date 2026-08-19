import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { validate } from './config/env.validation';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { TagModule } from './tag/tag.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 1. Initialize ConfigModule globally and pass Zod validation function
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),

    // 2. Configure MikroORM asynchronously using ConfigService
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      driver: PostgreSqlDriver,
      useFactory: (configService: ConfigService) => {
        const isDev = configService.get<string>('NODE_ENV') === 'development';

        return defineConfig({
          driver: PostgreSqlDriver,
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          user: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          dbName: configService.get<string>('DB_NAME'),
          entities: [User],
          debug: isDev,
        });
      },
    }),

    UserModule,

    ProjectModule,

    TaskModule,

    TagModule,

    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

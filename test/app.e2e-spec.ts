import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { agent, SuperAgentTest } from 'supertest';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { INestApplication } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Todo } from '../src/todo/todo.entity';
import { Category } from '../src/category/category.entity';
import { TodoModule } from '../src/todo/todo.module';
import { CategoryModule } from '../src/category/category.module';
import { createTestData } from '../src/utils/testing-helpers/modelFactories';
jest.setTimeout(15000);

describe('e2e', () => {
  let app: INestApplication;
  let request: SuperAgentTest;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.env`,
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: 'schema.gql',
          sortSchema: true,
          debug: true,
          playground: true,
        }),
        SequelizeModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            dialect: 'postgres',
            host: configService.get('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            username: configService.get('DB_USER'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_DATABASE'),
            autoLoadModels: true,
            synchronize: true,
            logging: false,
            ssl: configService.get<boolean>('DB_SSL'),
			dialectOptions: configService.get<boolean>('DB_SSL') === true ? {
			  ssl: {
				require: true,
				rejectUnauthorized: false,
			  },
			} : {},
            models: [Todo, Category],
          }),
          inject: [ConfigService],
        }),
        TodoModule,
        CategoryModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableShutdownHooks();
    await app.init();
    request = agent(app.getHttpServer());
    await Todo.sync({ force: true });
    await Category.sync({ force: true });

    return await createTestData();
  });

  afterAll(async () => {
    return await app.close();
  });

  it('POST todos', (done) => {
    request
      .post('/graphql')
      .send({
        query:
          '{\n  todos {\n    id\n    text\n    isCompleted\n    categoryId\n    }\n}\n',
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.data).toEqual(
          expect.objectContaining({
            todos: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                text: expect.any(String),
                isCompleted: expect.any(Boolean),
                categoryId: expect.any(Number),
              }),
            ]),
          }),
        );
        done();
      });
  });
});

import { ModelCtor, Sequelize } from 'sequelize-typescript';
import { config } from 'dotenv';
config({ path: './.env' });

export async function createMemDB(models: ModelCtor[]): Promise<Sequelize> {
  const memDb = await new Sequelize({
    dialect: 'postgres',
    storage: ':memory:',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    logging: false,
  });
  await memDb.addModels(models);

  await memDb.sync({ force: true });

  return memDb;
}

import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const migrationUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!migrationUrl) {
  throw new Error('Defina DATABASE_URL ou DIRECT_URL no ambiente.');
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: {
    url: migrationUrl,
  },
});

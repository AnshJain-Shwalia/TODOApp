import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),

  // Database configuration
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432), // z.coerce transforms string "5432" into JS number 5432
  DB_USERNAME: z.string().default('postgres'),
  DB_PASSWORD: z.string({ message: 'DB_PASSWORD is required in .env' }),
  DB_NAME: z.string().default('todo_db'),
});

// Extract TypeScript type from Zod schema
export type Env = z.infer<typeof envSchema>;

// Custom validation function passed to NestJS ConfigModule
export function validate(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    console.error('❌ Environment validation failed:');
    console.error(result.error.format());
    throw new Error('Invalid environment variables');
  }

  // Returns coerced and validated data
  return result.data;
}
